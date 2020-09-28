import Link from 'next/link';
import React, { useContext, useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { saveProduct } from 'helpers/products';
import { useBtnPopover } from 'custom-hooks/product';
import { BtnPopover } from 'components/ui/Popovers';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from './ProductCard.module.scss';

export default function ProductCard({
  id,
  metadata,
  title,
  packs,
  stock,
  describtion,
}) {
  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const btnContainerRef = useRef(null);

  const [btnPopover, setBtnPopover] = useBtnPopover();

  const { shoppingCart } = userState;

  const packsWeight = Object.getOwnPropertyNames(packs).map(pack =>
    Number(pack)
  );

  return (
    <Col className='p-3'>
      <Card className={styles.productCard}>
        <Link
          href='/[...param]'
          as={`/${metadata.url.category}/${metadata.url.subcategory}/${metadata.url.product}`}
          passHref
        >
          <a className='flex-grow-1'>
            <Card.Img
              onMouseEnter={e => {
                if (metadata.images.infusion) {
                  e.target.src = metadata.images.infusion;
                }
              }}
              onMouseLeave={e => {
                e.target.src = metadata.images.main;
              }}
              className='w-100'
              variant='top'
              src={metadata.images.main}
            />
            <Card.Body className='d-flex flex-column'>
              <Card.Title className='text-center'>{title.full}</Card.Title>
              <Card.Text>{describtion}</Card.Text>
            </Card.Body>
          </a>
        </Link>
        <Card.Body className='flex-grow-0 text-center'>
          <div>
            {stock >= packsWeight[0] ? (
              <span className='text-success'>Skladem</span>
            ) : (
              <span className='text-danger'>Není skladem</span>
            )}
          </div>
          <div className='py-2'>
            {packsWeight.length > 1 && 'Od'} {packs[packsWeight[0]]} Kč za{' '}
            {packsWeight[0]}g
          </div>
          {stock >= packsWeight[0] && (
            <div ref={btnContainerRef}>
              <BtnPopover
                bg='success'
                show={btnPopover.show}
                target={btnPopover.target}
                container={btnContainerRef.current}
                popoverID={`card-btn-popover-${id}`}
              >
                Zboží bylo přidáno do košíku.
              </BtnPopover>
              <Button
                onClick={e => {
                  saveProduct(id, shoppingCart, userDispatch, {
                    title,
                    stock,
                    url: metadata.url,
                    image: metadata.images.main,
                    pack: [packsWeight[0], 1],
                    price: packs[packsWeight[0]],
                  });

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
              {id in shoppingCart && (
                <img
                  className='ml-2'
                  src='/icons/shopping-cart-product-card.svg'
                  alt='košík ikona'
                />
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
