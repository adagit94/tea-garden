import Link from 'next/link';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { UserStateContext } from '../UserDataProvider';
import { logout } from '../../../firebase/auth';

export default function AccountLayout({ activeItem, children }) {
  const userState = useContext(UserStateContext);

  const uid = userState.firebase?.uid;

  return (
    <>
      <Row>
        <Col className='d-flex justify-content-end'>
          <Button onClick={logout} variant='outline-light'>
            <img src='/icons/log-out.svg' alt='odhlásit' />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <Nav as='nav' className='flex-column' variant='pills' activeKey={activeItem}>
            <Link href='/[uid]/nastaveni' as={`/${uid}/nastaveni`} passHref>
              <Nav.Link eventKey='settings'>Nastavení</Nav.Link>
            </Link>
            <Link href='/[uid]/objednavky' as={`/${uid}/objednavky`} passHref>
              <Nav.Link eventKey='orders'>Objednávky</Nav.Link>
            </Link>
          </Nav>
        </Col>
        <Col lg={10}>{children}</Col>
      </Row>
    </>
  );
}
