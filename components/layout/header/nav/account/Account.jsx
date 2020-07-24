import Link from 'next/link';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import { UserStateContext } from 'components/user/UserDataProvider';

import styles from './Account.module.scss';

function LogIn() {
  return (
    <Link href='/prihlaseni' passHref>
      <Button as='a' variant='outline-light'>
        <img src='/icons/log-in.svg' alt='přihlásit' />
      </Button>
    </Link>
  );
}

function User({ uid }) {
  return (
    <Link href='/[uid]/nastaveni' as={`/${uid}/nastaveni`} passHref>
      <Button as='a' variant='outline-light'>
        <img src='/icons/user.svg' alt='uživatel' />
      </Button>
    </Link>
  );
}

export default function Account() {
  const userState = useContext(UserStateContext);

  const { firebase } = userState;

  return (
    <div className='d-flex'>
      {firebase === undefined ? <LogIn /> : <User uid={firebase.uid} />}
      <Dropdown>
        <Dropdown.Toggle variant='outline-light' id='dropdown-shopping-cart'>
          <img src='/icons/shopping-cart.svg' alt='nákupní košík' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
