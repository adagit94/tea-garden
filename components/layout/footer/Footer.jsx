import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Newsletter from './newsletter/Newsletter';
import Contact from './contact/Contact';

export default function Footer() {
  return (
    <Row className='bg-light' as='footer' xs={1} lg={2}>
      <Col className='d-flex flex-column justify-content-center'>
        <Newsletter />
      </Col>
      <Col className='d-flex justify-content-between justify-content-lg-center'>
        <Contact />
      </Col>
    </Row>
  );
}
