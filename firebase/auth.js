import * as firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

export function initAuthObserver(initUser, clearUser) {
  firebase.auth().onAuthStateChanged(
    user => {
      if (user) {
        initUser(user);
      } else {
        window.localStorage.removeItem('userLoading');

        clearUser();
      }
    },
    err => console.error(err)
  );
}

export async function loginEmail(email, password, setAlert) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.localStorage.setItem('userLoading', 'true');
    })
    .catch(err => {
      let msg;

      switch (err.code) {
        case 'auth/invalid-email':
          msg = 'Neplatná e-mailová adresa';
          break;

        case 'auth/user-disabled':
          msg = 'Uživatel byl deaktivován.';
          break;

        case 'auth/user-not-found':
          msg = 'Uživatel neexistuje.';
          break;

        case 'auth/wrong-password':
          msg = 'Neplatné heslo.';
          break;
      }

      setAlert({ show: true, msg });
    });
}

export async function loginProvider(provider) {
  let providerObj;

  switch (provider) {
    case 'facebook':
      providerObj = new firebase.auth.FacebookAuthProvider();
      break;

    case 'google':
      providerObj = new firebase.auth.GoogleAuthProvider();
      break;
  }

  window.localStorage.setItem('userLoading', 'true');

  await firebase
    .auth()
    .signInWithRedirect(providerObj)
    .then()
    .catch(err => console.error(err));

  await firebase
    .auth()
    .getRedirectResult()
    .catch(err => console.error(err));
}

export async function logout() {
  firebase
    .auth()
    .signOut()
    .catch(err => console.error(err));
}

export async function createUser(email, password, setAlert) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.localStorage.setItem('userLoading', 'true');
    })
    .catch(err => {
      let msg;

      switch (err.code) {
        case 'auth/email-already-in-use':
          msg = 'E-mailová adresa je již registrována.';
          break;
      }

      setAlert({ show: true, msg });
    });
}

export async function resetPassword(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => window.history.back())
    .catch(err => console.error(err));
}

export async function updateUser(user, name) {
  user.updateProfile({displayName: name}).catch(err => console.error(err));

  window.location.reload();
}
