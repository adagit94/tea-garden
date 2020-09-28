import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import AccountLayout from 'components/user/account/AccountLayout';
import { UserStateContext } from 'components/user/UserDataProvider';
import { PRICES } from 'tea-garden-constants';

export function Address({ address }) {
  return (
    <>
      <p>{address.name}</p>
      <p>{address.streetHouseNo}</p>
      <p>
        {address.city} {address.postCode}
      </p>
      <p>{address.country}</p>
    </>
  );
}

export default function Order() {
  const router = useRouter();

  const userState = useContext(UserStateContext);

  const { oid } = router.query;
  const { orders } = userState;

  const order = orders?.[oid];
  const productsID = order && Object.getOwnPropertyNames(order.products);

  return (
    <AccountLayout activeItem='orders'>
      {order && (
        <>
          <Row>
            <Col className='text-center text-md-left'>
              Objednávka: <b className='text-break'>{oid}</b>
            </Col>
          </Row>
          <Row className='py-3 text-center text-md-left' xs={1} md={2}>
            <Col>
              <h2>Fakturační adresa</h2>
              <Address address={order.address.invoice} />
            </Col>
            <Col>
              <h2>Doručovací adresa</h2>
              {'delivery' in order.address ? (
                <Address address={order.address.delivery} />
              ) : (
                <Address address={order.address.invoice} />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table className='m-0' size='sm' responsive>
                <tbody>
                  {productsID.map(productID => {
                    const { title, image, url, pack, price } = order.products[
                      productID
                    ];

                    const [weight, amount] = pack;

                    return (
                      <tr key={productID}>
                        <td>
                          <Link
                            href='/[...param]'
                            as={`/${url.category}/${url.subcategory}/${url.product}`}
                            passHref
                          >
                            <a>
                              <div className='d-flex align-items-center'>
                                <div>
                                  <img
                                    className='border border-secondary rounded'
                                    width='50'
                                    height='50'
                                    src={image}
                                    alt={name}
                                  />
                                </div>
                                <div className='pl-2'>
                                  <b>{title.full}</b> {weight}g {amount}x
                                </div>
                              </div>
                            </a>
                          </Link>
                        </td>
                        <td className='text-right align-middle'>
                          {price * amount} Kč
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className='text-left'>
                      <b>Doprava</b>
                    </td>
                    <td className='text-right'>
                      {order.delivery === 'post' &&
                        `Česká pošta: ${PRICES.delivery.post} Kč`}

                      {order.delivery === 'personal' && `Osobní vyzvednutí`}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-left'>
                      <b>Platba</b>
                    </td>
                    <td className='text-right'>
                      {order.payment === 'post' &&
                        `Dobírkou: ${PRICES.payment.post} Kč`}

                      {order.payment === 'bank-transfer' && `Převodem na účet: Nezaplaceno`}

                      {order.payment === 'cash' && `Hotově`}

                      {order.payment === 'card' && `Kartou: Zaplaceno`}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className='text-left'>
                      <b>Celkem</b>
                    </td>
                    <td className='text-right'>
                      <b>{order.price} Kč</b>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </AccountLayout>
  );
}
