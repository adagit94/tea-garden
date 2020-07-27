import { useState } from 'react';

export function useFirebaseAlert() {
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
  });

  return [alert, setAlert];
}