import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Carousel from 'components/index/carousel/Carousel';
import TabbedLists from 'components/index/tabbed-lists/TabbedLists';
import CategoryTiles from 'components/index/category-tiles/CategoryTiles';

export default function Index() {
  return (
    <>
      <Row>
        <Col className='p-0'>
          <Carousel />
        </Col>
      </Row>
      <Row>
        <Col>
          <TabbedLists />
        </Col>
      </Row>
      <Row xs={1} sm={2}>
        <CategoryTiles />
      </Row>
    </>
  );
}
