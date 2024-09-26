import { gql } from '@apollo/client';

import { InvoicesFilterInput } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import { resourcesAPI } from 'src/core/apollo/api';

import {
  GetInvoicesKPIForSiteQuery,
  GetInvoicesKPIForSiteQueryVariables,
} from './__generated__/getInvoicesKPIForSite.resources.gql';

export type InvoicesKPIForSite = Omit<GetInvoicesKPIForSiteQuery['getInvoicesKPIForSite'], '__typename'>;

const GET_SITE_INVOICES_FOR_TENANTS = gql`
  query GetInvoicesKPIForSite($siteId: Int!, $filter: InvoicesFilterInput!) {
    getInvoicesKPIForSite(siteId: $siteId, filter: $filter) {
      total
      totalPercentToPreviousPeriod
      energy
      energyPercentToPreviousPeriod
      demand
      demandPercentToPreviousPeriod
    }
  }
`;

export async function getInvoicesKPIForSite(siteId: number, filter: InvoicesFilterInput): Promise<InvoicesKPIForSite> {
  const result = await resourcesAPI.query<GetInvoicesKPIForSiteQuery, GetInvoicesKPIForSiteQueryVariables>({
    query: GET_SITE_INVOICES_FOR_TENANTS,
    variables: {
      siteId,
      filter: {
        from: filter.from,
        to: filter.to,
        tenantIds: filter.tenantIds,
        previousInterval: filter.previousInterval && {
          from: filter.previousInterval.from,
          to: filter.previousInterval.to,
        },
      },
    },
  });

  return result.data.getInvoicesKPIForSite;
}
