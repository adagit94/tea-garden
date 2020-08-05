import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { collectionTranslator } from './helpers';

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
            country: '',
          })
          .catch(err => {
            console.error(err);
          });

        addressRef
          .doc('delivery')
          .set({
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
  const [category, subcategory] = param;

  let productsData;
  let productsRef = firebase
    .firestore()
    .collection(collectionTranslator(category));

  if (subcategory) {
    productsRef = productsRef.where('url.subcategory', '==', subcategory);
  }

  productsData = await productsRef
    .get()
    .then(data => data.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    .catch(err => {
      console.error(err);
    });

  return productsData;
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

export async function saveOrder(order) {
/*ordersRef
          .doc()
          .set({
            date: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'Založená',
            price: '1500 Kč',
          })
          .catch(err => {
            console.error(err);
          });*/
}
