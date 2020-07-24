import React from 'react';

import UserDataProvider from '../components/user/UserDataProvider';
import Layout from '../components/layout/Layout';

import '../scss/app.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserDataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserDataProvider>
  );
}
