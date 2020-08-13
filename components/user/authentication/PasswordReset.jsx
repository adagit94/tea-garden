import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { resetPassword } from '../../../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';

const PasswordResetSchema = Yup.object({
  password: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.')
    .required('Zadejte heslo.'),
  passwordConfirmation: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.')
    .required('Zadejte heslo.'),
});

export default function PasswordReset({ actionCode }) {
  const [alert, setAlert] = useFirebaseAlert();

  return (
    <Row lg={2}>
      <Col className='p-3'>
        <Formik
          initialValues={{ password: '', passwordConfirmation: '' }}
          validationSchema={PasswordResetSchema}
          onSubmit={values => {
            if (values.password !== values.passwordConfirmation) return;

            resetPassword(values.password, actionCode, setAlert);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, values, errors }) => (
            <Form
              className='text-center text-lg-left'
              onSubmit={handleSubmit}
              noValidate
            >
              <Form.Group controlId='password-reset-password-input'>
                <Form.Label>Heslo</Form.Label>
                <Form.Control
                  type='password'
                  autoComplete='new-password'
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && errors.password}
                  {...getFieldProps('password')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='password-reset-password-confirmation-input'>
                <Form.Label>Potvrzení hesla</Form.Label>
                <Form.Control
                  type='password'
                  autoComplete='new-password'
                  isValid={
                    touched.passwordConfirmation &&
                    !errors.passwordConfirmation &&
                    values.password === values.passwordConfirmation
                  }
                  isInvalid={
                    touched.passwordConfirmation &&
                    (errors.passwordConfirmation ||
                      values.password !== values.passwordConfirmation)
                  }
                  {...getFieldProps('passwordConfirmation')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.passwordConfirmation || 'Hesla se neshodují.'}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='m-0' controlId='password-reset-button'>
                <Button type='submit' variant='outline-primary'>
                  Změnit heslo
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
