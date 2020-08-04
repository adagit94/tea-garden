import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carous from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getProduct } from 'firebase/db';
import { saveProduct } from 'helpers/products';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';

function Carousel({ images }) {
  return (
    <Carous controls={false} keyboard={false} pause={false} touch={false}>
      <Carous.Item>
        <img className='d-block w-100' src={images.main} alt='Půlený' />
      </Carous.Item>
      <Carous.Item>
        <img className='d-block w-100' src={images.infusion} alt='Nálev' />
      </Carous.Item>
    </Carous>
  );
}

export default function Product({ param }) {
  const [productData, setProductData] = useState(null);
  const [packs, setPacks] = useState(null);
  const [weightInput, setWeightInput] = useState(null);
  const [amountInput, setAmountInput] = useState(1);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const { products, shoppingCart } = userState;

  useEffect(() => {
    async function initProduct() {
      const productData =
        products.length > 0
          ? products.find(product => product.url.product === param[2])
          : await getProduct(param);

      const packs = Object.getOwnPropertyNames(productData.packs);

      setPacks(packs);
      setWeightInput(packs[0]);
      setProductData(productData);
    }

    if (productData === null && packs === null) initProduct();
  });

  if (productData === null) return <></>;

  return (
    <Row>
      <Col xs={12} md={12}>
        <h1>{productData.name}</h1>
      </Col>
      <Col xs={12} md={6}>
        <Carousel images={productData.images} />
      </Col>
      <Col xs={12} md={6}>
        <div>{productData.describtion}</div>
        <div>
          <Form
            onSubmit={() => {
              const { id, name, packs, images, url } = productData;

              saveProduct(id, shoppingCart, userDispatch, {
                name,
                url,
                image: images.main,
                pack: [weightInput, amountInput],
                price: packs[weightInput] * amountInput,
              });
            }}
            inline
          >
            <Form.Group controlId='product-weight'>
              <Form.Label>Balení: </Form.Label>
              <Form.Control
                onChange={e => {
                  setWeightInput(e.target.value);
                }}
                as='select'
                custom
              >
                {packs.map(pack => (
                  <option key={pack} value={pack}>
                    {pack}g
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='product-amount'>
              <Form.Label srOnly>Množství</Form.Label>
              <Form.Control
                onChange={e => {
                  if (e.target.value < 1) return;

                  setAmountInput(e.target.value);
                }}
                value={amountInput}
                type='number'
              />
            </Form.Group>
            <Button variant='primary' type='submit' />
          </Form>
        </div>
      </Col>
      <Col xs={12} md={12}>
        <p>
          <b>Sklizeň: </b>
          {productData.harvest}
        </p>
        <p>
          <b>Oblast: </b>
          {productData.location.detail}
        </p>
        <p>
          <b>Zpracování: </b>
          {productData.processing}
        </p>
      </Col>
    </Row>
  );
}
