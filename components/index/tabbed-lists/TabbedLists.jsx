import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Items from './items/Items';

import styles from './TabbedLists.module.scss';

export default function TabbedLists() {
  return (
    <Tabs
      className={`justify-content-center ${styles.tabs}`}
      defaultActiveKey='new'
      id='tabbed-teas'
    >
      <Tab eventKey='new' title='Nejnovější'>
        <Items list='new' />
      </Tab>
      <Tab eventKey='topSelling' title='Nejprodávanější'>
        <Items list='topSelling' />
      </Tab>
    </Tabs>
  );
}
