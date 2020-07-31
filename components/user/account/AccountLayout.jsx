import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { UserStateContext } from '../UserDataProvider';
import { PageLoading } from 'components/ui/Indicators';
import { logout } from '../../../firebase/auth';

import styles from './AccountLayout.module.scss';

export default function AccountLayout({ activeItem, children }) {
  const router = useRouter();
  const userState = useContext(UserStateContext);

  const { query } = router;
  const { firebase, isAuthenticated, address, orders } = userState;

  useEffect(() => {
    if (firebase && query.uid !== firebase.uid) {
      const page = /\w+$/.exec(router.pathname);

      router.push(`/[uid]/${page}`, `/${firebase.uid}/${page}`);
    }
  });

  useEffect(() => {
    if (window.localStorage.getItem('userLoading') === null) {
      router.push('/prihlaseni');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated || !address || !orders) return <PageLoading />;

  return (
    <>
      <Row className='p-3'>
        <Col
          className={`d-flex flex-lg-column justify-content-between p-0 pb-3 pb-lg-0 pr-lg-3 ${styles.accountNavCol}`}
          xs={12}
          lg={2}
        >
          <Nav
            as='nav'
            className='flex-lg-column'
            variant='pills'
            activeKey={activeItem}
          >
            <Link
              href='/[uid]/nastaveni'
              as={`/${firebase.uid}/nastaveni`}
              passHref
            >
              <Nav.Link eventKey='settings'>
                Nastavení
              </Nav.Link>
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
              onClick={() => {
                logout('/');
              }}
              variant='outline-secondary'
            >
              <span id='account-name'>{firebase.displayName}</span>{' '}
              <img src='/icons/log-out.svg' alt='odhlásit' />
            </Button>
          </div>
        </Col>
        <Col xs={12} lg={10}>
          {children}
        </Col>
      </Row>
    </>
  );
}
