import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import New from './new/New';
import TopSelling from './top-selling/TopSelling';

import styles from './TabbedLists.module.scss';

export default function TabbedLists() {
  return (
    <Row>
      <Col className='py-1'>
        <Tabs className={`justify-content-center ${styles.tabs}`} defaultActiveKey='new' id='tabbed-teas'>
          <Tab eventKey='new' title='Nejnovější'>
            <New />
          </Tab>
          <Tab eventKey='topSelling' title='Nejprodávanější'>
            <TopSelling />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}
