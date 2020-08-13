import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { createUser } from '../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { PageLoading } from 'components/ui/Indicators';
import { FirebaseAlert } from 'components/ui/Alerts';
import { UserStateContext } from 'components/user/UserDataProvider';

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
  passwordConfirmation: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.')
    .required('Zadejte heslo.'),
});

export default function Registration() {
  const router = useRouter();

  const userState = useContext(UserStateContext);

  const [alert, setAlert] = useFirebaseAlert();

  const { firebase, isAuthenticated, loading } = userState;

  useEffect(() => {
    router.prefetch('/[uid]/nastaveni');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated)
      router.push('/[uid]/nastaveni', `/${firebase.uid}/nastaveni`);
  });

  if (loading || isAuthenticated) return <PageLoading />;

  return (
    <Row lg={2}>
      <Col className='p-3'>
        <Formik
          initialValues={{ email: '', password: '', passwordConfirmation: '' }}
          validationSchema={RegistrationSchema}
          onSubmit={values => {
            if (values.password !== values.passwordConfirmation) return;

            createUser(values.email, values.password, setAlert);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, values, errors }) => (
            <Form
              className='text-center text-lg-left'
              onSubmit={handleSubmit}
              noValidate
            >
              <Form.Group controlId='registration-email-input'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  autoComplete='email'
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && errors.email}
                  {...getFieldProps('email')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='registration-password-input'>
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
              <Form.Group controlId='registration-password-confirmation-input'>
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
              <Form.Group className='m-0' controlId='registration-button'>
                <Button type='submit' variant='outline-primary'>
                  Registrovat
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
