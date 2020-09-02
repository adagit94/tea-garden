import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';

import { getProducts } from 'firebase/db';
import { AppStateContext } from 'pages/_app';

import styles from './Items.module.scss';

export default function Items({ list }) {
  const [products, setProducts] = useState({});

  const firebaseReady = useContext(AppStateContext);

  const productsID = Object.getOwnPropertyNames(products);

  useEffect(() => {
    async function getItems() {
      const products = await getProducts(list);

      setProducts(products);
    }

    if (firebaseReady && !productsID.length) getItems();
  });

  return (
    <Row xs={2} sm={3} lg={6}>
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
                  <Figure.Caption className='text-center'>{title.short}</Figure.Caption>
                </Figure>
              </a>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
}
