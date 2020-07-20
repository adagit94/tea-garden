import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Nav from './nav/Nav';

export default function Header() {
  return (
    <Container className='bg-light' fluid>
      <Container>
        <Row>
          <Col>
            <header>
              <Nav />
            </header>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}