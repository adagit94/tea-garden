import Link from 'next/link';
import React, { useContext, useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { saveProduct, updateProduct } from 'helpers/products';
import { useBtnPopover } from 'custom-hooks/product';
import { ProductBtnPopover } from 'components/ui/Popovers';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

export default function ProductCard({
  id,
  url,
  name,
  packs,
  describtion,
  images,
}) {
  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const btnContainerRef = useRef(null);

  const [btnPopover, setBtnPopover] = useBtnPopover();

  const { shoppingCart } = userState;
  const packsWeight = Object.getOwnPropertyNames(packs);

  return (
    <Col className='py-3'>
      <Card>
        <Link
          href='/[...param]'
          as={`/${url.category}/${url.subcategory}/${url.product}`}
          passHref
        >
          <a className='flex-grow-1'>
            <Card.Img variant='top' src={images.main} />
            <Card.Body className='d-flex flex-column'>
              <Card.Title className='text-center'>{name}</Card.Title>
              <Card.Text>{describtion}</Card.Text>
            </Card.Body>
          </a>
        </Link>
        <Card.Body className='flex-grow-0'>
          <div className='w-100 d-flex flex-column flex-lg-row justify-content-lg-around align-items-center'>
            <div>
              {packsWeight.length > 1 && 'Od'} {packs[packsWeight[0]]} Kč za{' '}
              {packsWeight[0]}g
            </div>
            <div className='py-2 py-lg-0' ref={btnContainerRef}>
              <ProductBtnPopover
                show={btnPopover.show}
                target={btnPopover.target}
                container={btnContainerRef.current}
                popoverID={`card-btn-popover-${id}`}
              />
              <Button
                onClick={e => {
                  if (id in shoppingCart) {
                    const [weight, amount] = shoppingCart[id].pack;

                    updateProduct(
                      'updateAmount',
                      id,
                      shoppingCart,
                      userDispatch,
                      {
                        pack: [weight, amount + 1],
                      }
                    );
                  } else {
                    saveProduct(id, shoppingCart, userDispatch, {
                      name,
                      url,
                      image: images.main,
                      pack: [packsWeight[0], 1],
                      price: packs[packsWeight[0]],
                    });
                  }

                  setBtnPopover({
                    show: true,
                    target: e.target,
                  });

                  setTimeout(() => {
                    setBtnPopover({
                      show: false,
                      target: null,
                    });
                  }, 2000);
                }}
                variant='primary'
              >
                Do košíku
              </Button>
            </div>
            <div>
              {id in shoppingCart && (
                <img
                  src='/icons/shopping-cart-product-card.svg'
                  alt='košík ikona'
                />
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
