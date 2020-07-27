import Link from 'next/link';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

import { UserStateContext } from 'components/user/UserDataProvider';
import LogIn from 'components/log-in/LogIn';

import styles from './Account.module.scss';

function LoadingBtn() {
  return (
    <Button variant='outline-light' type='button'>
      <Spinner
        variant='primary'
        size='sm'
        animation='border'
        role='status'
        aria-hidden='true'
      >
        <span className='sr-only'>Načítání...</span>
      </Spinner>
    </Button>
  );
}

function UserBtn({ uid }) {
  return (
      <Button onClick={} variant='outline-light'>
        <img src='/icons/user.svg' alt='uživatel' />
      </Button>
  );
}

function LogInBtn() {
  return (
    <Link href='/prihlaseni' passHref>
      <Button as='a' variant='outline-light'>
        <img src='/icons/log-in.svg' alt='přihlásit' />
      </Button>
    </Link>
  );
}

export default function Account() {
  const userState = useContext(UserStateContext);

  const { firebase, isAuthenticated, loading } = userState;

  return (
    <div className='d-flex'>
      {loading && <LoadingBtn />}

      {!loading && isAuthenticated && <UserBtn uid={firebase.uid} />}

      {!loading && !isAuthenticated && <LogInBtn />}
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
