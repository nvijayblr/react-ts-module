import { extent } from 'd3-array';
import { utcToZonedTime } from 'date-fns-tz';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { numberWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { timestampInTZ } from 'src/cdk/utils/datetimeToDate';
import { N_A, UNIT } from 'src/constants';
import { MetricType, MetricsStep } from 'src/core/apollo/__generated__/utilityGlobalTypes';
import { useAppSelector } from 'src/core/store/hooks';
import { deDupMetrics, mapMetricToMethod } from 'src/core/utils/deDupMetrics';
import { ColorConfig } from 'src/enums';
import { selectTimezoneForSiteId } from 'src/modules/sites/sitesSlice';
import { DatePickerRangeType } from 'src/shared/components/DatePicker/DateRangePicker/config';
import {
  DateRangeWithIntervals,
  buildInitialDateRange,
} from 'src/shared/components/DatePicker/SmartDateRangePicker/DateRangePickerWithIntervals';
import { TooltipDataItem } from 'src/shared/components/charts/ComposableChart/ComposableTooltipTable';

import api from './gql';
import { MeterMetric, useUtilityMetersContext } from './useUtilityMetersContext';

// interface MeterMetric {
//   id: number;
//   measurement: MetricsMeasurementType;
//   meterId: number;
//   name?: string | null | undefined;
//   type: MetricType;
//   unit: UNIT;
//   precision: number;
//   styleVariant: ColorConfig;
//   tooltipIcon: 'square' | 'none' | 'line';
// }

export function useUtilityTrends(siteId: number) {
  const meters = useUtilityMetersContext();
  const timezone = useAppSelector(selectTimezoneForSiteId(siteId));

  const [dateTimeFilter, setDateTimeFilter] = useState(
    buildInitialDateRange(DatePickerRangeType.THIS_YEAR, MetricsStep.MONTH)
  );
  const [metricType, setMetricType] = useState<MetricType>();

  useEffect(() => {
    if (!metricType && meters.metricTypesOptions.length > 0) {
      setMetricType(meters.metricTypesOptions[0].key as MetricType);
    } else if (metricType && !meters.metricTypesOptions.find((i) => i.key === metricType)) {
      setMetricType(meters.metricTypesOptions[0].key as MetricType);
    }
  }, [meters.metricTypesOptions]);

  const metrics = useMemo(
    () => meters.metricTypesOptions.find((i) => i.key === metricType)?.config ?? [],
    [metricType, meters.metricTypesOptions]
  );

  const {
    isLoading: isLoadingMetricData,
    isFailed,
    response: chart,
  } = useDataFetchOnMountWithDeps(
    () => getMetricsDataForChart(dateTimeFilter, metrics, timezone || '', siteId),
    [siteId, metrics, timezone, dateTimeFilter],
    true
  );

  const firstMetric = metrics[0];
  const unit = firstMetric?.unit || UNIT.NUMBER;

  return {
    filtersStorageKey: meters.filtersStorageKey,
    isFailed,
    isLoading: isLoadingMetricData,
    title: `${firstMetric?.typeLabel ?? N_A} (${unit})`,
    unit,
    subtitle: '', // metric?.typeLabel,
    dateTimeFilter,
    setDateTimeFilter,
    metric: {
      ...firstMetric,
      id: metricType,
      setId: setMetricType,
      options: meters.metricTypesOptions,
    },
    // TODO: Add ability to toggle legend
    // legend: {
    //     visible: false,
    //     toggle: () => {},
    // },
    chart: chart || emptyData,
  };
}

interface MetricData {
  xDomain: Date[];
  yDomain: [number, number];
  isEmpty: boolean;
  tooltipData: Array<{ timestamp: Date; meterUID: string; value: number | null } & TooltipDataItem>;
  elements: {
    stackedBarChart?: {
      id: number;
      keys: string[];
      styleVariants: ColorConfig[];
      data: {
        timestamp: Date;
        values: { [metricId: string]: number | null };
      }[];
    };
    lineChart?: {
      id: number;
      styleVariant: ColorConfig;
      data: {
        timestamp: Date;
        value: number | null;
        exists: boolean;
      }[];
    };
  }[];
}

const emptyData: MetricData = {
  xDomain: [],
  yDomain: [0, 0],
  isEmpty: true,
  tooltipData: [],
  elements: [],
};

async function getMetricsDataForChart(
  dateTimeFilter: DateRangeWithIntervals,
  metricsToRequest: MeterMetric[],
  timezone: string,
  siteId: number
): Promise<MetricData> {
  if (_.isEmpty(metricsToRequest) || !timezone || !siteId) {
    console.warn('getMetricsDataForChart: Missing required params', {
      metricsToRequest,
      timezone,
      siteId,
    });
    return emptyData;
  }
  const metricIds = metricsToRequest.map((i) => i.id);
  const metricsIdMap = _.keyBy(metricsToRequest, 'id');

  const data = (
    await api.GetMetricsData({
      siteId,
      metricIds,
      metricsFilter: {
        // Convert selected time to UTC in site TZ
        // TS expects Date, but it is actually string
        from: timestampInTZ(dateTimeFilter.from, timezone) as unknown as Date,
        to: timestampInTZ(dateTimeFilter.to, timezone) as unknown as Date,
        step: dateTimeFilter.step,
        weekDays: dateTimeFilter.weekDays,
      },
    })
  ).getUtilityMetersMetricsData;

  // Convert timestamps to site timezone
  const convertedTime = data.map((metric) => ({
    ...metric,
    value: metric.value ?? null,
    timestamp: utcToZonedTime(metric.timestamp, timezone),
  }));

  // To remove duplicates
  const deDupedMetrics = deDupMetrics(
    convertedTime,
    (item) => `${item.metricId}_${item.timestamp.toISOString()}`,
    (item) => mapMetricToMethod(metricsIdMap[item.metricId]?.type)
  );

  // To display metrics in right order
  const metrics = deDupedMetrics.reverse();

  // Prepare xDomain, yDomain & data to render in chart
  const xDomain = _.chain(metrics)
    .map((i) => i.timestamp)
    .uniq()
    .orderBy()
    .value();
  let yDomain = extent(metrics, (i) => (i.exists ? i.value : undefined));
  yDomain = yDomain[0] === undefined ? [0, 0] : yDomain;

  const isEmpty = yDomain[0] === undefined || (yDomain[0] === 0 && yDomain[1] === 0);

  const stackedBarChartData = _.chain(metrics)
    .groupBy((i) => i.timestamp.toISOString())
    .toPairs()
    .map(([, dataPerTimestamp]) => ({
      timestamp: dataPerTimestamp[0].timestamp,
      values: _.chain(dataPerTimestamp).keyBy('metricId').mapValues('value').value(),
    }))
    .value();

  const tooltipData = metrics.map((i) => {
    const metric = metricsIdMap[i.metricId]!;

    const item: TooltipDataItem = {
      renderAs: metric.tooltipIcon,
      styleVariant: metric.styleVariant,
      id: i.metricId,
      label: metric.meterName ?? '',
      values: { val: numberWithCommasFormat(i.value, metric.precision) },
    };

    return {
      ...i,
      ...item,
      meterUID: metric.meterUID,
    };
  });

  return {
    xDomain,
    yDomain,
    isEmpty,
    elements: [
      {
        stackedBarChart: {
          id: -1,
          keys: metricsToRequest.map((i) => i.id.toString()),
          styleVariants: metricsToRequest.map((i) => i.styleVariant),
          data: stackedBarChartData,
        },
      },
    ],
    tooltipData,
  };
}
