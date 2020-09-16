const sgMail = require('@sendgrid/mail');
const { Firestore } = require('@google-cloud/firestore');

const { PRICES } = require('tea-garden-constants');

export const firestore = new Firestore({
  projectId: 'tea-garden-a95e7',
  credentials: {
    client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ),
  },
});

export async function calculatePrice(orderData) {
  const { formValues, products } = orderData;

  const productsRef = firestore.collection('products');
  const productRefs = Object.getOwnPropertyNames(products).map(productID =>
    productsRef.doc(productID)
  );

  let price = 0;

  await firestore
    .getAll(...productRefs, { fieldMask: ['packs'] })
    .then(docs => {
      docs.forEach(doc => {
        const data = doc.data();
        const [pack, amount] = products[doc.id];

        price += data.packs[pack] * amount;
      });
    })
    .catch(err => {
      console.error(err);
    });

  if (formValues.payment === 'post') price += PRICES.payment.post;
  if (formValues.delivery === 'post') price += PRICES.delivery.post;

  return price;
}

export async function saveOrder(orderData) {
  const { uid, oid, formValues, products, price } = orderData;

  const productsRef = firestore.collection('products');
  const orderRef = firestore.collection('orders').doc(oid);
  const userOrderRef = uid
    ? firestore.collection('users').doc(uid).collection('orders').doc(oid)
    : null;

  const bulkWriter = firestore.bulkWriter();

  let order = {
    status: 'čeká na vyřízení',
    payment: formValues.payment,
    delivery: formValues.delivery,
    email: formValues.email,
    address: {
      invoice: {
        name: formValues.nameInvoice,
        streetHouseNo: formValues.streetHouseNoInvoice,
        city: formValues.cityInvoice,
        postCode: formValues.postCodeInvoice,
        country: formValues.countryInvoice,
      },
    },
    note: formValues.note,
    price,
  };

  if (!formValues.sameAsInvoice) {
    order.address.delivery = {
      name: formValues.nameDelivery,
      streetHouseNo: formValues.streetHouseNoDelivery,
      city: formValues.cityDelivery,
      postCode: formValues.postCodeDelivery,
      country: formValues.countryDelivery,
    };
  }

  order.products = products;

  order = { date: Firestore.FieldValue.serverTimestamp(), ...order };

  orderRef
    .set(order)
    .then(() => {
      console.log('order saved');
    })
    .catch(err => {
      console.error(err);
    });

  if (userOrderRef) {
    userOrderRef
      .set(order)
      .then(() => {
        console.log('user order saved');
      })
      .catch(err => {
        console.error(err);
      });
  }

  Object.getOwnPropertyNames(products).forEach(async productID => {
    const [weight, amount] = products[productID];

    const totalAmount = weight * amount;

    bulkWriter
      .update(productsRef.doc(productID), {
        stock: Firestore.FieldValue.increment(-totalAmount),
        'stats.orderedAmount': Firestore.FieldValue.increment(totalAmount),
      })
      .catch(err => {
        console.error(err);
      });
  });

  await bulkWriter.close().then(() => {
    console.log('bulk closed');
  });

  console.log(order);
}

export async function sendOrder(orderData) {
  const { oid, price, formValues } = orderData;
  const { email, payment, delivery } = formValues;

  function customizeText() {
    let text = `Objednávka ${oid} byla vytvořena.`;

    switch (payment) {
      case 'post':
        text += ` Dobírku ${PRICES.delivery.post} Kč uhradíte pří předání.`;
        break;

      case 'cash':
        text += ` Částku ${price} Kč zaplatíte v hotovosti nebo kartou v naší prodejně v době otvíracích hodin.`;
        break;

      case 'bank-transfer':
        text += ` Pro úspěšné dokončení objednávky prosíme o uhrazení částky ve výši ${price} Kč na účet xxxxxxxxx/xxxx.`;
        break;

      case 'card':
        text += ` Částka ${price} Kč byla zaplacena.`;
        break;
    }

    if (payment === 'bank-transfer' || payment === 'card') {
      switch (delivery) {
        case 'personal':
          text += ` Po potvrzení platby si objednávku můžete vyvednout v naší prodejně v době otvíracích hodin.`;
          break;

        case 'post':
          text += ` Při předání nic neplatíte.`;
          break;
      }
    }

    return text;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail.send({
    to: email,
    from: 'adam.pelcius@seznam.cz',
    subject: `Tea Garden e-shop: objednávka ${oid}`,
    text: customizeText(),
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  });
}
