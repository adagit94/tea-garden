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
console.log(orders);
  return (
    <AccountLayout activeItem='orders'>
      <Row>
        <Col className='pr-0'>
          {orders && ordersID.length > 0 && (
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
                {ordersID.map(id => (
                  <tr key={id}>
                    <td>
                      <Link
                        href='/[uid]/objednavky/[id]'
                        as={`/${firebase.uid}/objednavky/${id}`}
                      >
                        <a>
                          <b>{id}</b>
                        </a>
                      </Link>
                    </td>
                    <td className='text-center'>{orders[id].date}</td>
                    <td className='text-center'>{orders[id].status}</td>
                    <td className='text-center'>{orders[id].price.total} Kč</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {orders && ordersID.length === 0 && (
            <div className='text-center'>
              Nebyly vytvořeny žádné objednávky.
            </div>
          )}
        </Col>
      </Row>
    </AccountLayout>
  );
}
