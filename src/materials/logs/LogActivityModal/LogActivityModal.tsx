import React, { useEffect, useState } from 'react';

import { AuditLogResourceType } from 'src/core/apollo/__generated__/logsGlobalTypes';
import { AUDIT_LOG_RESOURCE_TYPE_LABEL } from 'src/core/enum-labels';
import Logger from 'src/core/service/logger';
import { Modal } from 'src/shared/components/Popup';
import { OptionItem, Select } from 'src/shared/components/Select';
import { TextArea } from 'src/shared/components/TextArea/TextArea';

export interface LogActivityModalProps {
  isOpen: boolean;
  resources: OptionItem<string>[];
  resourceType: AuditLogResourceType;
  title: string;
  subtitleText: string;
  acceptAction: (resourceId: string, text: string) => void;
  cancelAction: () => void;
  activityLabel: string;
}

const LogActivityModal: React.FC<LogActivityModalProps> = (props) => {
  const [resourceId, setResourceId] = useState<string>();
  const [userNoteText, setUserNoteText] = useState('');

  useEffect(() => {
    if (props.resources.length === 1) {
      setResourceId(props.resources[0].key);
    } else {
      setResourceId(undefined);
    }
    setUserNoteText('');
  }, [props.isOpen]);

  return (
    <Modal
      isOpen={props.isOpen}
      acceptAction={(isValid) => {
        if (isValid && resourceId) {
          props.acceptAction(resourceId, userNoteText);
        } else {
          Logger.error('Please fill out all required fields');
        }
      }}
      cancelAction={props.cancelAction}
      titleText={props.title}
      subtitleText={props.subtitleText}
      actionButtonLabel='Save'
      cancelButtonLabel='Cancel'
    >
      {props.resources.length > 1 ? (
        <Select
          required
          value={resourceId}
          options={props.resources}
          labelPosition='up'
          label={AUDIT_LOG_RESOURCE_TYPE_LABEL[props.resourceType]}
          onClick={setResourceId}
        />
      ) : null}

      <div className='d-flex flex-col mt-16'>
        <p className='mb-8 color-secondary'>{props.activityLabel}</p>
        <TextArea
          required
          name='textValue'
          value={userNoteText}
          adjustHeightWhileTyping={false}
          maxLength={250}
          rows={6}
          onChange={(newValue) => {
            if (newValue.split('\n').length > 3) {
              return;
            }
            setUserNoteText(newValue);
          }}
          placeholder='Enter details here*'
        />
      </div>
    </Modal>
  );
};

export default LogActivityModal;
