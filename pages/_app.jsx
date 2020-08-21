import React, { useState, createContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import UserDataProvider from '../components/user/UserDataProvider';
import Layout from '../components/layout/Layout';
import { initFirebase } from 'firebase/init-firebase';

import 'scss/app.scss';

export const AppStateContext = createContext();

export default function MyApp({ Component, pageProps }) {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    initFirebase(setFirebaseReady);
  }, []);

  return (
    <AppStateContext.Provider value={firebaseReady}>
      <UserDataProvider>
        <Layout>
          {Component.name === 'Index' && <Component {...pageProps} />}

          {Component.name !== 'Index' && (
            <Container>
              <Component {...pageProps} />
            </Container>
          )}
        </Layout>
      </UserDataProvider>
    </AppStateContext.Provider>
  );
}
