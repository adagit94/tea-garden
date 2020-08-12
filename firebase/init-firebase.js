import * as firebase from 'firebase/app';
import 'firebase/analytics';

import config from './config.json';

export let firestore;
export let auth;

export function initFirebase(setFirebaseReady) {
  firebase.initializeApp(config);
  firebase.analytics();

  firestore = firebase.firestore();
  auth = firebase.auth();

  setFirebaseReady();
}
