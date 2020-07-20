import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel'

export default function Home() {
  return (
    <>
      <Row>
        <Col>
          <Carousel controls={false} indicators={false} keyboard={false} pause={false} touch={false} data-ride='carousel'>
            <Carousel.Item>
              <img className='d-block w-100' src='/carousel/pu-erh-1.jpg' alt='pu erh' />
            </Carousel.Item>
            <Carousel.Item>
              <img className='d-block w-100' src='/carousel/pu-erh-2.jpg' alt='pu erh' />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      <Row>
        <Col>
        </Col>
      </Row>
    </>
  );
}