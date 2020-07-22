import Link from 'next/link';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';

import styles from './New.module.scss';

export default function New() {
  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5}>
      <Col className={`p-3 d-flex justify-content-center align-items-center ${styles.teaItem}`}>
        <Link href='/'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/red/darjeeling-rohini-delight-first-flush-2020.jpg'
                  alt='červený'
                />
              </div>
              <Figure.Caption>Darjeeling Rohini Delight</Figure.Caption>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex flex-column justify-content-center align-items-center ${styles.teaItem}`}>
        <Link href='/'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/red/darjeeling-arya-diamond-first-flush-2020-bio.jpg'
                  alt='červený'
                />
              </div>
              <Figure.Caption>
                Darjeeling Arya Diamond
              </Figure.Caption>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex flex-column justify-content-center align-items-center ${styles.teaItem}`}>
        <Link href='/'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/green/ha-giang-green-shan.jpg'
                  alt='zelený'
                />
              </div>
              <Figure.Caption>
                Ha Giang Green Shan
              </Figure.Caption>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex flex-column justify-content-center align-items-center ${styles.teaItem}`}>
        <Link href='/'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/green/lung-ching-xi-hu-draci-studna-2020.jpg'
                  alt='zelený'
                />
              </div>
              <Figure.Caption>
                Lung Ching Xi Hu{' '}
              </Figure.Caption>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex flex-column justify-content-center align-items-center ${styles.teaItem}`}>
        <Link href='/'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/oolong/formosa-alishan-hong-shui-oolong-2020.jpg'
                  alt='oolong'
                />
              </div>
              <Figure.Caption>
                Formosa Alishan Hong Shui
              </Figure.Caption>
            </Figure>
          </a>
        </Link>
      </Col>
    </Row>
  );
}
