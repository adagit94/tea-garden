const sgMail = require('@sendgrid/mail')

async function sendOrderMail(recipient, order) {
  let text = `Objednávka ${order.id} byla vytvořena.`;

  switch (order.payment) {
    case 'post':
      text += ` Dobírku ${PRICES.delivery.post} Kč uhradíte pří předání.`;
      break;

    case 'bank-transfer':
      text += ` Pro úspěšné dokončení objednávky prosíme o uhrazení částky ve výši ${order.price} Kč na účet xxxxxxxxx/xxxx.`;

      switch (order.delivery) {
        case 'personal':
          text += ` Po přijetí platby si objednávku můžete vyvednout v naší prodejně v době otvíracích hodin.`;
          break;

        case 'post':
          text += ` Při předání nic neplatíte.`;
          break;
      }
      break;

    case 'cash':
      text += ` Objednávku v hodnotě ${order.price} Kč zaplatíte v hotovosti nebo kartou v naší prodejně v době otvíracích hodin.`;
      break;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail
    .send({
      to: recipient,
      from: 'adam.pelc94@gmail.com',
      subject: `Tea Garden e-shop: objednávka ${order.id}`,
      text,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
    .then(() => {
      console.log('send successfully');
    })
    .catch(err => {
      console.error(err);
    });
}

export default async function(req, res) {
  
}