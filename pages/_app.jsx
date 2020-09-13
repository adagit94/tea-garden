import React, { useState, createContext, useEffect } from 'react';

import UserDataProvider from '../components/user/UserDataProvider';
import PaymentProvider from 'components/stripe/PaymentProvider';
import Layout from '../components/layout/Layout';
import { initFirebase } from 'firebase/init-firebase';

import 'scss/bootstrap.css';

export const AppStateContext = createContext();

export default function MyApp({ Component, pageProps }) {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    initFirebase(setFirebaseReady);
  }, []);

  return (
    <AppStateContext.Provider value={firebaseReady}>
      <UserDataProvider>
        <PaymentProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PaymentProvider>
      </UserDataProvider>
    </AppStateContext.Provider>
  );
}
