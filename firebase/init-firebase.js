import * as firebase from 'firebase/app';
import "firebase/analytics";

import config from './config.json';

export function initFirebase() {
  firebase.initializeApp(config);
  firebase.analytics();
}
