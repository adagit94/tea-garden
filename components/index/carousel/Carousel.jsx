import React from 'react';
import Carous from 'react-bootstrap/Carousel';

import styles from './Carousel.module.scss';

export default function Carousel() {
  return (
    <Carous
      className='bg-primary'
      controls={false}
      keyboard={false}
      pause={false}
      touch={false}
    >
      <Carous.Item className={`${styles.slide} ${styles.slide1}`} />
      <Carous.Item className={`${styles.slide} ${styles.slide2}`} />
    </Carous>
  );
}
