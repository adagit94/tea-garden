import Router from 'next/router';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { collectionTranslator } from './helpers';

const teas = ['puErh', 'oolong', 'red', 'green'];

export let detachAddressListener;
export let detachOrdersListener;

export async function initFirestoreListeners(user, syncData) {
  const userRef = firebase.firestore().collection('users').doc(user.uid);

  const addressRef = userRef.collection('address');
  const ordersRef = userRef.collection('orders');

  await userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        userRef
          .set({
            created: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .catch(err => {
            console.error(err);
          });

        addressRef
          .doc('invoicing')
          .set({
            streetGouseNo: '',
            city: '',
            postCode: '',
            country: 'Czech',
          })
          .catch(err => {
            console.error(err);
          });

        addressRef
          .doc('delivery')
          .set({
            name: '',
            streetHouseNo: '',
            city: '',
            postCode: '',
            country: '',
          })
          .catch(err => {
            console.error(err);
          });
      }
    })
    .catch(err => {
      console.error(err);
    });

  detachAddressListener = addressRef.onSnapshot(data => {
    let address = {};

    data.docs.forEach(doc => {
      address[doc.id] = doc.data();
    });

    syncData('address', address);
  });

  detachOrdersListener = ordersRef.onSnapshot(data => {
    const dateFormat = new Intl.DateTimeFormat('cs-CZ');

    let orders = {};

    data.docs.forEach(doc => {
      let dataObj = doc.data();

      if (dataObj.date) {
        dataObj.date = dateFormat.format(dataObj.date.toDate());
      }

      orders[doc.id] = dataObj;
    });

    syncData('orders', orders);
  });
}

export async function updateAddress(uid, formValues, stateValues, setAlert) {
  const update = {};

  Object.getOwnPropertyNames(formValues).forEach(prop => {
    if (formValues[prop] !== stateValues[prop]) {
      update[prop] = formValues[prop];
    }
  });

  if (Object.getOwnPropertyNames(update).length === 0) {
    setAlert({
      variant: 'danger',
      show: true,
      msg: 'Nebyla provedena zádná změna.',
    });
  } else {
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('address')
      .doc('invoicing')
      .update(update)
      .then(() => {
        setAlert({
          variant: 'success',
          show: true,
          msg: 'Změna proběhla úspěšně.',
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export async function getProducts(param) {
  const firestore = firebase.firestore();

  const [category, subcategory] = param;

  let products;

  if (category === 'cerstve' || category === 'archivni') {
    let operator;
    let year;

    switch (category) {
      case 'cerstve':
        operator = '==';
        year = 2020;
        break;

      case 'archivni':
        operator = '<=';
        year = 2005;
        break;
    }

    products = [];

    const promises = teas.map(tea =>
      firestore
        .collection(tea)
        .where('harvest.year', operator, year)
        .get()
        .then(data =>
          data.docs.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
          })
        )
        .catch(err => {
          console.error(err);
        })
    );

    await Promise.all(promises)
      .then()
      .catch(err => {
        console.error(err);
      });
  } else {
    let productsRef = firestore.collection(collectionTranslator(category));

    if (subcategory) {
      productsRef = productsRef.where('url.subcategory', '==', subcategory);
    }

    products = await productsRef
      .get()
      .then(data => data.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      .catch(err => {
        console.error(err);
      });
  }

  return products;
}

export async function getProduct(param) {
  const [category, subcategory, product] = param;

  let productData;
  const productRef = firebase
    .firestore()
    .collection(collectionTranslator(category))
    .where('url.product', '==', product);

  productData = await productRef
    .get()
    .then(data => data.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0])
    .catch(err => {
      console.error(err);
    });

  return productData;
}

export async function saveOrder(
  uid,
  formValues,
  shoppingCart,
  price,
  stateUpdater
) {
  let ref = firebase.firestore();
  let order;

  if (uid) {
    ref = ref.collection('users').doc(uid).collection('orders');
  } else {
    ref = ref.collection('orders');
  }

  order = {
    status: 'pending',
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

  order.products = Object.getOwnPropertyNames(shoppingCart).map(itemID => {
    const product = shoppingCart[itemID];

    return {
      name: product.name,
      weight: product.pack[0],
      amount: product.pack[1],
    };
  });

  ref
    .doc()
    .set({ date: firebase.firestore.FieldValue.serverTimestamp(), ...order })
    .then(() => {
      Router.push('/');

      window.localStorage.removeItem('shoppingCart');

      stateUpdater({ type: 'clearCart' });
    })
    .catch(err => {
      console.error(err);
    });
}
