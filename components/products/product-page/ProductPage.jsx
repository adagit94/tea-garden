import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardDeck from 'react-bootstrap/CardDeck';

import { getProducts } from 'firebase/db';
import { PageLoading } from 'components/ui/Indicators';
import { ProductCard } from './ProductCard';

export default function ProductPage({ children }) {
  const [products, setProducts] = useState({});
  const router = useRouter();

  useEffect(() => {
    const nextPage = Object.getOwnPropertyNames(products).length + 1;
    const productList = getProducts(router.query).then(
      nextProducts => nextProducts
    );

    setProducts(current => ({
      ...current,
      [nextPage]: productList,
    }));
  });

  if (products.length === 0) return <PageLoading />;

  return (
    <Row>
      <Col className=''>
        <CardDeck>
          {products.map(product => {
            return <ProductCard key={product.name} productData={product} />;
          })}
        </CardDeck>
        {/* pagination */}
      </Col>
    </Row>
  );
}
//{children}
