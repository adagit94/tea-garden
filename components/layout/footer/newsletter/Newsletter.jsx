import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Newsletter() {
  return (
    <Form
      action='https://gmail.us17.list-manage.com/subscribe/post?u=c406b9540c1975712b5df5937&amp;id=39c3df2e68'
      method='post'
      id='mc-embedded-subscribe-form'
      name='mc-embedded-subscribe-form'
      target='_blank'
      className='justify-content-center'
      noValidate
      inline
    >
      <Form.Label className='m-0' htmlFor='emailField'>
        Odběr novinek
      </Form.Label>
      <InputGroup className='p-2'>
        <Form.Control
          className='bg-footer text-black'
          placeholder='Váš email'
          type='email'
          name='EMAIL'
          id='mce-EMAIL'
        />
        <div
          style={{ position: 'absolute', left: '-5000px' }}
          aria-hidden='true'
        >
          <input
            type='text'
            name='b_c406b9540c1975712b5df5937_39c3df2e68'
            tabIndex='-1'
            defaultValue=''
          />
        </div>
        <Form.Control.Feedback>
          Byly jste přihlášeni k odběru novinek
        </Form.Control.Feedback>
      </InputGroup>
      <Button
        variant='outline-primary'
        type='submit'
        name='subscribe'
        id='mc-embedded-subscribe'
      >
        Potvrdit
      </Button>
    </Form>
  );
}
