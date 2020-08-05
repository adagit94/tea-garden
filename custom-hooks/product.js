import { useState } from 'react';

export function useBtnPopover() {
  const [btnPopover, setBtnPopover] = useState({
    show: false,
    target: null,
  });

  return [btnPopover, setBtnPopover];
}
