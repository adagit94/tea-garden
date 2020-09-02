import React, { useState, createContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import UserDataProvider from '../components/user/UserDataProvider';
import Layout from '../components/layout/Layout';
import { initFirebase } from 'firebase/init-firebase';

import 'scss/bootstrap.css';

export const AppStateContext = createContext();

export default function MyApp({ Component, pageProps }) {
  const [firebaseReady, setFirebaseReady] = useState(false);

  const page =
    Component.name === 'Index' ? (
      <Component {...pageProps} />
    ) : (
      <Container>
        <Component {...pageProps} />
      </Container>
    );

  useEffect(() => {
    initFirebase(setFirebaseReady);
  }, []);

  return (
    <AppStateContext.Provider value={firebaseReady}>
      <UserDataProvider>
        <Layout page={page} />
      </UserDataProvider>
    </AppStateContext.Provider>
  );
}
