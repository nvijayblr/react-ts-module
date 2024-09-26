import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Simple wrapper around default React portal to render element in a specific portal.
 *
 * If portal is not found, it will silently return null.
 *
 * @warning If this hook is used after return statement, it will throw error, example:
 * ```
 * if (isLoading) {
 *  return <CircularLoader />;
 * }
 * return useInPortal(<div>Some content</div>, 'portal-id');
 * ```
 */
export function useInPortal(
  element: React.ReactElement,
  portalId: string,
  deps: React.DependencyList = []
): React.ReactElement {
  // TODO: find a way to force re-render after portalId is mounted

  // Force re-render on mount or when portalId changes,
  // because sometimes portal is not yet rendered to insert element into it.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    forceUpdate((prev) => prev + 1);
  }, [portalId, ...deps]);

  const portal = document.getElementById(portalId);

  return <>{portal ? createPortal(element, portal) : null}</>;
}
