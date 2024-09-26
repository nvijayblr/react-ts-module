import _ from 'lodash';
import React, { useState } from 'react';

import addToClipboard from 'src/cdk/utils/addToClipboard';
import { N_A } from 'src/constants';
import { toastService } from 'src/core/service/toastService';
import { Button } from 'src/shared/components/Button/Button';

interface Props {
  /**
   * @default 'secondary'
   */
  color?: 'secondary' | 'primary';
  children: string;
}

const ClipboardText: React.FC<Props> = ({ children, color = 'secondary' }) => {
  const [isMouseOver, setMouseOver] = useState(false);

  const noContent = children === N_A || _.isEmpty(children);

  return (
    <div
      className='d-flex gap-2 one-line-ellipsis align-items-center'
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <p className={`color-${color} one-line-ellipsis`} title={noContent ? undefined : children}>
        {children || N_A}
      </p>
      {noContent ? null : (
        <Button
          size='small'
          iconSize='s'
          icon='copy'
          iconColor='secondary'
          className={isMouseOver ? 'flex-none animated-visible' : 'flex-none animated-hidden'}
          onClick={() => {
            addToClipboard(children);
            toastService.success('Copied to clipboard');
          }}
        />
      )}
    </div>
  );
};

export default ClipboardText;
