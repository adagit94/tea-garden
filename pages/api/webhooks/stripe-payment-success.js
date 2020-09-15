const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);

export default function (req, res) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      JSON.stringify(req.body),
      req.headers['stripe-signature'],
      process.env.STRIPE_PAYMENT_SUCCESS_ENDPOINT_SECRET
    );
  } catch (err) {
    res.status(400).send(err.message);
  }

  res.status(200).json({ received: true });

  console.log(event.data.object);
  console.log(event.data.object.metadata);

}
