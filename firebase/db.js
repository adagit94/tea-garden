import * as firebase from 'firebase/app';
import 'firebase/firestore';

export async function initUserListener(user, syncUser) {
  const { uid, displayName } = user;
  const userRef = firebase.firestore().collection('users').doc(uid);

  await userRef
    .get()
    .then(doc => {
      if (!doc.exist) {
        userRef
          .set({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            addresses: {
              invoicing: {
                name: displayName || '',
                street_house_no: '',
                city: '',
                country: '',
                post_code: '',
              },
              delivery: {},
            },
            orders: {},
          })
          .catch(err => {
            console.error(err);
          });
      }

      userRef.onSnapshot(doc => {
        console.log(doc.data());
        const { addresses, orders } = doc.data();
        syncUser({ addresses, orders });
      });
    })
    .catch(err => {
      console.error(err);
    });
}
