import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Main({ page }) {
  console.log(page);
  
  return (
    <main>
      <Container>{page}</Container>
    </main>
  );
}
