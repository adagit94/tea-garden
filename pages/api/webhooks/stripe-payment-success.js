import { saveOrder, sendOrder } from 'firebase/server';

export default async function (req, res) {
  const { metadata } = req.body.data.object;

  res.status(200).json({ received: true });

  const orderData = {
    ...metadata,
    price: Number(metadata.price),
    formValues: JSON.parse(metadata.formValues),
    products: JSON.parse(metadata.products),
  };

  sendOrder(orderData);
  await saveOrder(orderData);
}
