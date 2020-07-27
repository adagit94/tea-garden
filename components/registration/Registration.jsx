import Router from 'next/router';
import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { createUser } from '../../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';

const RegistrationSchema = Yup.object({
  email: Yup.string()
    .email('Zadejte e-mailovou adresu ve správném formátu.')
    .required('Zadejte e-mailovou adresu.'),
  password: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.')
    .required('Zadejte heslo.'),
});

export default function Registration() {
  const [alert, setAlert] = useFirebaseAlert();

  useEffect(() => {
    Router.prefetch('/prihlaseni');
  }, []);

  return (
    <Row className='p-3' lg={2}>
      <Col className='px-0 pr-lg-3'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={RegistrationSchema}
          onSubmit={values => {
            createUser(values.email, values.password, setAlert);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Row>
                <Form.Group
                  as={Col}
                  className='d-flex flex-column align-items-center align-items-lg-start'
                  controlId='registration-email-input'
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    autoComplete='on'
                    isValid={touched.email && !errors.email}
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
                  controlId='registration-password-input'
                >
                  <Form.Label>Heslo</Form.Label>
                  <Form.Control
                    type='password'
                    autoComplete='off'
                    isValid={touched.password && !errors.password}
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
                  controlId='registration-button'
                >
                  <Button type='submit' variant='outline-primary'>
                    Registrovat
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
          )}
        </Formik>
        <FirebaseAlert show={alert.show} msg={alert.msg} />
      </Col>
      <Col className='d-none d-lg-block px-0 pl-lg-3' />
    </Row>
  );
}
