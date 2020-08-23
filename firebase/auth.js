import Router from 'next/router';
import * as firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

import { auth } from './init-firebase';
import {
  initFirestoreListeners,
  detachAddressListener,
  detachOrdersListener,
} from './db';

export function initAuthObserver(initUser, clearUser, syncData) {
  auth.onAuthStateChanged(
    user => {
      if (user) {
        initFirestoreListeners(user, syncData);
        initUser(user);
      } else {
        if (typeof detachAddressListener === 'function') {
          detachAddressListener();
        }

        if (typeof detachOrdersListener === 'function') {
          detachOrdersListener();
        }

        clearUser();
      }
    },
    err => {
      console.error(err);
    }
  );
}

export async function loginEmail(email, password, setAlert) {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.localStorage.setItem('isLogged', 'true');
    })
    .catch(err => {
      console.error(err);

      let msg;

      switch (err.code) {
        case 'auth/invalid-email':
          msg = 'Neplatná e-mailová adresa.';
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

      setAlert({ variant: 'danger', show: true, msg });
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

  window.localStorage.setItem('isLogged', 'true');

  await auth.signInWithRedirect(providerObj).catch(err => {
    console.error(err);
  });

  await auth.getRedirectResult().catch(err => {
    console.error(err);
  });
}

export async function logout(route) {
  auth
    .signOut()
    .then(() => {
      window.localStorage.removeItem('isLogged');

      Router.push(route);
    })
    .catch(err => {
      console.error(err);
    });
}

export async function createUser(email, password, setAlert) {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.localStorage.setItem('isLogged', 'true');
    })
    .catch(err => {
      console.error(err);

      switch (err.code) {
        case 'auth/email-already-in-use':
          setAlert({
            variant: 'danger',
            show: true,
            msg: 'E-mailová adresa je již registrována.',
          });
          break;
      }
    });
}

export async function updateUser(user, values, setAlert) {
  const { name, email, password } = values;

  let updated;
  let error;

  if (email !== '' && email !== user.email) {
    await user
      .updateEmail(email)
      .then(() => {
        updated = true;
      })
      .catch(err => {
        console.error(err);

        switch (err.code) {
          case 'auth/email-already-in-use':
            setAlert({
              variant: 'danger',
              show: true,
              msg: 'E-mailová adresa je již registrována.',
            });
            break;

          case 'auth/requires-recent-login':
            setAlert({
              variant: 'danger',
              show: true,
              msg:
                'Je nutné se znovu přihlásit. Budete přesměrováni na stránku přihlášení.',
            });

            setTimeout(() => {
              logout('/prihlaseni');
            }, 4000);
            break;
        }

        error = true;
      });
  }

  if (error) return;

  if (password !== '') {
    await user
      .updatePassword(password)
      .then(() => {
        updated = true;
      })
      .catch(err => {
        console.error(err);

        switch (err.code) {
          case 'auth/requires-recent-login':
            setAlert({
              variant: 'danger',
              show: true,
              msg:
                'Je nutné se znovu přihlásit. Budete přesměrováni na stránku přihlášení.',
            });

            setTimeout(() => {
              logout('/prihlaseni');
            }, 4000);
            break;
        }

        error = true;
      });
  }

  if (error) return;

  if (name !== '' && name !== user.displayName) {
    await user
      .updateProfile({ displayName: name })
      .then(() => {
        updated = true;

        document.querySelector('#account-name').innerHTML = name;
      })
      .catch(err => {
        console.error(err);
      });
  }

  if (updated) {
    setAlert({
      variant: 'success',
      show: true,
      msg: 'Změna proběhla úspěšně.',
    });
  } else {
    setAlert({
      variant: 'danger',
      show: true,
      msg: 'Nebyla provedena zádná změna.',
    });
  }
}

export async function sendPasswordReset(email, setAlert) {
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      setAlert({
        variant: 'success',
        show: true,
        msg: 'Email s odkazem pro reset hesla byl odeslán.',
      });
    })
    .catch(err => {
      console.error(err.code);

      switch (err.code) {
        case 'auth/user-not-found':
          setAlert({
            variant: 'danger',
            show: true,
            msg: 'Uživatel neexistuje.',
          });
          break;
      }
    });
}
export async function resetPassword(password, actionCode, setAlert) {
  auth
    .verifyPasswordResetCode(actionCode)
    .then(() => {
      auth
        .confirmPasswordReset(actionCode, password)
        .then(() => {
          Router.push('/prihlaseni');
        })
        .catch(err => {
          console.error(err);

          let msg;

          switch (err.code) {
            case 'auth/expired-action-code':
              msg = 'Odkaz pro reset hesla vypršel.';
              break;

            case 'auth/invalid-action-code':
              msg = 'Odkaz pro reset hesla byl již použitý.';
              break;
          }

          setAlert({ variant: 'danger', show: true, msg });
        });
    })
    .catch(err => {
      console.error(err);

      let msg;

      switch (err.code) {
        case 'auth/expired-action-code':
          msg = 'Odkaz pro reset hesla vypršel.';
          break;

        case 'auth/invalid-action-code':
          msg = 'Odkaz pro reset hesla byl již použitý.';
          break;
      }

      setAlert({ variant: 'danger', show: true, msg });
    });
}

export async function deleteUser(user, setShowModal, setAlert) {
  user
    .delete()
    .then(() => {
      window.localStorage.removeItem('isLogged');

      Router.push('/');
    })
    .catch(err => {
      console.error(err);

      switch (err.code) {
        case 'auth/requires-recent-login':
          setShowModal(false);
          setAlert({
            variant: 'danger',
            show: true,
            msg:
              'Je nutné se znovu přihlásit. Budete přesměrováni na stránku přihlášení.',
          });

          setTimeout(() => {
            logout('/prihlaseni');
          }, 4000);
          break;
      }
    });
}
