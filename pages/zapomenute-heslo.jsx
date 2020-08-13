import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { sendPasswordReset } from '../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';

const PasswordResetSchema = Yup.object({
  email: Yup.string()
    .email('Zadejte e-mailovou adresu ve správném formátu.')
    .required('Zadejte e-mailovou adresu.'),
});

export default function ForgottenPassword() {
  const [alert, setAlert] = useFirebaseAlert();

  return (
    <Row lg={2}>
      <Col className='p-3'>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={PasswordResetSchema}
          onSubmit={values => {
            sendPasswordReset(values.email, setAlert);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors }) => (
            <Form
              className='text-center text-lg-left'
              onSubmit={handleSubmit}
              noValidate
            >
              <Form.Group controlId='password-reset-email-input'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  autoComplete='email'
                  isInvalid={touched.email && errors.email}
                  {...getFieldProps('email')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='m-0' controlId='password-reset-button'>
                <Button type='submit' variant='outline-primary'>
                  Odeslat
                </Button>
              </Form.Group>
            </Form>
          )}
        </Formik>
        <FirebaseAlert
          variant={alert.variant}
          show={alert.show}
          msg={alert.msg}
        />
      </Col>
      <Col className='d-none d-lg-block' />
    </Row>
  );
}
