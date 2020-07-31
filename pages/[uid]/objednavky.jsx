import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import AccountLayout from 'components/user/account/AccountLayout';
import { UserStateContext } from 'components/user/UserDataProvider';

export default function Orders() {
  const userState = useContext(UserStateContext);

  const { orders } = userState;

  const ordersID = orders && Object.getOwnPropertyNames(orders);

  return (
    <AccountLayout activeItem='orders'>
      <Row>
        <Col className='pr-0'>
          {ordersID?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Objednávka</th>
                  <th>Datum</th>
                  <th>Stav</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                {ordersID.map(id => {
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{orders[id].date}</td>
                      <td>{orders[id].status}</td>
                      <td>{orders[id].price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            'Nebyly vytvořeny žádné objednávky.'
          )}
        </Col>
      </Row>
    </AccountLayout>
  );
}
