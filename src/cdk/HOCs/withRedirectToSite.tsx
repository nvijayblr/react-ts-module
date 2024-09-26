/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectedSiteIdIfSingle } from '../../modules/sites/sitesSlice';

/**
 * This HOC intended to wrap pages that you want to redirect to site(details) page if only one site is selected.
 *
 * @usage
 * ```tsx
 * export withRedirectToSite(OverviewPage, RoutesResolver.BillingDetails);
 * ```
 *
 * @param Page - component to wrap
 * @param urlBuilder - builds url to redirect to
 */
function withRedirectToSite<T>(Page: React.FC<T>, urlBuilder: (siteId: number) => string): React.FC<T> {
  // eslint-disable-next-line react/display-name
  return (props: T): React.ReactElement => {
    const sitesId = useSelector(selectedSiteIdIfSingle);
    if (sitesId) {
      return <Navigate to={urlBuilder(sitesId)} replace />;
    }

    return <Page {...(props as any)} />;
  };
}

export default withRedirectToSite;
