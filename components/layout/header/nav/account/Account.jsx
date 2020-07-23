import Link from 'next/link';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import styles from './Account.module.scss';

export default function Account() {
  return (
    <div className='d-flex'>
      <Dropdown>
        <Dropdown.Toggle variant='outline-light' id='dropdown-user'>
          <img src='/icons/user.svg' alt='user' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>abc</Dropdown.Item>
          <Dropdown.Item>abc</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle variant='outline-light' id='dropdown-shopping-cart'>
          <img src='/icons/shopping-cart.svg' alt='shopping cart' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
