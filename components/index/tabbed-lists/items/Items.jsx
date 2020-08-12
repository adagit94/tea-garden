import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';

import { getProducts } from 'firebase/db';
import { UserStateContext } from 'components/user/UserDataProvider';

import styles from './Items.module.scss';

export default function Items({ list }) {
  const [products, setProducts] = useState({});

  const userState = useContext(UserStateContext);

  const { firebaseReady } = userState;

  const productsID = Object.getOwnPropertyNames(products);

  useEffect(() => {
    async function getNew() {
      const products = await getProducts(list);

      setProducts(products);
    }

    if (firebaseReady && !productsID.length) getNew();
  });

  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5}>
      {productsID.map(productID => {
        const { title, metadata } = products[productID];
        const { url, images } = metadata;

        return (
          <Col
            key={productID}
            className={`p-3 d-flex justify-content-center ${styles.item}`}
          >
            <Link
              href='/[...param]'
              as={`/${url.category}/${url.subcategory}/${url.product}`}
            >
              <a className='stretched-link'>
                <Figure className='m-0'>
                  <div className='overflow-hidden rounded-circle mx-auto'>
                    <Figure.Image src={images.detail} alt={title.short} />
                  </div>
                  <Figure>{title.short}</Figure>
                </Figure>
              </a>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
}
