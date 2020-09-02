import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Main({ page }) {
  return (
    <main>
      <Container fluid={page.type.name === 'Index'}>{page}</Container>
    </main>
  );
}
