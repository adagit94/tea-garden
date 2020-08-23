import Link from 'next/link';
import React from 'react';
import Col from 'react-bootstrap/Col';

export default function Links() {
  return (
    <>
      <Col className='d-flex flex-column align-items-sm-center'>
        <h4>Infomace pro zákazníky</h4>
        <ul className='list-unstyled'>
          <li>
            <Link href='#'>
              <a>O nás</a>
            </Link>
          </li>
          <li>
            <Link href='#'>
              <a>Obchodní podmínky</a>
            </Link>
          </li>
          <li>
            <Link href='#'>
              <a>Ochrana osobních údajů</a>
            </Link>
          </li>
        </ul>
      </Col>
      <Col className='d-flex flex-column align-items-sm-center'>
        <h4>Užitečné info</h4>
        <ul className='list-unstyled'>
          <li>
            <Link href='#'>
              <a>Příprava čaje</a>
            </Link>
          </li>
          <li>
            <Link href='#'>
              <a>Vybavení</a>
            </Link>
          </li>
        </ul>
      </Col>
    </>
  );
}
