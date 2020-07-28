import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import styles from './UI.module.scss';

export function PageLoading() {
  return (
    <Row className='p-3'>
      <Col className='p-5 text-center'>
        <Spinner className={styles.pageLoading} variant='primary' animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </Col>
    </Row>
  );
}
