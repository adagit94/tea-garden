import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

export function BtnPopover({
  bg,
  show,
  target,
  container,
  popoverID,
  children,
}) {
  return (
    <Overlay show={show} target={target} container={container}>
      <Popover id={popoverID}>
        <Popover.Content className={`bg-${bg} text-secondary`}>
          {children}
        </Popover.Content>
      </Popover>
    </Overlay>
  );
}
