import Link from 'next/link';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';

import styles from './New.module.scss';

export default function New() {
  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5}>
      <Col className={`p-3 d-flex justify-content-center ${styles.teaItem}`}>
        <Link href='/[...param]' as='/cerveny/darjeeling/darjeeling-rohini-delight-ftgfop-1-first-flush-2020'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/_hp/darjeeling-rohini-delight-first-flush-2020.jpg'
                  alt='darjeeling rohini'
                />
              </div>
              <Figure>Darjeeling Rohini Delight</Figure>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex justify-content-center ${styles.teaItem}`}>
        <Link href='/[...param]' as='/cerveny/darjeeling/darjeeling-arya-diamond-first-flush-2020-bio'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/_hp/darjeeling-arya-diamond-first-flush-2020-bio.jpg'
                  alt='darjeeling arya'
                />
              </div>
              <Figure>
                Darjeeling Arya Diamond
              </Figure>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex justify-content-center ${styles.teaItem}`}>
        <Link href='/[...param]' as='/zeleny/vietnam/ha-giang-green-shan-2020'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/_hp/ha-giang-green-shan.jpg'
                  alt='ha giang'
                />
              </div>
              <Figure>
                Ha Giang Green Shan
              </Figure>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex justify-content-center ${styles.teaItem}`}>
        <Link href='/[...param]' as='/zeleny/cina/lung-ching-xi-hu-draci-studna-2020'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/_hp/lung-ching-xi-hu-draci-studna-2020.jpg'
                  alt='lung ching'
                />
              </div>
              <Figure>
                Lung Ching Xi Hu
              </Figure>
            </Figure>
          </a>
        </Link>
      </Col>
      <Col className={`p-3 d-flex justify-content-center ${styles.teaItem}`}>
        <Link href='/[...param]' as='/oolong/formosa/2020-formosa-alishan-hong-shui-oolong'>
          <a className='stretched-link'>
            <Figure className='m-0'>
              <div className='overflow-hidden rounded-circle mx-auto'>
                <Figure.Image
                  src='/teas/_hp/alishan-hong-shui-oolong-2020.jpg'
                  alt='hong shui'
                />
              </div>
              <Figure>
                Formosa Alishan Hong Shui
              </Figure>
            </Figure>
          </a>
        </Link>
      </Col>
    </Row>
  );
}
