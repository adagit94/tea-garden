import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Newsletter() {
  return (
    <Form
      action='https://gmail.us17.list-manage.com/subscribe/post?u=c406b9540c1975712b5df5937&amp;id=39c3df2e68'
      method='post'
      id='mc-embedded-subscribe-form'
      name='mc-embedded-subscribe-form'
      target='_blank'
      className='flex-column flex-sm-row justify-content-center'
      noValidate
      inline
    >
      <Form.Group className='d-flex flex-column flex-sm-row justify-content-center'>
        <Form.Label className='text-center' htmlFor='mce-EMAIL'>
          Odběr novinek
        </Form.Label>
        <Form.Control
          className='bg-footer text-black mx-sm-3'
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
      </Form.Group>
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
