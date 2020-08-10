import React, { useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import AccountLayout from 'components/user/account/AccountLayout';
import UserForm from 'components/user/account/settings/UserForm';
import AddressForm from 'components/user/account/settings/AddressForm';
import { deleteUser } from '../../firebase/auth';
import { useFirebaseAlert } from 'custom-hooks/error-handling';
import { FirebaseAlert } from 'components/ui/Alerts';
import { UserStateContext } from 'components/user/UserDataProvider';

import styles from 'components/user/account/settings/Settings.module.scss';

export default function Settings() {
  const [showModal, setShowModal] = useState(false);

  const userState = useContext(UserStateContext);

  const [alert, setAlert] = useFirebaseAlert();

  const { firebase } = userState;

  return (
    <AccountLayout activeItem='settings'>
      <Row xs={1} lg={2}>
        <Col className='p-0 py-3 py-lg-0 px-lg-3 text-center text-lg-left'>
          <UserForm />

          <Button
            onClick={() => {
              setShowModal(true);
            }}
            variant='outline-danger'
          >
            Odstranit účet
          </Button>

          <FirebaseAlert
            variant={alert.variant}
            show={alert.show}
            msg={alert.msg}
          />

          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
            animation={false}
          >
            <Modal.Body>
              <div className='mb-3 text-center'>
                Opravdu chcete odstranit účet?
              </div>

              <div className='text-center'>
                <Button
                  onClick={() => {
                    deleteUser(firebase, setShowModal, setAlert);
                  }}
                  className={styles.modalBtn}
                  variant='outline-danger'
                >
                  Ano
                </Button>

                <Button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className={`ml-3 ${styles.modalBtn}`}
                  variant='outline-danger'
                >
                  Ne
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Col>

        <Col
          className={`p-0 pt-3 pt-lg-0 pl-lg-3 text-center text-lg-left ${styles.addressForm}`}
        >
          <AddressForm />
        </Col>
      </Row>
    </AccountLayout>
  );
}
