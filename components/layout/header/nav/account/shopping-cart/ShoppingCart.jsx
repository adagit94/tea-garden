import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

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
    >
      <Dropdown.Toggle
        className='p-2 border-0 position-relative'
        id='dropdown-shopping-cart'
        variant='outline-header'
      >
        <img
          className='p-1'
          src='/icons/shopping-cart.svg'
          alt='nákupní košík'
        />

        {cartItems.length > 0 && (
          <div className={styles.itemCounter}>
            <Badge variant='secondary' pill>{cartItems.length}</Badge>
            <span className='sr-only'>produktů v nákupním košíku</span>
          </div>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className='p-3 position-absolute' alignRight>
        {cartItems.length > 0 && (
          <Table className='m-0 text-white' size='sm' responsive>
            <tbody>
              {cartItems.map(itemID => {
                const { title, image, url, pack, price, stock } = shoppingCart[
                  itemID
                ];

                const [weight, amount] = pack;
                const amountInputID = `cart-amount-input-${itemID}`;
                const itemPrice = price * amount;

                subtotal += itemPrice;

                return (
                  <tr className='text-nowrap' key={itemID}>
                    <td className='border-secondary'>
                      <Link
                        href='/[...param]'
                        as={`/${url.category}/${url.subcategory}/${url.product}`}
                        passHref
                      >
                        <a className='text-white'>
                          <img
                            className='border border-header rounded'
                            width='50'
                            height='50'
                            src={image}
                            alt={name}
                          />{' '}
                          <b className='d-none d-lg-inline'>{title.full}</b>{' '}
                          {weight}g
                        </a>
                      </Link>
                    </td>
                    <td className='d-flex border-secondary'>
                      <InputGroup className='p-2 flex-nowrap'>
                        <InputGroup.Prepend>
                          <Button
                            className={`d-flex justify-content-center align-items-center font-weight-bold border-right-0 ${styles.amountBtn}`}
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
                            variant='outline-secondary'
                          >
                            -
                          </Button>
                        </InputGroup.Prepend>
                        <FormControl
                          className={`border border-secondary bg-header text-white ${styles.amountInput}`}
                          id={amountInputID}
                          onChange={e => {
                            const amount = Number(e.target.value);

                            if (amount < 1 || stock < weight * amount) {
                              return;
                            }

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
                          value={amount}
                          type='number'
                        />
                        <InputGroup.Append>
                          <Button
                            className={`d-flex justify-content-center align-items-center font-weight-bold border-left-0 ${styles.amountBtn}`}
                            onClick={() => {
                              const amount = updateAmount(amountInputID, 'add');

                              if (stock < weight * amount) {
                                return;
                              }

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
                            variant='outline-secondary'
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
                          variant='outline-header'
                          aria-label='Odstranit'
                        >
                          <span aria-hidden='true'>&times;</span>
                        </Button>
                      </InputGroup>
                    </td>
                    <td className='align-middle border-secondary'>{itemPrice} Kč</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className='border-secondary' colSpan='2'>
                  <b>Celkem</b>
                </td>
                <td className='border-secondary'>{subtotal} Kč</td>
              </tr>
              <tr>
                <td className='text-center text-lg-right border-0' colSpan='3'>
                  <Link href='/objednavka/doruceni' passHref>
                    <Button
                      onClick={() => {
                        setShowCart(false);
                      }}
                      as='a'
                      variant='outline-secondary'
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
          <div className='text-nowrap text-center'>Košík je prázdný</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
