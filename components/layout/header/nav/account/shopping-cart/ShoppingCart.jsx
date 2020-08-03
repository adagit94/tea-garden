import React, { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from './ShoppingCart.module.scss';

export default function ShoppingCart({ cart }) {
  const userDispatch = useContext(UserDispatchContext);

  const cartItems = Object.getOwnPropertyNames(cart);

  return (
    <Dropdown alignRight>
      <Dropdown.Toggle
        className='p-2'
        id='dropdown-shopping-cart'
        variant='outline-secondary'
      >
        <img
          className='p-1'
          src='/icons/shopping-cart.svg'
          alt='nákupní košík'
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {cartItems.length > 0 ? (
          <Table className='m-0' size='sm' borderless>
            <thead>
              <tr>
                <th>Čaj</th>
                <th className='text-center'>Množství</th>
                <th className='text-center'>Cena</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(itemID => {
                const { name, image, pack, price } = cart[itemID];

                const [weight, amount] = pack;

                const amountInputID = `cart-amount-input-${itemID}`;

                return (
                  <tr className='text-nowrap' key={itemID}>
                    <td>
                      <img width='50' height='50' src={image} alt={name} />{' '}
                      <b>{name}</b> {weight}g
                    </td>
                    <td className='align-middle'>
                      <InputGroup className='p-2 flex-nowrap'>
                        <InputGroup.Prepend>
                          <Button
                            className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                            onClick={() => {
                              userDispatch({
                                type: 'updateCartItem',
                                id: itemID,
                                payload: {
                                  pack: [
                                    weight,
                                    Number(
                                      document.querySelector(
                                        `#${amountInputID}`
                                      ).value
                                    ) + 1,
                                  ],
                                },
                              });
                            }}
                            variant='outline-primary'
                          >
                            +
                          </Button>
                        </InputGroup.Prepend>
                        <FormControl
                          className={`border-primary ${styles.amountInput}`}
                          id={amountInputID}
                          onChange={() => {
                            userDispatch({
                              type: 'updateCartItem',
                              id: itemID,
                              payload: {
                                pack: [
                                  weight,
                                  Number(
                                    document.querySelector(`#${amountInputID}`)
                                      .value
                                  ),
                                ],
                              },
                            });
                          }}
                          value={amount}
                          type='number'
                          min='1'
                        />
                        <InputGroup.Append>
                          <Button
                            className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                            onClick={() => {
                              userDispatch({
                                type: 'updateCartItem',
                                id: itemID,
                                payload: {
                                  pack: [
                                    weight,
                                    Number(
                                      document.querySelector(
                                        `#${amountInputID}`
                                      ).value
                                    ) - 1,
                                  ],
                                },
                              });
                            }}
                            variant='outline-primary'
                          >
                            -
                          </Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </td>
                    <td className='align-middle'>{price * amount} Kč</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Dropdown.Item>Košík je prázdný</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
