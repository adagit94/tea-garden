import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import ProductCard from './product-card/ProductCard';
import { getProducts } from 'firebase/db';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';
import { PageLoading } from 'components/ui/Indicators';

import styles from './ProductPage.module.scss';

function sortProducts(ordering, products, productIDs) {
  switch (ordering) {
    case 'sold':
      return [...productIDs].sort((a, b) => {
        const orderedAmountA = products[a].stats.orderedAmount;
        const orderedAmountB = products[b].stats.orderedAmount;

        if (orderedAmountA > orderedAmountB) return -1;
        if (orderedAmountA < orderedAmountB) return 1;

        return 0;
      });

    case 'date':
      return [...productIDs].sort((a, b) => {
        const createdA = products[a].metadata.created;
        const createdB = products[b].metadata.created;

        if (createdA > createdB) return -1;
        if (createdA < createdB) return 1;

        return 0;
      });

    case 'priceAsc':
      return [...productIDs].sort((a, b) => {
        const packA = Object.getOwnPropertyNames(products[a].packs)[0];
        const packB = Object.getOwnPropertyNames(products[b].packs)[0];

        const priceA = products[a].packs[packA];
        const priceB = products[b].packs[packB];

        if (priceA < priceB) return -1;
        if (priceA > priceB) return 1;

        return 0;
      });

    case 'priceDesc':
      return [...productIDs].sort((a, b) => {
        const packA = Object.getOwnPropertyNames(products[a].packs)[0];
        const packB = Object.getOwnPropertyNames(products[b].packs)[0];

        const priceA = products[a].packs[packA];
        const priceB = products[b].packs[packB];

        if (priceA > priceB) return -1;
        if (priceA < priceB) return 1;

        return 0;
      });
  }
}

function Sidebar({ category, subcategory }) {
  return (
    <Nav
      variant='tabs'
      as='nav'
      activeKey={subcategory}
      className='flex-lg-column'
    >
      {category === 'pu-erh' && (
        <>
          <Link href='/[...param]' as='/pu-erh/sheng' passHref>
            <Nav.Link eventKey='sheng'>Sheng</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/pu-erh/shu' passHref>
            <Nav.Link eventKey='shu'>Shu</Nav.Link>
          </Link>
        </>
      )}

      {category === 'oolong' && (
        <>
          <Link href='/[...param]' as='/oolong/an-xi' passHref>
            <Nav.Link eventKey='an-xi'>An Xi</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/oolong/feng-huang' passHref>
            <Nav.Link eventKey='feng-huang'>Feng Huang</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/oolong/wu-yi' passHref>
            <Nav.Link eventKey='wu-yi'>Wu Yi</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/oolong/formosa' passHref>
            <Nav.Link eventKey='formosa'>Formosa</Nav.Link>
          </Link>
        </>
      )}

      {category === 'cerveny' && (
        <>
          <Link href='/[...param]' as='/cerveny/darjeeling' passHref>
            <Nav.Link eventKey='darjeeling'>Darjeeling</Nav.Link>
          </Link>
        </>
      )}

      {category === 'zeleny' && (
        <>
          <Link href='/[...param]' as='/zeleny/cina' passHref>
            <Nav.Link eventKey='cina'>Čína</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/zeleny/vietnam' passHref>
            <Nav.Link eventKey='vietnam'>Vietnam</Nav.Link>
          </Link>
        </>
      )}
    </Nav>
  );
}

export default function ProductPage({ param }) {
  //const [page, setPage] = useState(1);
  const [productIDs, setProductIDs] = useState(null);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const [category, subcategory] = param;
  const { products } = userState;

  const includeSidebar = category !== 'cerstve' && category !== 'archivni';

  useEffect(() => {
    async function initPage() {
      const products = await getProducts(category);
      const sortedProducts = sortProducts('sold', products, Object.getOwnPropertyNames(products));

      userDispatch({ type: 'setProducts', payload: products });
      setProductIDs(sortedProducts);
    }

    setProductIDs(null);
    initPage();
  }, [category, userDispatch]);

  if (!productIDs) return <PageLoading />;

  return (
    <Row className={includeSidebar && 'px-3 px-lg-0 py-lg-3'}>
      {includeSidebar && (
        <Col xs={12} lg={2} className={`d-flex justify-content-center justify-content-lg-start p-3 ${styles.sidebarCol}`}>
          <Sidebar category={category} subcategory={subcategory} />
        </Col>
      )}
      <Col xs={12} lg={includeSidebar ? 10 : 12} className='px-0'>
        <Row>
          <Col className='pt-3 px-3'>
            <Form.Group
              className={`m-0 ${styles.orderBySelection}`}
              controlId='sorting-select'
            >
              <Form.Label srOnly>Řazení</Form.Label>
              <Form.Control
                onChange={e => {
                  setProductIDs(
                    sortProducts(e.target.value, products, productIDs)
                  );
                }}
                as='select'
                custom
              >
                <option value='sold'>Od nejprodávanějšího</option>
                <option value='date'>Od nejnovějšího</option>
                <option value='priceAsc'>Od nejlevnějšího</option>
                <option value='priceDesc'>Od nejdražšího</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className='m-0' xs={1} sm={2} md={3}>
          {productIDs.map(productID => {
            const product = products[productID];

            if (
              subcategory &&
              subcategory !== product.metadata.url.subcategory
            ) {
              return null;
            }

            return <ProductCard key={productID} {...product} />;
          })}
        </Row>
        {/* pagination */}
      </Col>
    </Row>
  );
}
