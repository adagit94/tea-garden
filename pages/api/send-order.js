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
    .catch(err => {
      console.error(err);
    });
}
