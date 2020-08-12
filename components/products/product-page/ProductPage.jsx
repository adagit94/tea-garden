import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import ProductCard from './product-card/ProductCard';
import { getProducts } from 'firebase/db';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

import styles from './ProductPage.module.scss';

function Sidebar({ category, subcategory }) {
  return (
    <Nav
      variant='pills'
      as='nav'
      activeKey={subcategory}
      className='flex-lg-column'
    >
      {category === 'pu-erh' && (
        <>
          <Link href='/[...param]' as='/pu-erh/sheng' passHref>
            <Nav.Link eventKey='sheng'>Active</Nav.Link>
          </Link>
          <Link href='/[...param]' as='/pu-erh/shu' passHref>
            <Nav.Link eventKey='shu'>Link</Nav.Link>
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
  const [page, setPage] = useState(1);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const { products } = userState;

  const productsID = Object.getOwnPropertyNames(products);

  useEffect(() => {
    async function initPage() {
      const products = await getProducts(param);

      userDispatch({ type: 'setProducts', payload: products });
    }

    initPage();
  }, [param, userDispatch]);

  return (
    <Row className='py-3'>
      <Col
        xs={12}
        lg={2}
        className={`p-0 pb-3 pb-lg-0 pr-lg-3 ${styles.sidebarCol}`}
      >
        <Sidebar category={param[0]} subcategory={param[1]} />
      </Col>
      <Col xs={12} lg={10} className='px-0'>
        <Row className='m-0' xs={1} sm={2} md={3}>
          {productsID.map(productID => (
            <ProductCard key={productID} id={productID} {...products[productID]} />
          ))}
        </Row>
        {/* pagination */}
      </Col>
    </Row>
  );
}
