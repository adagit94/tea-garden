import React from 'react';
import Container from 'react-bootstrap/Container';

import Header from './header/Header';
import Main from './main/Main';
import Footer from './footer/Footer';

export default function Layout({ children }) {
  return (
    <Container>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Container>
  );
}
