import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Newsletter from './newsletter/Newsletter';
import Links from './links/Links';
import Contact from './contact/Contact';

export default function Footer() {
  return (
    <Container className='bg-footer py-3' fluid>
      <Container>
        <footer>
          <Row xs={1} sm={2}>
            <Links />
          </Row>
          <Row className='pt-3' xs={1} xl={2}>
            <Col className='d-flex flex-column justify-content-center'>
              <Newsletter />
            </Col>
            <Col className='pt-3 d-flex flex-column flex-sm-row justify-content-center'>
              <Contact />
            </Col>
          </Row>
        </footer>
      </Container>
    </Container>
  );
}
