import Link from 'next/link';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './CategoryTiles.module.scss';

export default function CategoryTiles() {
  return (
    <Row xs={1} sm={2}>
      <Col className={`p-3 ${styles.categoryTile}`}>
        <Link href='/[...param]' as='/cerstve'>
          <a className='stretched-link'>
            <h1 className='text-center'>Čerstvé čaje</h1>
            <div className='overflow-hidden rounded-circle mx-auto'>
              <img src='/teas/_hp/sencha-meiryoku-2020.jpg' alt='čerstvý čaj' />
            </div>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 ${styles.categoryTile}`}>
        <Link href='/[...param]' as='/archivni'>
          <a className='stretched-link'>
            <h1 className='text-center'>Archivní čaje</h1>
            <div className='overflow-hidden rounded-circle mx-auto'>
              <img
                src='/teas/_hp/bu-lang-mountain-shu-puerh-beeng-cha-2015.jpg'
                alt='archivní čaj'
              />
            </div>
          </a>
        </Link>
      </Col>
    </Row>
  );
}
