import Link from 'next/link'
import React from 'react';
import Button from 'react-bootstrap/Button'

import styles from './Account.module.scss';

export default function Account(props) {
  return (
    <div {...props}>
      <Button variant='light'><img src='/icons/user.svg' alt='user' /></Button>
      <Button variant='light'><img src='/icons/shopping-cart.svg' alt='shopping cart' /></Button>
    </div>
  );
}
//<Button variant='light' as='a'><img src='/icons/user.svg' alt='user' /></Button>