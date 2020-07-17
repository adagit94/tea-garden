import React from 'react';
import Container from 'react-bootstrap/Container';

import Nav from './nav/Nav';

export default function Header() {
  return (
    <Container className='bg-light' fluid>
      <Container>
        <Nav />
      </Container>
    </Container>
  );
}