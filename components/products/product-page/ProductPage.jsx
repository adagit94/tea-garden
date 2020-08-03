import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import ProductCard from './product-card/ProductCard';
import { getProducts } from 'firebase/db';

export default function ProductPage({ param }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function initPage() {
      const next = await getProducts(param);

      setProducts(current => [...current, next]);
    }

    if (param && page > products.length) initPage();
  });

  return (
    <>
      <Row xs={1} sm={2} md={3}>
        {products.length > 0 &&
          products[page - 1].map(product => {
            return <ProductCard key={product.name} {...product} />;
          })}
      </Row>
      {/* pagination */}
    </>
  );
}
