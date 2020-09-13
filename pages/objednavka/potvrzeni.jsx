import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';
import { PageLoading } from 'components/ui/Indicators';

export default function Confirmation() {
  const router = useRouter();

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const { orderData } = userState;

  const unconfirmedPaymentRef = useRef();

  unconfirmedPaymentRef.current =
    orderData.withPayment && !orderData.paymentConfirmed;

  useEffect(() => {
    if (!window.localStorage.getItem('orderData')) router.push('/');

    return () => {
      if (!unconfirmedPaymentRef.current) {
        userDispatch({ type: 'clearOrderData' });
        window.localStorage.removeItem('orderData');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Object.getOwnPropertyNames(orderData).length === 0)
    return <PageLoading />;

  return (
    <Row>
      <Col className='p-3'>
        {unconfirmedPaymentRef.current ? (
          <p>
            Objednávka nebyla uhrazena. Nejdříve ji uhraďte na{' '}
            <Link href='/objednavka/platba'>
              <a style={{ textDecoration: 'underline' }}>platební stránce</a>
            </Link>
            . Děkujeme.
          </p>
        ) : (
          <p>
            Objednávka <strong>{orderData.oid}</strong> byla vytvořena a na Vaši
            e-mailovou adresu odeslány informace o objednávce.
          </p>
        )}
      </Col>
    </Row>
  );
}
