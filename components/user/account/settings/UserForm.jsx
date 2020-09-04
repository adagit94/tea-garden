import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { updateUser } from '../../../../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';
import { UserStateContext } from 'components/user/UserDataProvider';

const UserSchema = Yup.object({
  name: Yup.string().matches(
    /([a-zA-Z]\s[a-zA-Z])+/,
    'Jména musí být oddělená mezerou.'
  ),
  email: Yup.string().email('Zadejte e-mailovou adresu ve správném formátu.'),
  password: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.'),
  passwordConfirmation: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.'),
});

export default function UserForm() {
  const userState = useContext(UserStateContext);

  const [alert, setAlert] = useFirebaseAlert();

  const { firebase } = userState;

  return (
    <>
      <h2>Osobní údaje</h2>
      <Formik
        initialValues={{
          name: firebase.displayName ?? '',
          email: firebase.email,
          password: '',
          passwordConfirmation: '',
        }}
        validationSchema={UserSchema}
        onSubmit={values => {
          if (values.password !== values.passwordConfirmation) return;

          updateUser(firebase, values, setAlert);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, values, errors }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group controlId='settings-name-input'>
              <Form.Label>Jméno</Form.Label>
              <Form.Control
                type='text'
                autoComplete='name'
                isInvalid={touched.name && errors.name}
                {...getFieldProps('name')}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='settings-email-input'>
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
            <Form.Group controlId='settings-password-input'>
              <Form.Label>Heslo</Form.Label>
              <Form.Control
                type='password'
                autoComplete='new-password'
                isInvalid={touched.password && errors.password}
                {...getFieldProps('password')}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='settings-password-confirmation-input'>
              <Form.Label>Potvrzení hesla</Form.Label>
              <Form.Control
                type='password'
                autoComplete='new-password'
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
            <Form.Group>
              <Button type='submit' variant='outline-primary'>
                Potvrdit
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
    </>
  );
}
