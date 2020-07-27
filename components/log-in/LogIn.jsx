import Router from 'next/router'
import Link from 'next/link';
import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { loginEmail, loginProvider } from '../../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/registration/node_modules/components/ui/Alerts';

import styles from 'components/log-in/LogIn.module.scss';

const LogInSchema = Yup.object({
  email: Yup.string()
    .email('Zadejte e-mailovou adresu ve správném formátu.')
    .required('Zadejte e-mailovou adresu.'),
  password: Yup.string().required('Zadejte heslo.'),
});

export default function LogIn() {
  const [alert, setAlert] = useFirebaseAlert();
  
  useEffect(() => {
    Router.prefetch('/[uid]/settings');
  }, []);
  
  return (
    <Row className='p-3' xs={1} lg={2}>
      <Col className='px-0 pr-lg-3 pb-3 pb-lg-0'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LogInSchema}
          onSubmit={values => {
            loginEmail(values.email, values.password, setAlert);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Row>
                <Form.Group
                  as={Col}
                  className='d-flex flex-column align-items-center align-items-lg-start'
                  controlId='login-email-input'
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    autoComplete='on'
                    isInvalid={touched.email && errors.email}
                    {...getFieldProps('email')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group
                  as={Col}
                  className='d-flex flex-column align-items-center align-items-lg-start'
                  controlId='login-password-input'
                >
                  <Form.Label>Heslo</Form.Label>
                  <Form.Control
                    type='password'
                    autoComplete='on'
                    isInvalid={touched.password && errors.password}
                    {...getFieldProps('password')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group
                  as={Col}
                  className='m-0 d-flex justify-content-center justify-content-lg-start align-items-center'
                  controlId='login-button'
                >
                  <Button type='submit' variant='outline-primary'>
                    Přihlásit
                  </Button>
                </Form.Group>
                <Form.Group
                  as={Col}
                  className='m-0 d-flex justify-content-center justify-content-lg-end'
                >
                  <div className='d-flex flex-column'>
                    <Link href='/registrace'>
                      <a>Registrace</a>
                    </Link>
                    <Link href='/zapomenute-heslo'>
                      <a>Zapomenuté heslo</a>
                    </Link>
                  </div>
                </Form.Group>
              </Form.Row>
            </Form>
          )}
        </Formik>
        <FirebaseAlert show={alert.show} msg={alert.msg} />
      </Col>
      <Col
        className={`px-0 pt-3 pt-lg-0 pl-lg-3 d-flex flex-column justify-content-center align-items-center align-items-lg-start ${styles.authProviders}`}
      >
        <button
          onClick={() => {
            loginProvider('fb');
          }}
          className={`border-0 rounded p-2 mb-1 text-light text-xs-center text-lg-left w-50 ${styles.authProviderFacebook}`}
          type='button'
        >
          <img src='/icons/facebook.svg' alt='facebook účet' /> Příhlásit
          Facebook účtem
        </button>
        <button
          onClick={() => {
            loginProvider('google');
          }}
          className={`border-0 rounded p-2 mt-1 text-light text-xs-center text-lg-left w-50 ${styles.authProviderGoogle}`}
          type='button'
        >
          <img src='/icons/facebook.svg' alt='facebook účet' /> Příhlásit Google
          účtem
        </button>
      </Col>
    </Row>
  );
}
