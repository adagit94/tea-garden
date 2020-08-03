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

/*    <Card bg='light' border='primary'>
      <Card.Img variant='top' src={productData.images.main} />
      <Card.Body>
        <Card.Title>{productData.name}</Card.Title>
        <Card.Text>
          <b>Popis: </b>
          {productData.describtion}
        </Card.Text>
        <Card.Text>
          <b>Sklizeň: </b>
          {productData.harvest}
        </Card.Text>
        <Card.Text>
          <b>Oblast: </b>
          {productData.location}
        </Card.Text>
        <Card.Text>
          <b>Zpracování: </b>
          {productData.processing}
        </Card.Text>
      </Card.Body>
    </Card>*/