import { useState } from 'react';

export function useFirebaseAlert() {
  const [alert, setAlert] = useState({
    variant: '',
    show: false,
    msg: '',
  });

  return [alert, setAlert];
}