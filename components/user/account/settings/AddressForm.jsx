import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';
import { UserStateContext } from 'components/user/UserDataProvider';

const AddressSchema = Yup.object({
  streetHouseNo: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název ulice.')
    .matches(/[0-9]+/, 'Zadejte č.p.')
    .matches(/[a-zA-Z]\s{1,2}[0-9]/, 'Oddělte název ulice a č.p. mezerou.')
    .required('Zadejte název ulice a č.p.'),
  city: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název města nebo obce.')
    .required('Zadejte název města nebo obce.'),
  postCode: Yup.string()
    .matches(/([0-9]{5})|([0-9]{3}\s[0-9]{2})/, 'Zadejte PSČ.')
    .required('Zadejte PSČ.'),
});

export default function AddressForm() {
  const [alert, setAlert] = useFirebaseAlert();
  const userState = useContext(UserStateContext);

  const { firebase } = userState;

  return (
    <>
      <h2 className='text-center text-lg-left'>Fakturační adresa</h2>
      <Formik
        initialValues={{ streetHouseNo: '', city: '', postCode: '' }}
        validationSchema={AddressSchema}
        onSubmit={values => {
          //loginEmail(values.email, values.password, setFirebaseErr);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-streethouseno-input'
              >
                <Form.Label>Ulice a č.p.</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='street-address'
                  isInvalid={touched.streetHouseNo && errors.streetHouseNo}
                  {...getFieldProps('streetHouseNo')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.streetHouseNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-city-input'
              >
                <Form.Label>Město/Obec</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='country-name'
                  isInvalid={touched.city && errors.city}
                  {...getFieldProps('city')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='d-flex flex-column align-items-center align-items-lg-start'
                controlId='settings-postcode-input'
              >
                <Form.Label>PSČ</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='postal-code'
                  isInvalid={touched.postCode && errors.postCode}
                  {...getFieldProps('postCode')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.postCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='m-0 d-flex justify-content-center justify-content-lg-start align-items-center'
                controlId='settings-address-button'
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
