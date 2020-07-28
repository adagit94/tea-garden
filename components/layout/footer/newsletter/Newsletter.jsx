import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Newsletter() {
  return (
    <>
      <Form className='justify-content-center' inline>
        <Form.Label className='m-0' htmlFor='emailField'>Odběr novinek</Form.Label>
        <InputGroup className='px-1'>
          <InputGroup.Prepend>
            <InputGroup.Text>@</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type='email' placeholder='Váš email' id='email-field' />
          <Form.Control.Feedback>
            Byly jste přihlášeni k odběru novinek
          </Form.Control.Feedback>
        </InputGroup>
        <Button type='submit' variant='outline-primary'>
          Potvrdit
        </Button>
      </Form>
    </>
  );
}
