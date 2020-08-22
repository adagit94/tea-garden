import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { UserStateContext } from '../UserDataProvider';
import { logout } from '../../../firebase/auth';
import { PageLoading } from 'components/ui/Indicators';

import styles from './AccountLayout.module.scss';

export default function AccountLayout({ activeItem, children }) {
  const router = useRouter();
  const userState = useContext(UserStateContext);

  const { query } = router;
  const { firebase, isAuthenticated, loading, address, orders } = userState;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/prihlaseni');
    }

    if (isAuthenticated && query.uid !== firebase.uid) {
      if (query.oid) {
        router.push('/[uid]/objednavky', `/${firebase.uid}/objednavky`);
      } else {
        const page = /\w+$/.exec(router.pathname);

        router.push(`/[uid]/${page}`, `/${firebase.uid}/${page}`);
      }
    }

    if (orders && query.oid && !(query.oid in orders)) {
      router.push('/[uid]/objednavky', `/${firebase.uid}/objednavky`);
    }
  });

  if (!firebase || !address || !orders) return <PageLoading />;

  return (
    <Row className='px-3 px-lg-0 py-lg-3'>
      <Col
        className={`d-flex flex-lg-column justify-content-between p-3 ${styles.accountNavCol}`}
        xs={12}
        lg={2}
      >
        <Nav
          as='nav'
          className='flex-lg-column'
          variant='tabs'
          activeKey={activeItem}
        >
          <Link
            href='/[uid]/nastaveni'
            as={`/${firebase.uid}/nastaveni`}
            passHref
          >
            <Nav.Link eventKey='settings'>Nastavení</Nav.Link>
          </Link>
          <Link
            href='/[uid]/objednavky'
            as={`/${firebase.uid}/objednavky`}
            passHref
          >
            <Nav.Link eventKey='orders'>Objednávky</Nav.Link>
          </Link>
        </Nav>
        <div className='text-center'>
          <Button
            className='text-primary'
            onClick={async () => {
              await router.push('/');

              logout();
            }}
            variant='outline-secondary'
          >
            <span id='account-name'>{firebase.displayName}</span>{' '}
            <img src='/icons/log-out.svg' alt='odhlásit' />
          </Button>
        </div>
      </Col>
      <Col className='py-md-3 py-lg-0' xs={12} lg={10}>
        {children}
      </Col>
    </Row>
  );
}
