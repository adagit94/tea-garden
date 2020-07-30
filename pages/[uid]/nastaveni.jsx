import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AccountLayout from 'components/user/account/AccountLayout';
import UserForm from 'components/user/account/settings/UserForm';
import AddressForm from 'components/user/account/settings/AddressForm';

import styles from 'components/user/account/settings/Settings.module.scss';

export default function Settings() {
  return (
    <AccountLayout activeItem='settings'>
      <Row xs={1} lg={2}>
        <Col className='p-0 py-3 py-lg-0 px-lg-3'>
          <UserForm />
        </Col>
        <Col className={`p-0 pt-3 pt-lg-0 pl-lg-3 ${styles.addressForm}`}>
          <AddressForm />
        </Col>
      </Row>
    </AccountLayout>
  );
}
