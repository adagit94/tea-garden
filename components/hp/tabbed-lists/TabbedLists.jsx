import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import New from './new/New';
import TopSelling from './top-selling/TopSelling';

export default function TabbedLists() {
  return (
    <Tabs defaultActiveKey='new' id='tabbedTeas'>
      <Tab eventKey='new' title='Nejnovější'>
        <New />
      </Tab>
      <Tab eventKey='topSelling' title='Nejprodávanější'>
        <TopSelling />
      </Tab>
    </Tabs>
  );
}
