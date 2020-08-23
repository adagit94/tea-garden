import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Nav from './nav/Nav';

export default function Header() {
  return (
    <header>
      <Row>
        <Col className='p-0'>
          <Nav />
        </Col>
      </Row>
    </header>
  );
}
