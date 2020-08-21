import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carous from 'react-bootstrap/Carousel';

import styles from './Carousel.module.scss';

export default function Carousel() {
  return (
    <Row>
      <Col className='p-0'>
        <Carous className='bg-primary' controls={false} keyboard={false} pause={false} touch={false}>
          <Carous.Item className={`${styles.slide} ${styles.slide1}`} />
          <Carous.Item className={`${styles.slide} ${styles.slide2}`} />
        </Carous>
      </Col>
    </Row>
  );
}
