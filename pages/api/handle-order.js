const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);

import {
  firestore,
  calculatePrice,
  saveOrder,
  sendOrder,
} from 'firebase/server';

export default async function (req, res) {
  let orderData = req.body;

  const orderRef = firestore.collection('orders').doc();

  const price = await calculatePrice(orderData);

  orderData = { price, oid: orderRef.id, ...orderData };

  if (orderData.withPayment) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      metadata: {
        ...orderData,
        formValues: JSON.stringify({ ...orderData.formValues }),
        products: JSON.stringify({ ...orderData.products }),
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderData });
  } else {
    console.log(orderData);
    saveOrder(orderData);
    sendOrder(orderData);

    res.status(200).json(orderData);
  }
}
