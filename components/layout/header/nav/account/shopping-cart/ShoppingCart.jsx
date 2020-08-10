import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

import { updateProduct, deleteProduct, updateAmount } from 'helpers/products';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from './ShoppingCart.module.scss';

export default function ShoppingCart() {
  const [showCart, setShowCart] = useState(false);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const { shoppingCart } = userState;

  const cartItems = Object.getOwnPropertyNames(shoppingCart);
  let subtotal = 0;

  return (
    <Dropdown
      onToggle={() => {
        setShowCart(!showCart);
      }}
      show={showCart}
      alignRight
    >
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
      <Dropdown.Menu className={styles.dropdownMenu}>
        {cartItems.length > 0 && (
          <Table className='m-0' size='sm' borderless responsive>
            <thead>
              <tr className='border border-top-0 border-primary'>
                <th>Čaj</th>
                <th className='text-center'>Množství</th>
                <th className='text-center'>Cena</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(itemID => {
                const { name, image, pack, price, url } = shoppingCart[itemID];

                const [weight, amount] = pack;
                const amountInputID = `cart-amount-input-${itemID}`;
                const itemPrice = price * amount;

                subtotal += itemPrice;

                return (
                  <tr
                    className='text-nowrap border border-top-0 border-primary'
                    key={itemID}
                  >
                    <td>
                      <Link
                        href={`/${url.category}/${url.subcategory}/${url.product}`}
                        passHref
                      >
                        <a>
                          <img
                            className='border rounded'
                            width='50'
                            height='50'
                            src={image}
                            alt={name}
                          />{' '}
                          <b className='d-none d-lg-inline'>{name}</b> {weight}g
                        </a>
                      </Link>
                    </td>
                    <td className='d-flex'>
                      <InputGroup className='p-2 flex-nowrap'>
                        <InputGroup.Prepend>
                          <Button
                            className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                            onClick={() => {
                              const amount = updateAmount(
                                amountInputID,
                                'subtract'
                              );

                              if (amount < 1) return;

                              updateProduct(
                                'updateAmount',
                                itemID,
                                shoppingCart,
                                userDispatch,
                                {
                                  pack: [weight, amount],
                                }
                              );
                            }}
                            variant='primary'
                          >
                            -
                          </Button>
                        </InputGroup.Prepend>
                        <FormControl
                          className={`border-primary ${styles.amountInput}`}
                          id={amountInputID}
                          onChange={e => {
                            if (e.target.value < 1) return;

                            updateProduct(
                              'updateAmount',
                              itemID,
                              shoppingCart,
                              userDispatch,
                              {
                                pack: [weight, e.target.value],
                              }
                            );
                          }}
                          value={amount}
                          type='number'
                        />
                        <InputGroup.Append>
                          <Button
                            className={`d-flex justify-content-center align-items-center ${styles.amountBtn}`}
                            onClick={() => {
                              const amount = updateAmount(amountInputID, 'add');

                              updateProduct(
                                'updateAmount',
                                itemID,
                                shoppingCart,
                                userDispatch,
                                {
                                  pack: [weight, amount],
                                }
                              );
                            }}
                            variant='primary'
                          >
                            +
                          </Button>
                        </InputGroup.Append>
                      </InputGroup>
                      <InputGroup>
                        <Button
                          onClick={() => {
                            deleteProduct(itemID, shoppingCart, userDispatch);
                          }}
                          className={`mb-1 close ${styles.cancelSymbol}`}
                          variant='outline-secondary'
                          aria-label='Odstranit'
                        >
                          <span aria-hidden='true'>&times;</span>
                        </Button>
                      </InputGroup>
                    </td>
                    <td className='align-middle'>{itemPrice} Kč</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className='border border-top-0 border-primary'>
                <td className='text-right' colSpan='3'>
                  <b>Celkem</b>
                </td>
              </tr>
              <tr className='border border-top-0 border-bottom-0 border-primary'>
                <td className='text-right' colSpan='3'>
                  {subtotal} Kč
                </td>
              </tr>
              <tr className='border border-top-0 border-primary'>
                <td className='text-right' colSpan='3'>
                  <Link href='/objednavka' passHref>
                    <Button
                      onClick={() => {
                        setShowCart(false);
                      }}
                      as='a'
                      variant='primary'
                    >
                      K objednávce
                    </Button>
                  </Link>
                </td>
              </tr>
            </tfoot>
          </Table>
        )}

        {cartItems.length === 0 && (
          <div className='text-center p-3 border border-top-0 border-primary'>
            Košík je prázdný
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
