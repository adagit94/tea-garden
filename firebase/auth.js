import * as firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

export function initAuthObserver(initUser, clearUser) {
  firebase.auth().onAuthStateChanged(
    user => {
      if (user) {
        initUser(user);
      } else {
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
  window.localStorage.setItem('userLoading', 'true');

  let providerObj;

  switch (provider) {
    case 'facebook':
      providerObj = new firebase.auth.FacebookAuthProvider();
      break;

    case 'google':
      providerObj = new firebase.auth.GoogleAuthProvider();
      break;
  }
  
  await firebase
  .auth()
  .signInWithRedirect(providerObj)
  .catch(err => console.error(err));
  
  await firebase
    .auth()
    .getRedirectResult()
    .catch(err => console.error(err));
}

export async function logout() {
  window.localStorage.removeItem('userLoading');

  await firebase
    .auth()
    .signOut()
    .catch(err => console.error(err));
}

export async function createUser(email, password, setAlert) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
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

export async function updateUser(user, username, avatar) {
  if (!username && !avatar) {
    alert('No changes were made');

    return;
  }

  const updateObj = {};

  if (username) updateObj.displayName = username;

  if (avatar) {
    const storage = firebase.storage();
    const avatarsUserRef = storage.ref(`images/avatars/${user.uid}`);
    const newAvatarRef = avatarsUserRef.child(`${avatar.name}`);
    const currentAvatar = await avatarsUserRef
      .listAll()
      .then(result => result.items[0])
      .catch(err => console.error(err));

    if (currentAvatar) {
      const currentAvatarRef = avatarsUserRef.child(`${currentAvatar.name}`);

      await currentAvatarRef.delete().catch(err => console.error(err));
    }

    await newAvatarRef.put(avatar).catch(err => console.error(err));

    await newAvatarRef
      .getDownloadURL()
      .then(url => {
        updateObj.photoURL = url;
      })
      .catch(err => console.error(err));
  }

  await user.updateProfile(updateObj).catch(err => alert(err));

  window.location.reload();
}
