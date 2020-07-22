import React from 'react';
import Carous from 'react-bootstrap/Carousel';

export default function Carousel() {
  return (
    <Carous
      controls={false}
      keyboard={false}
      pause={false}
      touch={false}
      data-ride='carousel'
    >
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
  );
}
