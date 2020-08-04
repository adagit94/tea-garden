import { useRouter } from 'next/router';
import React from 'react';

import ProductPage from 'components/products/product-page/ProductPage';
import Product from 'components/products/product/Product';

export default function Param() {
  const router = useRouter();

  const { query } = router;

  if (!query.param) return <></>;

  if (query.param.length === 3) {
    return <Product param={query.param} />;
  } else {
    return <ProductPage param={query.param} />;
  }
}
