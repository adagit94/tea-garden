import Link from 'next/link';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Product({children}) {
  return(
    <Row>
      <Col>
        {children}
      </Col>
    </Row>
  );
}