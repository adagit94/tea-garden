import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from 'components/stripe/Payment.module.scss';

export default function Payment() {
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(true);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const stripe = useStripe();
  const elements = useElements();

  const { orderData } = userState;

  async function handleSubmit(e) {
    e.preventDefault();

    setProcessing(true);

    const res = await window.fetch('/api/handle-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const { clientSecret, orderData: orderDataRes } = await res.json();

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: orderData.formValues.nameInvoice,
        },
      },
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message);

      window.fetch('/api/finalize-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', oid: orderDataRes.oid }),
      });
    } else {
      setError(null);
      setSuccess(true);

      orderDataRes.paymentConfirmed = true;

      userDispatch({ type: 'setOrderData', payload: orderDataRes });
      window.localStorage.setItem('orderData', JSON.stringify(orderDataRes));

      window.fetch('/api/finalize-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'save', oid: orderDataRes.oid }),
      });

      setTimeout(() => {
        router.push('/objednavka/potvrzeni');
      }, 4000);
    }

    setProcessing(false);
  }

  async function handleChange(e) {
    setEmpty(e.empty);
    setError(e.error ? e.error.message : '');
  }

  if (!stripe || !elements || Object.getOwnPropertyNames(orderData).length === 0) return null;

  return (
    <Row>
      <Col>
        <Form
          className='d-flex flex-column align-items-center'
          onSubmit={handleSubmit}
        >
          <Form.Group className={`my-3 p-3 border rounded ${styles.formGroup}`}>
            <Form.Label srOnly>Platba kartou</Form.Label>
            <CardElement
              options={{
                style: {
                  base: {
                    color: '#495057',
                    '::placeholder': {
                      color: '#495057',
                    },
                  },
                  invalid: {
                    iconColor: '#dc3545',
                    color: '#dc3545',
                  },
                },
                value: {
                  postalCode: orderData.formValues.postCodeInvoice,
                },
                hidePostalCode: true,
              }}
              onChange={handleChange}
            />

            {success && (
              <div className='text-success'>
                Platba proběhla úspěšně. Budete přesměrování na stránku s
                potvrzením objednávky.
              </div>
            )}

            {error && <div className='text-danger'>{error}</div>}
          </Form.Group>

          <Button
            className='mb-3'
            variant='outline-primary'
            type='submit'
            disabled={processing || success || empty}
          >
            {processing && (
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Zpracovávám platbu...</span>
              </Spinner>
            )}

            {!processing && !success && 'Zaplatit'}

            {!processing && success && 'Zaplaceno'}
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
