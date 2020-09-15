import { firestore, saveOrder, sendOrder } from 'firebase/server';

export default function (req, res) {
  const { metadata } = req.body.data.object;

  const orderRef = firestore.collection('orders').doc(metadata.oid);

  const orderData = {
    ...metadata,
    formValues: JSON.parse(metadata.formValues),
    products: JSON.parse(metadata.products),
  };

  res.status(200).json({ received: true });

  saveOrder(orderData, orderRef);
  sendOrder(orderData);

  console.log(orderData);
}
