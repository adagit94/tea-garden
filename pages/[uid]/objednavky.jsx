import Link from 'next/link';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import AccountLayout from 'components/user/account/AccountLayout';
import { UserStateContext } from 'components/user/UserDataProvider';

export default function Orders() {
  const userState = useContext(UserStateContext);

  const { firebase, orders } = userState;

  const ordersID = orders && Object.getOwnPropertyNames(orders);

  return (
    <AccountLayout activeItem='orders'>
      {orders && (
        <Row>
          <Col className='p-3'>
            {ordersID.length > 0 && (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Objednávka</th>
                    <th className='text-center'>Datum</th>
                    <th className='text-center'>Stav</th>
                    <th className='text-center'>Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersID.map(oid => (
                    <tr key={oid}>
                      <td>
                        <Link
                          href='/[uid]/objednavky/[oid]'
                          as={`/${firebase.uid}/objednavky/${oid}`}
                        >
                          <a>
                            <b>{oid}</b>
                          </a>
                        </Link>
                      </td>
                      <td className='text-center'>{orders[oid].date}</td>
                      <td className='text-center'>{orders[oid].status}</td>
                      <td className='text-center'>
                        {orders[oid].price} Kč
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {ordersID.length === 0 && (
              <div className='text-center'>
                Nebyly vytvořeny žádné objednávky.
              </div>
            )}
          </Col>
        </Row>
      )}
    </AccountLayout>
  );
}
