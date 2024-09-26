import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AuditLogResourceType } from 'src/core/apollo/__generated__/logsGlobalTypes';
import { LogsTable } from 'src/materials/logs/public';

interface Props {
  resourceIdParamName: string;
  resourceType: AuditLogResourceType;
}

const LogsPage: React.FC<Props> = (props) => {
  const params = useParams();
  const id = params[props.resourceIdParamName];
  const resources = useMemo(() => [{ key: id!, displayValue: '' }], [id]);

  if (!id) {
    throw new Error('Cannot find resource identifier in the URL');
  }

  // TODO: Define how to find timezone for different resources
  return <LogsTable relatedSiteId={undefined} resources={resources} resourceType={props.resourceType} />;
};

export default LogsPage;
