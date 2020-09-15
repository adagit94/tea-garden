import { saveOrder, sendOrder } from 'firebase/server';

export default function (req, res) {
  const { metadata } = req.body.data.object;

  const orderData = {
    ...metadata,
    price: Number(metadata.price),
    formValues: JSON.parse(metadata.formValues),
    products: JSON.parse(metadata.products),
  };

  console.log(orderData);
  
  saveOrder(orderData);
  sendOrder(orderData);

  res.status(200).json({ received: true });
}
