import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

export function ProductBtnPopover({ show, target, container, popoverID }) {
  return (
    <Overlay
      className='bg-success'
      show={show}
      target={target}
      container={container}
    >
      <Popover id={popoverID}>
        <Popover.Content className='bg-success text-secondary'>
          Zboží bylo přidáno do košíku.
        </Popover.Content>
      </Popover>
    </Overlay>
  );
}
