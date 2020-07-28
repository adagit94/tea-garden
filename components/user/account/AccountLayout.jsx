import Link from 'next/link';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { UserStateContext } from '../UserDataProvider';
import { logout } from '../../../firebase/auth';

import styles from './AccountLayout.module.scss';

export default function AccountLayout({ activeItem, children }) {
  const userState = useContext(UserStateContext);

  const uid = userState.firebase?.uid;

  return (
    <>
      <Row className='p-3'>
        <Col className={`p-3 ${styles.accountNavCol}`} xs={12} lg={2}>
          <Nav as='nav' className='flex-lg-column' variant='pills' activeKey={activeItem}>
            <Link href='/[uid]/nastaveni' as={`/${uid}/nastaveni`} passHref>
              <Nav.Link className='border-bottom' eventKey='settings'>Nastavení</Nav.Link>
            </Link>
            <Link href='/[uid]/objednavky' as={`/${uid}/objednavky`} passHref>
              <Nav.Link eventKey='orders'>Objednávky</Nav.Link>
            </Link>
          </Nav>
          <Button onClick={logout} variant='outline-secondary'>
            <img src='/icons/log-out.svg' alt='odhlásit' />
          </Button>
        </Col>
        <Col xs={12} lg={10}>{children}</Col>
      </Row>
    </>
  );
}
