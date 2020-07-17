import React from 'react';

import Layout from "../components/layout/Layout";

import "../scss/app.scss";

export default function MyApp({ Component, pageProps }) {
  return (
  <Layout>
    <Component {...pageProps} />
  </Layout>
  );
}
