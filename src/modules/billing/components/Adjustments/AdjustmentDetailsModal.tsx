import React, { useEffect, useState } from 'react';

import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { useValueChanged } from 'src/cdk/hooks/useValueChanged';
import { validateAndCleanup } from 'src/cdk/utils/validateAndCleanupForm';
import { ChargeCalculationType } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import Logger from 'src/core/service/logger';
import { Modal } from 'src/shared/components/Popup';

import { createAdjustment } from '../../gql/createAdjustment.resources.gql';
import { Adjustment, getAdjustment } from '../../gql/getAdjustment.resources.gql';
import { updateAdjustment } from '../../gql/updateAdjustment.resources.gql';

import { AdjustmentDetailsFormSkeleton } from './AdjustmentDetailsForm.skeleton';
import AdjustmentDetailsFormFields, { AdjustmentForm, validationSchema } from './AdjustmentDetailsFormFields';

const emptyAdjustment: AdjustmentForm = {
  name: 'Adjustment',
  order: 1,
  chargeCalculationType: ChargeCalculationType.FIXED_AMOUNT,
  isAdjustment: true,
  description: undefined,
  occurence: undefined,
};

interface Props {
  siteId: number;
  adjustmentId?: number;
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

const AdjustmentDetailsModal: React.FC<Props> = ({ siteId, ...props }) => {
  const adjustmentId = Number(props.adjustmentId);
  const isCreationFlow = isNaN(adjustmentId);

  const [adjustment, setAdjustment] = useState<AdjustmentForm>(emptyAdjustment);
  const { isChanged, setOriginalValue } = useValueChanged(adjustment);

  const {
    isLoading: isLoadingOriginalData,
    isFailed,
    response: originalAdjustment = emptyAdjustment,
  } = useDataFetchOnMountWithDeps<AdjustmentForm>(
    () => {
      if (!props.isOpen || isCreationFlow) {
        return Promise.resolve(emptyAdjustment);
      }
      return getAdjustment(siteId, adjustmentId).then((response) => {
        if (!response) {
          throw new Error('Adjustment not found');
        }
        return response;
      });
    },
    [props.isOpen, isCreationFlow, siteId, adjustmentId],
    true
  );

  useEffect(() => {
    if (isFailed) {
      Logger.error('Failed to load adjustment');
      props.onCancel();
    }
  }, [isFailed]);

  useEffect(() => {
    if (props.isOpen && !isLoadingOriginalData) {
      setAdjustment(originalAdjustment);
      setOriginalValue(originalAdjustment);
    } else {
      setAdjustment(emptyAdjustment);
      setOriginalValue(emptyAdjustment);
    }
  }, [originalAdjustment, props.isOpen, isLoadingOriginalData]);

  async function submitForm(): Promise<void> {
    const { data, valid } = await validateAndCleanup(validationSchema, adjustment);
    if (valid === false) {
      return;
    }

    if (isCreationFlow) {
      await createAdjustment(data as Adjustment);
      Logger.success('Adjustment created successfully');
      props.onAccept();
    } else {
      await updateAdjustment(siteId, { ...data, id: adjustment.id } as Adjustment);
      Logger.success('Adjustment updated successfully');
      props.onAccept();
    }
  }

  return (
    <Modal
      titleText={isCreationFlow ? 'Add Adjustment' : 'Adjustment Details'}
      subtitleText={isCreationFlow ? 'Provide adjustment details' : 'Update adjustment details'}
      acceptAction={submitForm}
      disableAccept={!isChanged || isLoadingOriginalData}
      cancelAction={() => {
        props.onCancel();
      }}
      isOpen={props.isOpen}
      actionButtonLabel={isCreationFlow ? 'Create' : 'Save'}
      cancelButtonLabel='Cancel'
    >
      {isLoadingOriginalData ? (
        <AdjustmentDetailsFormSkeleton />
      ) : (
        <AdjustmentDetailsFormFields
          siteId={siteId}
          data={adjustment}
          onChange={setAdjustment}
          isCreationFlow={isCreationFlow}
        />
      )}
    </Modal>
  );
};

export default AdjustmentDetailsModal;
