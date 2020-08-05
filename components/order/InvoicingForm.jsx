import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';

import { UserStateContext } from 'components/user/UserDataProvider';
import { saveOrder } from 'firebase/db';

const InvoicingSchema = Yup.object({
  email: Yup.string()
    .email('Zadejte e-mailovou adresu ve správném formátu.')
    .required('Zadejte e-mailovou adresu pro zaslání informací objednávky.'),
  name: Yup.string()
    .matches(/([a-zA-Z]\s[a-zA-Z])+/, 'Jména musí být oddělená mezerou.')
    .required('Zadejte celé jméno.'),
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

export default function InvoicingForm() {
  const userState = useContext(UserStateContext);

  const { firebase, address } = userState;

  return (
    <>
      <Formik
        initialValues={{
          name: firebase?.displayName || '',
          email: firebase?.email || '',
          streetHouseNo: address?.invoicing.streetHouseNo || '',
          city: address?.invoicing.city || '',
          postCode: address?.invoicing.postCode || '',
          country: address?.invoicing.country || '',
        }}
        validationSchema={InvoicingSchema}
        onSubmit={values => {
          console.log(values);
          saveOrder(firebase.uid, values, address.invoicing, setAlert);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <Form
            className='text-center text-lg-left'
            onSubmit={handleSubmit}
            noValidate
          >
            <Form.Row>
              <Form.Group as={Col} controlId='order-email-input'>
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
            <h2 className='text-center text-lg-left'>Fakturační adresa</h2>
            <Form.Row>
              <Form.Group as={Col} controlId='order-invoice-name-input'>
                <Form.Label>Jméno</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='name'
                  isInvalid={touched.nameInvoice && errors.nameInvoice}
                  {...getFieldProps('nameInvoice')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.nameInvoice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId='order-delivery-name-input'>
                <Form.Label>Jméno</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='name'
                  isInvalid={touched.nameDelivery && errors.nameDelivery}
                  {...getFieldProps('nameDelivery')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.nameDelivery}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                controlId='order-invoice-streethouseno-input'
              >
                <Form.Label>Ulice a č.p.</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='street-address'
                  isInvalid={
                    touched.streetHouseNoInvoice && errors.streetHouseNoInvoice
                  }
                  {...getFieldProps('streetHouseNoInvoice')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.streetHouseNoInvoice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId='order-delivery-streethouseno-input'
              >
                <Form.Label>Ulice a č.p.</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='street-address'
                  isInvalid={
                    touched.streetHouseNoDelivery &&
                    errors.streetHouseNoDelivery
                  }
                  {...getFieldProps('streetHouseNoDelivery')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.streetHouseNoDelivery}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId='order-invoice-city-input'>
                <Form.Label>Město/Obec</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='country-name'
                  isInvalid={touched.cityInvoice && errors.cityInvoice}
                  {...getFieldProps('cityInvoice')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.cityInvoice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId='order-delivery-city-input'>
                <Form.Label>Město/Obec</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='country-name'
                  isInvalid={touched.cityDelivery && errors.cityDelivery}
                  {...getFieldProps('cityDelivery')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.cityDelivery}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId='order-invoice-postcode-input'>
                <Form.Label>PSČ</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='postal-code'
                  isInvalid={touched.postCodeInvoice && errors.postCodeInvoice}
                  {...getFieldProps('postCodeInvoice')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.postCodeInvoice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId='order-delivery-postcode-input'>
                <Form.Label>PSČ</Form.Label>
                <Form.Control
                  type='text'
                  autoComplete='postal-code'
                  isInvalid={
                    touched.postCodeDelivery && errors.postCodeDelivery
                  }
                  {...getFieldProps('postCodeDelivery')}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.postCodeDelivery}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId='order-invoice-country-select'>
                <Form.Label>Země</Form.Label>
                <Form.Control
                  as='select'
                  custom
                  {...getFieldProps('countryInvoice')}
                >
                  <option>Česká republika</option>
                  <option>Slovensko</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId='order-delivery-country-select'>
                <Form.Label>Země</Form.Label>
                <Form.Control as='select' custom {...getFieldProps('countryDelivery')}>
                  <option>Česká republika</option>
                  <option>Slovensko</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            
            <Form.Row>
              <Form.Group
                as={Col}
                className='m-0'
                controlId='order-button'
              >
                <Button type='submit' variant='outline-primary'>
                  Potvrdit objednávku
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
