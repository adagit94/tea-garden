import Link from 'next/link';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function New() {
  return (
    <Row>
      <Col className=''>
        <Link href='/'>
          <a className='stretched-link'>
            <div className='overflow-hidden rounded-circle mx-auto'>
              <img
                src='/teas/red/darjeeling-rohini-delight-first-flush-2020.jpg'
                alt='darjeeling'
              />
            </div>
            <div className='text-center'>Darjeeling Rohini FTGFOP-1</div>
          </a>
        </Link>
      </Col>
    </Row>
  );
}
