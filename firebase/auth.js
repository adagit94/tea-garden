import * as firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

export async function logout() {
  firebase
    .auth()
    .signOut()
    .catch(err => console.error(err));
}

export function initAuthObserver(
  initFirebaseUser,
  clearFirebaseUser
) {
  firebase.auth().onAuthStateChanged(
    user => {
      if (user) {
        if (user.emailVerified) {
          sessionStorage.setItem('uid', user.uid);

          initFirebaseUser(user);
        } else {
          logout();
        }
      } else {
        sessionStorage.removeItem('uid');

        clearFirebaseUser();
      }
    },
    err => console.error(err)
  );
}

export async function createUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(credential => {
      credential.user.sendEmailVerification().catch(err => console.error(err));
      window.history.back();
    })
    .catch(err => alert(err));
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

export async function loginEmail(
  email,
  password,
  handleLoading
) {
  handleLoading(true);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(credential => {
      if (!credential.user.emailVerified) {
        alert('Please, verify your email before log in.');
      }
    })
    .catch(err => {
      handleLoading(false);
      alert(err);
    });
}

export async function loginProvider(provider, handleLoading) {
  handleLoading(true);

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

export async function resetPassword(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => window.history.back())
    .catch(err => console.error(err));
}
