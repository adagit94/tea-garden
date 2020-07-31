import Link from 'next/link';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';

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
      <Nav.Link className='p-2'>
        <img className='p-1' src='/icons/user.svg' alt='uživatel' />
      </Nav.Link>
    </Link>
  );
}

function LogIn() {
  return (
    <Link href='/prihlaseni' passHref>
      <Nav.Link className='p-2'>
        <img className='p-1' src='/icons/log-in.svg' alt='přihlásit' />
      </Nav.Link>
    </Link>
  );
}

export default function Account() {
  const userState = useContext(UserStateContext);

  const { firebase, isAuthenticated, loading } = userState;

  return (
    <Nav className='flex-row'>
      {loading && <Loading />}

      {!loading && isAuthenticated && <User uid={firebase.uid} />}

      {!loading && !isAuthenticated && <LogIn />}
      <Dropdown>
        <Dropdown.Toggle
          as={Nav.Link}
          className='p-2'
          id='dropdown-shopping-cart'
        >
          <img className='p-1' src='/icons/shopping-cart.svg' alt='nákupní košík' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>a</Dropdown.Item>
          <Dropdown.Item>b</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
}
