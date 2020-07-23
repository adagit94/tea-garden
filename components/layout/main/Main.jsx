import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Main({ children }) {
  return (
    <Container className='p-0'>
      <main>{children}</main>
    </Container>
  );
}
