import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Main({ children }) {
  return (
    <Container>
      <main>
        {children}
      </main>
    </Container>
  );
}