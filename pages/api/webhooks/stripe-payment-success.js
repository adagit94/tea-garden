import { saveOrder, sendOrder } from 'firebase/server';

export default async function (req, res) {
  const { metadata } = req.body.data.object;

  res.status(200).json({ received: true });

  const orderData = {
a: 1
  };

  saveOrder(orderData);
  sendOrder(orderData);
}
