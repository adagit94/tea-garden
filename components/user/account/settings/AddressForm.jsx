import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { updateAddress } from '../../../../firebase/db';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { UserStateContext } from 'components/user/UserDataProvider';
import { FirebaseAlert } from 'components/ui/Alerts';

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
    .matches(/[^a-zA-Z]/, 'Zadejte PSČ.')
    .required('Zadejte PSČ.'),
});

export default function AddressForm() {
  const [alert, setAlert] = useFirebaseAlert();
  const userState = useContext(UserStateContext);

  const { firebase, address } = userState;

  return (
    <>
      <h2 className='text-center text-lg-left'>Fakturační adresa</h2>
      <Formik
        initialValues={{
          streetHouseNo: address.invoicing.streetHouseNo,
          city: address.invoicing.city,
          postCode: address.invoicing.postCode,
          country: address.invoicing.country,
        }}
        validationSchema={AddressSchema}
        onSubmit={values => {
          console.log(values);
          updateAddress(firebase.uid, values, address.invoicing, setAlert);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <Form className='text-center text-lg-left' onSubmit={handleSubmit} noValidate>
            <Form.Row>
              <Form.Group
                as={Col}
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
                controlId='settings-country-select'
              >
                <Form.Label>Země</Form.Label>
                <Form.Control
                  as='select'
                  custom
                  {...getFieldProps('country')}
                >
                  <option>Česká republika</option>
                  <option>Slovensko</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                className='m-0'
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
      <FirebaseAlert
        variant={alert.variant}
        show={alert.show}
        msg={alert.msg}
      />
    </>
  );
}