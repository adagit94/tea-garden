import Link from 'next/link';
import React, { useContext, useEffect, useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carous from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import { getProduct } from 'firebase/db';
import { saveProduct } from 'helpers/products';
import { useBtnPopover } from 'custom-hooks/product';
import { BtnPopover } from 'components/ui/Popovers';
import { UserStateContext } from 'components/user/UserDataProvider';
import { UserDispatchContext } from 'components/user/UserDataProvider';
import { PageLoading } from 'components/ui/Indicators';

import styles from './Product.module.scss';

function Carousel({ images }) {
  return (
    <Carous
      controls={false}
      keyboard={false}
      touch={false}
      fade={true}
    >
      <Carous.Item>
        <img
          className='d-block w-100 border border-secondary rounded'
          src={images.main}
          alt='Půlený'
        />
      </Carous.Item>
      {images.infusion && (
        <Carous.Item>
          <img
            className='d-block w-100 border border-secondary rounded'
            src={images.infusion}
            alt='Nálev'
          />
        </Carous.Item>
      )}
    </Carous>
  );
}

export default function Product({ param }) {
  const [productData, setProductData] = useState(null);
  const [packsWeight, setPacksWeight] = useState(null);
  const [weightInput, setWeightInput] = useState(null);
  const [amountInput, setAmountInput] = useState(1);

  const userState = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  const btnContainerRef = useRef(null);

  const [btnPopover, setBtnPopover] = useBtnPopover();

  const { products, shoppingCart } = userState;

  useEffect(() => {
    async function initProduct() {
      const productsID = Object.getOwnPropertyNames(products);

      let productData;
      let packsWeight;

      for (const productID of productsID) {
        if (products[productID].metadata.url.product === param[2]) {
          productData = products[productID];

          break;
        }
      }

      if (!productData) productData = await getProduct(param[2]);

      packsWeight = Object.getOwnPropertyNames(productData.packs).map(pack =>
        Number(pack)
      );

      setPacksWeight(packsWeight);
      setWeightInput(packsWeight[0]);
      setProductData(productData);
    }

    initProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  if (!productData) return <PageLoading />;

  return (
    <>
      <Row>
        <Col className='pt-2'>
          <h1 className='text-center text-md-left m-0'>{productData.title.full}</h1>
        </Col>
      </Row>
      <Row>
        <Col className='d-flex justify-content-center justify-content-md-start'>
          <Breadcrumb>
            <Link
              href='/[...param]'
              as={`/${productData.metadata.url.category}`}
              passHref
            >
              <Breadcrumb.Item>{productData.category}</Breadcrumb.Item>
            </Link>
            <Link
              href='/[...param]'
              as={`/${productData.metadata.url.category}/${productData.metadata.url.subcategory}`}
              passHref
            >
              <Breadcrumb.Item>{productData.subcategory}</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>{productData.title.full}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className='pb-lg-3'>
        <Col xs={12} md={6}>
          <Carousel images={productData.metadata.images} />
        </Col>
        <Col className='pt-3 pt-md-0' xs={12} md={6}>
          <div>
            <p>{productData.describtion}</p>
          </div>
          <div className='py-3'>
            <p>
              <b>Sklizeň: </b>
              {productData.harvest.exact}
            </p>
            <p>
              <b>Oblast: </b>
              {productData.location.detail}
            </p>
            {productData.processing && (
              <p>
                <b>Zpracování: </b>
                {productData.processing}
              </p>
            )}
          </div>
          <div>
            {productData.stock >= packsWeight[0] ? (
              <span className='text-success'>Skladem</span>
            ) : (
              <span className='text-danger'>Není skladem</span>
            )}
          </div>
          <Form ref={btnContainerRef} inline>
            <div className='d-flex flex-column'>
              <Form.Group
                className='p-2 d-flex justify-content-between align-items-center'
                controlId='product-weight'
              >
                <Form.Label className='mr-3'>Balení:</Form.Label>

                <Form.Control
                  onChange={e => {
                    setWeightInput(Number(e.target.value));
                  }}
                  className={styles.formInput}
                  disabled={productData.stock < packsWeight[0] ? true : false}
                  value={weightInput}
                  as='select'
                >
                  {packsWeight.map(pack => (
                    <option key={pack} value={pack} disabled={pack * amountInput > productData.stock}>
                      {pack}g
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group
                className='p-2 d-flex justify-content-between align-items-center'
                controlId='product-amount'
                ref={btnContainerRef}
              >
                <Form.Label className='mr-3'>Množství:</Form.Label>

                <Form.Control
                  onChange={e => {
                    const amount = Number(e.target.value);

                    if (
                      amount < 1 ||
                      amount * weightInput > productData.stock
                    ) {
                      return;
                    }

                    setAmountInput(amount);
                  }}
                  className={styles.formInput}
                  disabled={productData.stock < packsWeight[0] ? true : false}
                  value={amountInput}
                  type='number'
                />
              </Form.Group>

              <Form.Group
                className='p-2 d-flex justify-content-between align-items-center'
                controlId='product-price'
              >
                <Form.Label className='mr-3'>Cena:</Form.Label>

                <Form.Control
                  className={`p-0 ${styles.formInput}`}
                  value={`${productData.packs[weightInput] * amountInput} Kč`}
                  plaintext
                  readOnly
                />
              </Form.Group>

              {productData.stock >= packsWeight[0] && (
                <>
                  <BtnPopover
                    bg='success'
                    show={btnPopover.show}
                    target={btnPopover.target}
                    container={btnContainerRef.current}
                    popoverID='product-btn-popover'
                  >
                    Zboží bylo přidáno do košíku.
                  </BtnPopover>

                  <Button
                    onClick={e => {
                      const { id, metadata, title, packs, stock } = productData;

                      saveProduct(id, shoppingCart, userDispatch, {
                        title,
                        stock,
                        url: metadata.url,
                        image: metadata.images.main,
                        pack: [weightInput, amountInput],
                        price: packs[weightInput],
                      });

                      setBtnPopover({
                        show: true,
                        target: e.target,
                      });

                      setTimeout(() => {
                        setBtnPopover({
                          show: false,
                          target: null,
                        });
                      }, 2000);
                    }}
                    className='m-3 align-self-start'
                    variant='primary'
                  >
                    Do košíku
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
