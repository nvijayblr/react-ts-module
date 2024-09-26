import { format, utcToZonedTime } from 'date-fns-tz';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';

import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { DATE_FORMAT } from 'src/constants';
import { ChargeCalculationType } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import { useAppSelector } from 'src/core/store/hooks';
import { selectTimezoneForSiteId } from 'src/modules/sites/sitesSlice';
import { UiFormBuilder } from 'src/shared/containers/UiFormBuilder/UiFormBuilder';
import { J } from 'src/shared/containers/UiFormBuilder/joi-fields';
import {
  CheckboxField,
  MoneyField,
  SelectField,
  TextAreaField,
  TextField,
  UiSchema,
} from 'src/shared/containers/UiFormBuilder/uiSchemaModel';
import { useExtendedUiSchema } from 'src/shared/containers/UiFormBuilder/useExtendedUiSchema';

import { Adjustment } from '../../gql/getAdjustment.resources.gql';
import { getBillableLeasesOptionsForSite } from '../../gql/getBillableLeasesOptionsForSite.resources.gql';
import { getTenantsOptionsForSite } from '../../gql/getTenantsOptionsForSite.resources.gql';

import { generateBillOccurenceOption, identifyBillOccurenceOption } from './adjustmentBillPeriod.utils';

export type AdjustmentForm = Partial<
  Adjustment & {
    tenantId: number;
    occurence: string;
  }
>;

enum Taxable {
  NO = -1,
  YES = 1,
}

export const validationSchema = J.object<AdjustmentForm>({
  tenantId: J.number().required(),
  leaseId: J.number().required(),
  name: J.string().required(),
  description: J.string().nullable(),
  value: J.number().required(),
  order: J.number()
    .required()
    .valid(..._.values(Taxable)),
  occurence: J.string().required(),
  // hidden fields
  startDate: J.any(),
  endDate: J.any(),
  chargeCalculationType: J.string().default(ChargeCalculationType.FIXED_AMOUNT),
  isAdjustment: J.boolean().default(true),
});

const uiSchema: UiSchema<AdjustmentForm> = {
  gridTemplateColumns: '1fr 1fr',
  gridTemplateAreas: `
    'tenantId leaseId'
    'name name'
    'description description'
    'value order'
    'occurence occurence'
  `,
  fields: {
    tenantId: SelectField.with({ label: 'Tenant' }),
    leaseId: SelectField.with({ label: 'Lease' }),
    name: TextField.with({
      label: 'Name',
      description: 'Additional charge that will be included on billing report',
    }),
    description: TextAreaField.with({ label: 'Description' }),
    value: MoneyField.with({ label: 'Amount' }),
    order: new CheckboxField<Taxable>().copyWith({
      label: 'Taxable',
      description: 'Charge will be taxed on billing report, after creation flag cannot be changed',
      fieldsetClassName: 'mt-8',
      mapValueToFlag: (value) => (value === Taxable.YES ? true : false),
      mapFlagToValue: (flag) => (flag ? Taxable.YES : Taxable.NO),
    }),
    occurence: SelectField.with({ label: 'Apply to' }),
  },
};

interface Props {
  isCreationFlow: boolean;
  siteId: number;
  data: AdjustmentForm;
  onChange: (data: AdjustmentForm) => void;
}

const AdjustmentDetailsFormFields: React.FC<Props> = ({ siteId, data, onChange, isCreationFlow }) => {
  // TODO: move to Options API
  const { response: tenantOptions = [] } = useDataFetchOnMountWithDeps(
    () => getTenantsOptionsForSite(siteId),
    [siteId]
  );
  const { response: leaseOptions = [] } = useDataFetchOnMountWithDeps(
    () => getBillableLeasesOptionsForSite(siteId),
    [siteId]
  );

  useEffect(() => {
    // On mount define tenantId by leaseId
    if (!_.isEmpty(tenantOptions) && !_.isEmpty(leaseOptions)) {
      const tenantId = leaseOptions.find((i) => i.key === data.leaseId)?.config?.tenantId;
      if (tenantId) {
        onChange({ ...data, tenantId });
      }
    }
  }, [tenantOptions, leaseOptions]);

  const filteredLeases = data.tenantId
    ? leaseOptions.filter((lease) => lease.config?.tenantId === data.tenantId)
    : leaseOptions;
  const selectedLease = leaseOptions.find((i) => i.key === data.leaseId);

  // TODO: move to reusable hook
  const siteTimeZone = useAppSelector(selectTimezoneForSiteId(siteId));
  const currentTimeOnSite = useMemo(
    () => utcToZonedTime(new Date().toISOString(), siteTimeZone || 'UTC'),
    [siteTimeZone]
  );

  const occurenceOptions = useMemo(() => {
    return !selectedLease?.config?.startBillingDate
      ? []
      : [
          generateBillOccurenceOption(selectedLease?.config?.startBillingDate, currentTimeOnSite),
          generateBillOccurenceOption(selectedLease?.config?.startBillingDate, currentTimeOnSite, 1),
          generateBillOccurenceOption(selectedLease?.config?.startBillingDate, currentTimeOnSite, 2),
          generateBillOccurenceOption(selectedLease?.config?.startBillingDate, currentTimeOnSite, 3),
        ];
  }, [currentTimeOnSite, selectedLease?.config?.startBillingDate]);

  const occurence = useMemo(() => {
    if (data?.occurence) {
      return data.occurence;
    }
    if (isCreationFlow) {
      return undefined;
    }
    if (selectedLease?.config?.startBillingDate && !!data) {
      return identifyBillOccurenceOption(
        selectedLease?.config?.startBillingDate,
        currentTimeOnSite,
        data?.endDate ?? undefined
      );
    }
  }, [currentTimeOnSite, selectedLease?.config?.startBillingDate, data?.occurence, data?.endDate]);

  const nextBillsHint = useNextBillsDatesHint(occurence, occurenceOptions);

  const extendedUiSchema = useExtendedUiSchema(
    uiSchema,
    () => ({
      tenantId: {
        options: tenantOptions,
        disabled: !isCreationFlow,
      },
      leaseId: {
        options: filteredLeases,
        disabled: !isCreationFlow,
      },
      value: {
        disabled: !isCreationFlow,
      },
      order: {
        disabled: !isCreationFlow,
      },
      occurence: {
        options: occurenceOptions,
        disabled: _.isEmpty(occurenceOptions),
        hint: nextBillsHint,
      },
    }),
    [isCreationFlow, filteredLeases, tenantOptions, nextBillsHint]
  );

  function handleChange(newValue: AdjustmentForm) {
    if (newValue.leaseId !== data.leaseId) {
      // Automatically select related tenant on lease change
      const tenantId = leaseOptions.find((i) => i.key === newValue.leaseId)?.config?.tenantId;
      onChange({ ...newValue, tenantId });
    } else if (newValue.tenantId !== data.tenantId) {
      // Automatically select lease if there is only one under tenant
      const value = newValue.tenantId;
      const leases = leaseOptions.filter((lease) => lease.config?.tenantId === value);
      if (leases.length === 1) {
        onChange({ ...newValue, leaseId: leases[0].key, tenantId: value });
      } else {
        onChange({ ...newValue, leaseId: undefined, tenantId: value });
      }
    } else if (newValue.occurence !== data.occurence) {
      // Update hidden fields on occurence change
      const value = newValue.occurence;
      const frequency = occurenceOptions.find((i) => i.key === value);
      onChange({
        ...data,
        occurence: value,
        startDate: frequency?.config?.startDate,
        endDate: frequency?.config?.endDate,
      });
    } else {
      onChange(newValue);
    }
  }

  return (
    <UiFormBuilder
      schema={validationSchema}
      uiSchema={extendedUiSchema}
      formData={{ ...data, occurence }}
      onChange={handleChange}
      definePresence
    />
  );
};

const TYPE_TO_AMOUNT_OF_BILLS: Record<string, number> = {
  every_bill: 3,
  next_1_bill: 1,
  next_2_bill: 2,
  next_3_bill: 3,
};

function useNextBillsDatesHint(
  value: string | undefined,
  options: ReturnType<typeof generateBillOccurenceOption>[]
): string | undefined {
  const hint = useMemo(() => {
    if (!value) {
      return undefined;
    }

    const take = TYPE_TO_AMOUNT_OF_BILLS[value];
    const joinedDates = [options[1], options[2], options[3]].slice(0, take).map(formatDate).join('; ');

    return `(${joinedDates}${value === 'every_bill' ? '; ...' : ''})`;
  }, [value, options]);

  return hint;
}

function formatDate(item: ReturnType<typeof generateBillOccurenceOption>) {
  if (!item?.config?.endDate) {
    return undefined;
  }

  return format(item?.config?.endDate, DATE_FORMAT.DATE_SHORT, {
    timeZone: 'UTC',
  });
}

export default AdjustmentDetailsFormFields;
