import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Carousel from '../components/hp/carousel/Carousel';
import TabbedLists from '../components/hp/tabbed-lists/TabbedLists';
import CategoryTiles from '../components/hp/category-tiles/CategoryTiles';

export default function Home() {
  return (
    <>
      <Row>
        <Col>
          <Carousel />
        </Col>
      </Row>
      <Row>
        <Col className='p-3'>
          <TabbedLists />
        </Col>
      </Row>
      <Row xs={1} sm={2}>
        <CategoryTiles />
      </Row>
    </>
  );
}
