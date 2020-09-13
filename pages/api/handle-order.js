const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);

import {
  firestore,
  calculatePrice,
  saveOrder,
  sendOrder,
} from 'firebase/server';

export default async function (req, res) {
  let orderData = req.body;
  console.log(process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY);
  const orderRef = firestore.collection('orders').doc();

  const price = await calculatePrice(orderData);

  orderData = {price, oid: orderRef.id, ...orderData };

  if (orderData.withPayment) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
    });

    orderRef.set({ data: JSON.stringify(orderData) });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderData });
  } else {
    saveOrder(orderData, orderRef);
    sendOrder(orderData);

    res.status(200).json(orderData);
  }
}