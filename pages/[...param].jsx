import { useRouter } from 'next/router';
import React from 'react';

import ProductPage from 'components/products/product-page/ProductPage';
import Product from 'components/products/product/Product';

export default function Param() {
  const router = useRouter();

  const { param } = router.query;

  if (!param) return null;

  if (param.length === 3) {
    return <Product param={param} />;
  } else {
    return <ProductPage param={param} />;
  }
}
