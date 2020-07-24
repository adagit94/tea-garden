import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carous from 'react-bootstrap/Carousel';

export default function Carousel() {
  return (
    <Row>
      <Col>
        <Carous controls={false} keyboard={false} pause={false} touch={false}>
          <Carous.Item>
            <img
              className='d-block w-100'
              src='/carousel/pu-erh-1.jpg'
              alt='slide 1'
            />
          </Carous.Item>
          <Carous.Item>
            <img
              className='d-block w-100'
              src='/carousel/pu-erh-2.jpg'
              alt='slide 2'
            />
          </Carous.Item>
        </Carous>
      </Col>
    </Row>
  );
}
