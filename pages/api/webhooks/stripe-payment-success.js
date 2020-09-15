import { saveOrder, sendOrder } from 'firebase/server';

export default function (req, res) {
  const { metadata } = req.body.data.object;

  const orderData = {
    ...metadata,
    formValues: JSON.parse(metadata.formValues),
    products: JSON.parse(metadata.products),
  };

  res.status(200).json({ received: true });

  saveOrder(orderData);
  sendOrder(orderData);

  console.log(orderData);
}
