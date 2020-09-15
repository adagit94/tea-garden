export default function (req, res) {
  const event = req.body;

  res.status(200).json({ received: true });

  console.log(event.data.object);
  console.log(event.data.object.metadata);
}

//orderDataRes.paymentConfirmed = true;
//userDispatch({ type: 'setOrderData', payload: orderDataRes });
//window.localStorage.setItem('orderData', JSON.stringify(orderDataRes));
