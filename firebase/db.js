import Router from 'next/router';
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
    productsRef = productsRef.orderBy('metadata.created', 'desc').limit(5);
  } else if (spec === 'topSelling') {
    productsRef = productsRef.orderBy('stats.orderedAmount', 'desc').limit(5);
  } else {
    const [category, subcategory] = spec;

    if (category === 'cerstve') {
      productsRef = productsRef.where('harvest.year', '==', 2020);
    } else if (category === 'archivni') {
      productsRef = productsRef.where('harvest.year', '<=', 2005);
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
        products[doc.id] = doc.data();
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

export async function saveOrder(
  uid,
  formValues,
  shoppingCart,
  cartItems,
  price,
  stateUpdater
) {
  let orderRef;
  let order;

  if (uid) {
    orderRef = firestore
      .collection('users')
      .doc(uid)
      .collection('orders')
      .doc();
  } else {
    orderRef = firestore.collection('orders').doc();
  }

  order = {
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

  order.products = cartItems.map(itemID => {
    const product = shoppingCart[itemID];
    const [weight, amount] = product.pack;

    firestore
      .collection('products')
      .doc(itemID)
      .update({
        stock: firebase.firestore.FieldValue - Number(weight) * amount,
        'stats.orderedAmount': firebase.firestore.FieldValue.increment(
          Number(weight) * amount
        ),
      });

    return {
      id: itemID,
      name: product.title.full,
      weight,
      amount,
    };
  });

  orderRef
    .set({ date: firebase.firestore.FieldValue.serverTimestamp(), ...order })
    .then(() => {
      window.localStorage.removeItem('shoppingCart');

      setTimeout(() => {
        stateUpdater({ type: 'clearCart' });
      }, 200);

      //Router.push('/');
    })
    .catch(err => {
      console.error(err);
    });

  return orderRef.id;
}
