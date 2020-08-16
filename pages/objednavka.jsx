import Link from 'next/link';
import React, { useContext, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { saveOrder } from 'firebase/db';
import { updateProduct, deleteProduct, updateAmount } from 'helpers/products';
import { useBtnPopover } from 'custom-hooks/product';
import { BtnPopover } from 'components/ui/Popovers';
import { PageLoading } from 'components/ui/Indicators';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from 'components/order/Order.module.scss';

const OrderSchema = Yup.object({
  email: Yup.string()
    .email('Zadejte e-mailovou adresu ve správném formátu.')
    .required('Zadejte e-mailovou adresu.'),

  nameInvoice: Yup.string()
    .matches(/([a-zA-Z]\s[a-zA-Z])+/, 'Jména musí být oddělená mezerou.')
    .required('Zadejte celé jméno.'),
  streetHouseNoInvoice: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název ulice.')
    .matches(/[0-9]+/, 'Zadejte č.p.')
    .matches(/[a-zA-Z]\s{1,2}[0-9]/, 'Oddělte název ulice a č.p. mezerou.')
    .required('Zadejte název ulice a č.p.'),
  cityInvoice: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název města nebo obce.')
    .required('Zadejte název města nebo obce.'),
  postCodeInvoice: Yup.string()
    .max(6, 'Zadejte PSČ.')
    .matches(/([0-9]{5})|([0-9]{3}\s[0-9]{2})/, 'Zadejte PSČ.')
    .matches(/[^a-zA-Z]/, 'Zadejte PSČ.')
    .required('Zadejte PSČ.'),

  nameDelivery: Yup.string()
    .matches(/([a-zA-Z]\s[a-zA-Z])+/, 'Jména musí být oddělená mezerou.')
    .required('Zadejte celé jméno.'),
  streetHouseNoDelivery: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název ulice.')
    .matches(/[0-9]+/, 'Zadejte č.p.')
    .matches(/[a-zA-Z]\s{1,2}[0-9]/, 'Oddělte název ulice a č.p. mezerou.')
    .required('Zadejte název ulice a č.p.'),
  cityDelivery: Yup.string()
    .matches(/[a-zA-Z]{2,}/, 'Zadejte název města nebo obce.')
    .required('Zadejte název města nebo obce.'),
  postCodeDelivery: Yup.string()
    .max(6, 'Zadejte PSČ.')
    .matches(/([0-9]{5})|([0-9]{3}\s[0-9]{2})/, 'Zadejte PSČ.')
    .matches(/[^a-zA-Z]/, 'Zadejte PSČ.')
    .required('Zadejte PSČ.'),

  delivery: Yup.string().required('Zvolte způsob dopravy.'),
  payment: Yup.string().required('Zvolte způsob platby.'),
});

const PRICES = {
  delivery: {
    post: 49,
  },
  payment: {
    post: 30,
  },
};

function calculatePrice(subtotal, payments) {
  let price = { total: subtotal, products: subtotal };

  if (payments.delivery === 'post') {
    price.total += PRICES.delivery.post;
    price.delivery = PRICES.delivery.post;
  }

  if (payments.payment === 'post') {
    price.total += PRICES.payment.post;
    price.payment = PRICES.payment.post;
  }

  return price;
}

function customizeText(order) {
  let text = `Objednávka ${order.id} byla vytvořena.`;

  switch (order.payment) {
    case 'post':
      text += ` Dobírku ${PRICES.delivery.post} Kč uhradíte pří předání.`;
      break;

    case 'bank-transfer':
      text += ` Pro úspěšné dokončení objednávky prosíme o uhrazení částky ve výši ${order.price} Kč na účet xxxxxxxxx/xxxx.`;

      switch (order.delivery) {
        case 'personal':
          text += ` Po přijetí platby si objednávku můžete vyvednout v naší prodejně v době otvíracích hodin.`;
          break;

        case 'post':
          text += ` Při předání nic neplatíte.`;
          break;
      }
      break;

    case 'cash':
      text += ` Objednávku v hodnotě ${order.price} Kč zaplatíte v hotovosti nebo kartou v naší prodejně v době otvíracích hodin.`;
      break;
  }

  return text;
}

async function handleOrder(recipient, order) {
  const text = customizeText(order);

  const mail = { recipient, text, orderID: order.id };

  const res = await fetch('/api/send-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mail),
  });

  const txt = await res.text();

  console.log(txt, 'txt');
  console.log(res.status, 'status');
}

export default function OrderForm() {
  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const btnContainerRef = useRef(null);
  const priceRef = useRef(null);

  const [btnPopover, setBtnPopover] = useBtnPopover();

  const {
    firebase,
    loading,
    isAuthenticated,
    address,
    shoppingCart,
  } = userState;

  const cartItems = Object.getOwnPropertyNames(shoppingCart);

  useEffect(() => {
    if (cartItems.length === 0) {
      setBtnPopover({
        show: true,
        target: document.querySelector('#order-btn'),
      });
    } else {
      setBtnPopover({
        show: false,
        target: null,
      });
    }
  }, [cartItems.length, setBtnPopover]);

  if (loading || (isAuthenticated && !address)) return <PageLoading />;

  return (
    <Row className='p-3'>
      <Col>
        <Formik
          initialValues={{
            email: firebase?.email || '',

            nameInvoice: firebase?.displayName || '',
            streetHouseNoInvoice: address?.invoicing.streetHouseNo || '',
            cityInvoice: address?.invoicing.city || '',
            postCodeInvoice: address?.invoicing.postCode || '',
            countryInvoice: address?.invoicing.country || 'Czech',

            sameAsInvoice: false,
            nameDelivery: address?.delivery.name || '',
            streetHouseNoDelivery: address?.delivery.streetHouseNo || '',
            cityDelivery: address?.delivery.city || '',
            postCodeDelivery: address?.delivery.postCode || '',
            countryDelivery: address?.delivery.country || 'Czech',

            delivery: '',
            payment: '',

            note: '',
          }}
          validationSchema={OrderSchema}
          onSubmit={async values => {
            if (cartItems.length === 0) return;

            const orderID = await saveOrder(
              firebase?.uid,
              values,
              shoppingCart,
              cartItems,
              priceRef.current,
              userDispatch
            );

            handleOrder(values.email, {
              id: orderID,
              delivery: values.delivery,
              payment: values.payment,
              price: priceRef.current.total,
            });
          }}
        >
          {({ handleSubmit, getFieldProps, touched, values, errors }) => {
            let subtotal = 0;

            if (values.sameAsInvoice) {
              values.nameDelivery = values.nameInvoice;
              values.streetHouseNoDelivery = values.streetHouseNoInvoice;
              values.cityDelivery = values.cityInvoice;
              values.postCodeDelivery = values.postCodeInvoice;
              values.countryDelivery = values.countryInvoice;
            }

            return (
              <Form
                className='text-center text-lg-left'
                onSubmit={handleSubmit}
                noValidate
              >
                <Row>
                  <Col>
                    <Form.Group
                      className={styles.singleInput}
                      controlId='order-email-input'
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
                  </Col>
                </Row>
                <Row xs={1} lg={2}>
                  <Col>
                    <h2 className='text-center text-lg-left'>
                      Fakturační adresa
                    </h2>
                    <Form.Group controlId='order-invoice-name-input'>
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
                    <Form.Group controlId='order-invoice-streethouseno-input'>
                      <Form.Label>Ulice a č.p.</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='street-address'
                        isInvalid={
                          touched.streetHouseNoInvoice &&
                          errors.streetHouseNoInvoice
                        }
                        {...getFieldProps('streetHouseNoInvoice')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.streetHouseNoInvoice}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-invoice-city-input'>
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
                    <Form.Group controlId='order-invoice-postcode-input'>
                      <Form.Label>PSČ</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='postal-code'
                        isInvalid={
                          touched.postCodeInvoice && errors.postCodeInvoice
                        }
                        {...getFieldProps('postCodeInvoice')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.postCodeInvoice}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-invoice-country-select'>
                      <Form.Label>Země</Form.Label>
                      <Form.Control
                        as='select'
                        value={values.countryInvoice}
                        custom
                        {...getFieldProps('countryInvoice')}
                      >
                        <option value='Czech'>Česká republika</option>
                        <option value='Slovakia'>Slovensko</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <div className='d-flex justify-content-center justify-content-lg-start align-items-center'>
                      <h2>Doručovací adresa</h2>
                      <Form.Group className='mb-0 ml-1'>
                        <Form.Check
                          label='Použít fakturační'
                          name='sameAsInvoice'
                          type='checkbox'
                          id='address-match'
                          custom
                          {...getFieldProps('sameAsInvoice')}
                        />
                      </Form.Group>
                    </div>
                    <Form.Group controlId='order-delivery-name-input'>
                      <Form.Label>Jméno</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='name'
                        disabled={values.sameAsInvoice}
                        isInvalid={
                          !values.sameAsInvoice &&
                          touched.nameDelivery &&
                          errors.nameDelivery
                        }
                        {...getFieldProps('nameDelivery')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.nameDelivery}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-delivery-streethouseno-input'>
                      <Form.Label>Ulice a č.p.</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='street-address'
                        disabled={values.sameAsInvoice}
                        isInvalid={
                          !values.sameAsInvoice &&
                          touched.streetHouseNoDelivery &&
                          errors.streetHouseNoDelivery
                        }
                        {...getFieldProps('streetHouseNoDelivery')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.streetHouseNoDelivery}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-delivery-city-input'>
                      <Form.Label>Město/Obec</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='address-level1'
                        disabled={values.sameAsInvoice}
                        isInvalid={
                          !values.sameAsInvoice &&
                          touched.cityDelivery &&
                          errors.cityDelivery
                        }
                        {...getFieldProps('cityDelivery')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.cityDelivery}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-delivery-postcode-input'>
                      <Form.Label>PSČ</Form.Label>
                      <Form.Control
                        type='text'
                        autoComplete='postal-code'
                        disabled={values.sameAsInvoice}
                        isInvalid={
                          !values.sameAsInvoice &&
                          touched.postCodeDelivery &&
                          errors.postCodeDelivery
                        }
                        {...getFieldProps('postCodeDelivery')}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.postCodeDelivery}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='order-delivery-country-select'>
                      <Form.Label>Země</Form.Label>
                      <Form.Control
                        as='select'
                        value={values.countryDelivery}
                        disabled={values.sameAsInvoice}
                        custom
                        {...getFieldProps('countryDelivery')}
                      >
                        <option value='Czech'>Česká republika</option>
                        <option value='Slovakia'>Slovensko</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row xs={1} lg={2}>
                  <Col>
                    <h2 className='text-center text-lg-left'>Doprava</h2>
                    <Form.Group>
                      <Field
                        as={Form.Check}
                        disabled={values.payment === 'cash'}
                        isInvalid={
                          touched.delivery &&
                          errors.delivery &&
                          values.payment !== 'cash'
                        }
                        label={`Česká pošta: ${PRICES.delivery.post} Kč`}
                        value='post'
                        name='delivery'
                        type='radio'
                        id='delivery-post'
                        custom
                      />
                      <Field
                        as={Form.Check}
                        disabled={values.payment === 'post'}
                        isInvalid={
                          touched.delivery &&
                          errors.delivery &&
                          values.payment !== 'post'
                        }
                        label='Osobní vyzvednutí'
                        value='personal'
                        name='delivery'
                        type='radio'
                        id='delivery-personal'
                        custom
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <h2 className='text-center text-lg-left'>Platba</h2>
                    <Form.Group>
                      <Field
                        as={Form.Check}
                        disabled={values.delivery === 'personal'}
                        isInvalid={
                          touched.payment &&
                          errors.payment &&
                          values.delivery !== 'personal'
                        }
                        label={`Dobírkou: ${PRICES.payment.post} Kč`}
                        name='payment'
                        value='post'
                        type='radio'
                        id='payment-post'
                        custom
                      />
                      <Field
                        as={Form.Check}
                        isInvalid={touched.payment && errors.payment}
                        label='Převodem na účet'
                        name='payment'
                        value='bank-transfer'
                        type='radio'
                        id='payment-bank-transfer'
                        custom
                      />
                      <Field
                        as={Form.Check}
                        disabled={values.delivery === 'post'}
                        isInvalid={
                          touched.payment &&
                          errors.payment &&
                          values.delivery !== 'post'
                        }
                        label='Hotově'
                        name='payment'
                        value='cash'
                        type='radio'
                        id='payment-cash'
                        custom
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h2 className='text-center text-lg-left'>Poznámka</h2>
                    <Form.Group className={styles.singleInput}>
                      <Form.Control as='textarea' {...getFieldProps('note')} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Table className='m-0' responsive>
                      <tbody>
                        {cartItems.map(itemID => {
                          const {
                            title,
                            image,
                            url,
                            pack,
                            price,
                            stock,
                          } = shoppingCart[itemID];

                          const [weight, amount] = pack;
                          const amountInputID = `order-amount-input-${itemID}`;
                          const itemPrice = price * amount;

                          subtotal += itemPrice;

                          return (
                            <tr key={itemID}>
                              <td>
                                <Link
                                  href={`/${url.category}/${url.subcategory}/${url.product}`}
                                  passHref
                                >
                                  <a>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <img
                                          width='75'
                                          height='75'
                                          src={image}
                                          alt={name}
                                        />
                                      </div>
                                      <div className='pl-2'>
                                        <b>{title.full}</b> {weight}g
                                      </div>
                                    </div>
                                  </a>
                                </Link>
                              </td>
                              <td className='align-middle'>
                                <div className='d-flex'>
                                  <InputGroup className='flex-nowrap'>
                                    <InputGroup.Prepend>
                                      <Button
                                        className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                                        onClick={() => {
                                          const amount = updateAmount(
                                            amountInputID,
                                            'subtract'
                                          );

                                          if (amount < 1) return;

                                          updateProduct(
                                            'updateAmount',
                                            itemID,
                                            shoppingCart,
                                            userDispatch,
                                            {
                                              pack: [weight, amount],
                                            }
                                          );
                                        }}
                                        variant='primary'
                                      >
                                        -
                                      </Button>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className={`border-primary ${styles.amountInput}`}
                                      id={amountInputID}
                                      onChange={e => {
                                        const amount = Number(e.target.value);

                                        if (
                                          amount < 1 ||
                                          stock < weight * amount
                                        ) {
                                          return;
                                        }

                                        updateProduct(
                                          'updateAmount',
                                          itemID,
                                          shoppingCart,
                                          userDispatch,
                                          {
                                            pack: [weight, amount],
                                          }
                                        );
                                      }}
                                      value={amount}
                                      type='number'
                                    />
                                    <InputGroup.Append>
                                      <Button
                                        className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                                        onClick={() => {
                                          const amount = updateAmount(
                                            amountInputID,
                                            'add'
                                          );

                                          if (stock < weight * amount) {
                                            return;
                                          }

                                          updateProduct(
                                            'updateAmount',
                                            itemID,
                                            shoppingCart,
                                            userDispatch,
                                            {
                                              pack: [weight, amount],
                                            }
                                          );
                                        }}
                                        variant='primary'
                                      >
                                        +
                                      </Button>
                                    </InputGroup.Append>
                                  </InputGroup>
                                  <InputGroup className='justify-content-center'>
                                    <Button
                                      onClick={() => {
                                        deleteProduct(
                                          itemID,
                                          shoppingCart,
                                          userDispatch
                                        );
                                      }}
                                      className={`mb-1 close ${styles.cancelSymbol}`}
                                      variant='outline-secondary'
                                      aria-label='Odstranit'
                                    >
                                      <span aria-hidden='true'>&times;</span>
                                    </Button>
                                  </InputGroup>
                                </div>
                              </td>
                              <td className='text-right align-middle'>
                                {itemPrice} Kč
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td className='text-left'>
                            <b>Doprava</b>
                          </td>
                          <td className='text-right' colSpan='2'>
                            {values.delivery === 'post'
                              ? `${PRICES.delivery.post} Kč`
                              : 'Zdarma'}
                          </td>
                        </tr>
                        <tr>
                          <td className='text-left'>
                            <b>Platba</b>
                          </td>
                          <td className='text-right' colSpan='2'>
                            {values.payment === 'post'
                              ? `${PRICES.payment.post} Kč`
                              : 'Zdarma'}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className='text-left'>
                            <b>Celkem</b>
                          </td>
                          <td className='text-right' colSpan='2'>
                            <b>
                              {(() => {
                                const price = calculatePrice(subtotal, {
                                  delivery: values.delivery,
                                  payment: values.payment,
                                });

                                priceRef.current = price;

                                return price.total.toLocaleString('cs-CZ');
                              })()}{' '}
                              Kč
                            </b>
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      className='m-0 text-center'
                      controlId='order-button'
                      ref={btnContainerRef}
                    >
                      <BtnPopover
                        bg='danger'
                        show={btnPopover.show}
                        target={btnPopover.target}
                        container={btnContainerRef.current}
                        popoverID='order-btn-popover'
                      >
                        V košíku není žádné zboží.
                      </BtnPopover>
                      <Button type='submit' variant='primary' id='order-btn'>
                        Potvrdit objednávku
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
}
