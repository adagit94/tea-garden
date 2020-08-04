import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import ProductCard from './product-card/ProductCard';
import { getProducts } from 'firebase/db';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

export default function ProductPage({ param }) {
  const [page, setPage] = useState(1);
  
  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const { products } = userState;

  useEffect(() => {
    async function initPage() {
      const products = await getProducts(param);

      userDispatch({ type: 'setProducts', payload: products });
    }

    initPage();
  }, [param, userDispatch]);

  return (
    <>
      <Row xs={1} sm={2} md={3}>
        {products.length > 0 &&
          products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
      </Row>
      {/* pagination */}
    </>
  );
}
