import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Newsletter from './newsletter/Newsletter';
import Contact from './contact/Contact';

export default function Footer() {
  return (
    <Container className='p-3 bg-secondary' fluid>
      <Container>
        <footer>
          <Row xs={1} lg={2}>
            <Col className='d-lg-flex flex-lg-column justify-content-lg-center'>
              <Newsletter />
            </Col>
            <Col className='d-flex'>
              <Contact />
            </Col>
          </Row>
        </footer>
      </Container>
    </Container>
  );
}
