const sgMail = require('@sendgrid/mail');

export default function (req, res) {
  const { recipient, text, orderID } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail
    .send({
      to: recipient,
      from: 'adam.pelcius@seznam.cz',
      subject: `Tea Garden e-shop: objednávka ${orderID}`,
      text,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
    .then(() => {
      res.status(200).send('send successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(400).send('not send');
    });
}
