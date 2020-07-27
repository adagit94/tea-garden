import React from 'react';
import Alert from 'react-bootstrap/Alert';

export function FirebaseAlert({show, msg}) {
  return (
    <Alert className='mb-0 mt-3' variant='danger' show={show}>
      {msg}
    </Alert>
  );
}
