import Link from 'next/link';
import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

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

  const { shoppingCart } = userState;

  const packsWeight = Object.getOwnPropertyNames(packs);

  return (
    <Col className='py-3'>
      <Card>
        <Link
          href={`/${url.category}/${url.subcategory}/${url.product}`}
          passHref
        >
          <a>
            <Card.Img variant='top' src={images.main} />
            <Card.Body className='d-flex flex-column'>
              <Card.Title className='text-center'>{name}</Card.Title>
              <Card.Text className='flex-grow-1'>{describtion}</Card.Text>
            </Card.Body>
          </a>
        </Link>
        <Card.Body className='d-flex justify-content-center align-items-end'>
          <div className='w-100 d-flex flex-column flex-lg-row justify-content-lg-around align-items-center'>
            <div>
              {packsWeight.length > 1 && 'Od'} {packs[packsWeight[0]]} Kč za{' '}
              {packsWeight[0]}g
            </div>
            <div>
              <Button
                onClick={() => {
                  const cartItem = {
                    name,
                    image: images.main,
                    category: url.category,
                    pack: [packsWeight[0], 1],
                    price: packs[packsWeight[0]],
                  };

                  window.localStorage.setItem(
                    'shoppingCart',
                    JSON.stringify({ ...shoppingCart, [id]: cartItem })
                  );

                  userDispatch({ type: 'updateCart', id, payload: cartItem });
                }}
                variant='primary'
              >
                Do košíku
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
