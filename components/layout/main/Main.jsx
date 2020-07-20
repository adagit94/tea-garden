import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Main({ children }) {
  return (
    <Container>
      <Row>
        <Col>
          <main>
            {children}
          </main>
        </Col>
      </Row>
    </Container>
  );
}