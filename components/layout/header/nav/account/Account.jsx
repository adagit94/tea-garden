import Link from 'next/link';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

import { UserStateContext } from 'components/user/UserDataProvider';

function Loading() {
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

function User({ uid }) {
  return (
    <Link href='/[uid]/nastaveni' as={`/${uid}/nastaveni`} passHref>
      <Button as='a' variant='outline-light'>
        <img src='/icons/user.svg' alt='uživatel' />
      </Button>
    </Link>
  );
}

function LogIn() {
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
      {loading && <Loading />}

      {!loading && isAuthenticated && <User uid={firebase.uid} />}

      {!loading && !isAuthenticated && <LogIn />}
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
