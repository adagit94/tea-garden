import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import styles from 'components/prihlaseni/Prihlaseni.module.scss';

export default function LogIn() {
  return (
    <Row xs={1} lg={2}>
      <Col className='py-3'>
        <Form noValidate>
          <Form.Row>
            <Form.Group as={Col} className='d-flex flex-column align-items-center align-items-lg-start' controlId='prihlaseni-email-input'>
              <Form.Label className=''>Email</Form.Label>
              <Form.Control type='email' required />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} className='d-flex flex-column align-items-center align-items-lg-start' controlId='prihlaseni-password-input'>
              <Form.Label>Heslo</Form.Label>
              <Form.Control type='password' required />
            </Form.Group>
          </Form.Row>
          <Button type='submit' variant='outline-primary'>
            Přihlásit
          </Button>
        </Form>
      </Col>
      <Col className='py-3 d-flex flex-column justify-content-center align-items-lg-start'>
        <button
          className={`border-0 rounded p-2 mb-1 text-light text-xs-center text-lg-left ${styles.authProviderFacebook}`}
          type='button'
        >
          <img src='/icons/facebook.svg' alt='facebook účet' /> Příhlásit pomocí
          Facebook účtu
        </button>
        <button
          className={`border-0 rounded p-2 mt-1 text-light text-xs-center text-lg-left ${styles.authProviderGoogle}`}
          type='button'
        >
          <img src='/icons/facebook.svg' alt='facebook účet' /> Příhlásit pomocí
          Google účtu
        </button>
      </Col>
    </Row>
  );
}
