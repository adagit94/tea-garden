import Link from 'next/link';
import React from 'react';
import Col from 'react-bootstrap/Col';

import styles from './CategoryTiles.module.scss';

export default function CategoryTiles() {
  return (
    <>
      <Col className={`p-3 ${styles.categoryTile}`}>
        <Link href='/[...param]' as='/cerstve'>
          <a className='stretched-link'>
            <h1 className='text-center'>Čerstvé čaje</h1>
            <div className='overflow-hidden rounded-circle mx-auto'>
              <img src='/teas/fresh.jpg' alt='čerstvý čaj' />
            </div>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 ${styles.categoryTile}`}>
        <Link href='/[...param]' as='/archivni'>
          <a className='stretched-link'>
            <h1 className='text-center'>Archivní čaje</h1>
            <div className='overflow-hidden rounded-circle mx-auto'>
              <img src='/teas/archive.jpg' alt='archivní čaj' />
            </div>
          </a>
        </Link>
      </Col>
    </>
  );
}
