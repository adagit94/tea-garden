import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(
  'pk_test_51HPdNOL5tnPLtZbHRwJTb6FH8DqNVcpRL2KKWgu8UKbysefADgLe47oGvmFprFFK4vw5cgNrcpOH2H5X8Uepvvdf00sFsSA4jz'
);

export default function PaymentProvider({ children }) {
  return <Elements stripe={stripe}>{children}</Elements>;
}
