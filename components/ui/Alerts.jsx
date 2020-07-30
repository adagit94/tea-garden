import React from 'react';
import Alert from 'react-bootstrap/Alert';

export function FirebaseAlert({variant, show, msg}) {
  return (
    <Alert className='mb-0 mt-3' variant={variant} show={show}>
      {msg}
    </Alert>
  );
}
