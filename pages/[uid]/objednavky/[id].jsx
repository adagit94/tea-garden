import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import AccountLayout from 'components/user/account/AccountLayout';
import { UserStateContext } from 'components/user/UserDataProvider';

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

  const { query } = router;
  const { orders } = userState;

  const order = orders?.[query.id];
  const productsID = order && Object.getOwnPropertyNames(order.products);

  if (!order) return null;

  return (
    <AccountLayout activeItem='orders'>
      <Row>
        <Col>Objednávka: <b>{query.id}</b></Col>
      </Row>
      <Row>
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
                        href={`/${url.category}/${url.subcategory}/${url.product}`}
                        passHref
                      >
                        <a>
                          <div className='d-flex align-items-center'>
                            <div>
                              <img
                                className='border rounded'
                                width='50'
                                height='50'
                                src={image}
                                alt={name}
                              />
                            </div>
                            <div className='pl-2'>
                              <b>{title.full}</b>{' '}
                              {weight}g {amount}x
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
                    `Česká pošta: ${order.price.delivery} Kč`}

                  {order.delivery === 'personal' && `Osobní vyzvednutí`}
                </td>
              </tr>
              <tr>
                <td className='text-left'>
                  <b>Platba</b>
                </td>
                <td className='text-right'>
                  {order.payment === 'post' &&
                    `Dobírkou: ${order.price.payment} Kč`}

                  {order.payment === 'bank-transfer' && `Převodem na účet`}

                  {order.payment === 'cash' && `Hotově`}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className='text-left'>
                  <b>Celkem</b>
                </td>
                <td className='text-right'>
                  <b>{order.price.total} Kč</b>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Col>
      </Row>
    </AccountLayout>
  );
}
