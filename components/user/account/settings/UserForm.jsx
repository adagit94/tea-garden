import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
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
    'Jméno/a musí být oddělené/á mezerou.'
  ),
  email: Yup.string().email('Zadejte e-mailovou adresu ve správném formátu.'),
  password: Yup.string()
    .min(8, ({ min }) => `Heslo musí být minimálně ${min} znaků dlouhé.`)
    .matches(/[a-z]+/, 'Heslo musí obsahovat minimálně jedno malé písmeno.')
    .matches(/[A-Z]+/, 'Heslo musí obsahovat minimálně jedno velké písmeno.')
    .matches(/[0-9]+/, 'Heslo musí obsahovat minimálně jedno číslo.')
    .matches(/\W+/, 'Heslo musí obsahovat minimálně jeden speciální znak.'),
});

export default function UserForm() {
  const [alert, setAlert] = useFirebaseAlert();
  const userState = useContext(UserStateContext);

  const { firebase } = userState;

  return (
    <>
      <h2 className='text-center text-lg-left'>Osobní údaje</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={UserSchema}
        onSubmit={values => {
          updateUser(
            firebase,
            values.name,
            values.email,
            values.password,
            setAlert
          );
        }}
      >
        {({ handleSubmit, getFieldProps, touched, values, errors }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-name-input'
              >
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
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-email-input'
              >
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
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-password-input'
              >
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
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='m-0 d-flex justify-content-center justify-content-lg-start align-items-center'
                controlId='settings-user-button'
              >
                <Button type='submit' variant='outline-primary'>
                  Potvrdit
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </Formik>
      <FirebaseAlert show={alert.show} msg={alert.msg} />
    </>
  );
}
