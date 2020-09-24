import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { firestore } from './init-firebase';

export let detachAddressListener;
export let detachOrdersListener;

export async function initFirestoreListeners(user, syncData) {
  const userRef = firestore.collection('users').doc(user.uid);

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
            country: 'Czech',
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

  detachOrdersListener = ordersRef.orderBy('date', 'desc').onSnapshot(data => {
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
    firestore
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

export async function getProducts(spec) {
  let productsRef = firestore.collection('products');

  let products;

  if (spec === 'new') {
    productsRef = productsRef.orderBy('metadata.created', 'desc').limit(6);
  } else if (spec === 'topSelling') {
    productsRef = productsRef.orderBy('stats.orderedAmount', 'desc').limit(6);
  } else {
    const [category, subcategory] = spec;

    if (category === 'cerstve') {
      productsRef = productsRef.where('harvest.year', '==', (new Date()).getFullYear());
    } else if (category === 'archivni') {
      productsRef = productsRef.where('harvest.year', '<=', (new Date()).getFullYear() - 5);
    } else {
      productsRef = productsRef.where('metadata.url.category', '==', category);

      if (subcategory) {
        productsRef = productsRef.where(
          'metadata.url.subcategory',
          '==',
          subcategory
        );
      }
    }
  }

  products = await productsRef
    .get()
    .then(data => {
      let products = {};

      data.docs.forEach(doc => {
        products[doc.id] = { id: doc.id, ...doc.data() };
      });

      return products;
    })
    .catch(err => {
      console.error(err);
    });

  return products;
}

export async function getProduct(product) {
  const productData = await firestore
    .collection('products')
    .where('metadata.url.product', '==', product)
    .get()
    .then(data => ({ id: data.docs[0].id, ...data.docs[0].data() }))
    .catch(err => {
      console.error(err);
    });

  return productData;
}

export async function getIndexRecords() {
  const records = await firestore
    .collection('products')
    .get()
    .then(data =>
      data.docs.map(doc => {
        const product = doc.data();
        const pack = Object.getOwnPropertyNames(product.packs)[0];

        return {
          objectID: doc.id,
          title: product.title.full,
          url: product.metadata.url,
          image: product.metadata.images.main,
          weight: pack,
          price: product.packs[pack],
        };
      })
    )
    .catch(err => {
      console.error(err);
    });

  return records;
}
