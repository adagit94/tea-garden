export default function (req, res) {
  const event = req.body;

  
  console.log(event.data.object);
  console.log(event.data.object.metadata);
  res.status(200).json({ received: true });
}

//orderDataRes.paymentConfirmed = true;
//userDispatch({ type: 'setOrderData', payload: orderDataRes });
//window.localStorage.setItem('orderData', JSON.stringify(orderDataRes));
