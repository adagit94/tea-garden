import Link from 'next/link';
import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavMenu from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';

import Account from './account/Account';
import Search from 'components/algolia/Search';

import styles from './Nav.module.scss';

export default function Nav() {
  const [showPuErhDropdown, setShowPuErhDropdown] = useState(false);
  const [showOolongDropdown, setShowOolongDropdown] = useState(false);
  const [showRedDropdown, setShowRedDropdown] = useState(false);
  const [showGreenDropdown, setShowGreenDropdown] = useState(false);

  return (
    <Navbar className={styles.nav} expand='lg' collapseOnSelect>
      <Navbar.Brand>
        <Link href='/'>
          <a>HP</a>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-nav' />
      <Navbar.Collapse id='responsive-nav'>
        <div className='order-lg-1 flex-grow-1 d-flex justify-content-between'>
          <Search />
          <Account />
        </div>
        <div className='order-lg-0'>
          <NavMenu>
            <Dropdown
              onMouseEnter={() => {
                setShowPuErhDropdown(true);
              }}
              onMouseLeave={() => {
                setShowPuErhDropdown(false);
              }}
              show={showPuErhDropdown}
              className='mx-auto text-center'
            >
              <Link href='/[...param]' as='/pu-erh' passHref>
                <Dropdown.Toggle as={NavMenu.Link} id='dropdown-puerh'>
                  Pu erh
                </Dropdown.Toggle>
              </Link>
              <Dropdown.Menu>
                <Link href='/[...param]' as='/pu-erh/sheng' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Sheng
                  </Dropdown.Item>
                </Link>
                <Link href='/[...param]' as='/pu-erh/shu' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Shu
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              onMouseEnter={() => {
                setShowOolongDropdown(true);
              }}
              onMouseLeave={() => {
                setShowOolongDropdown(false);
              }}
              show={showOolongDropdown}
              className='mx-auto text-center'
            >
              <Link href='/[...param]' as='/oolong' passHref>
                <Dropdown.Toggle as={NavMenu.Link} id='dropdown-oolong'>
                  Oolong
                </Dropdown.Toggle>
              </Link>
              <Dropdown.Menu>
                <Link href='/[...param]' as='/oolong/an-xi' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    An Xi
                  </Dropdown.Item>
                </Link>
                <Link href='/[...param]' as='/oolong/feng-huang' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Feng Huang
                  </Dropdown.Item>
                </Link>
                <Link href='/[...param]' as='/oolong/wu-yi' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Wu Yi
                  </Dropdown.Item>
                </Link>
                <Link href='/[...param]' as='/oolong/formosa' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Formosa
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              onMouseEnter={() => {
                setShowRedDropdown(true);
              }}
              onMouseLeave={() => {
                setShowRedDropdown(false);
              }}
              show={showRedDropdown}
              className='mx-auto text-center'
            >
              <Link href='/[...param]' as='/cerveny' passHref>
                <Dropdown.Toggle as={NavMenu.Link} id='dropdown-red'>
                  Červený
                </Dropdown.Toggle>
              </Link>
              <Dropdown.Menu>
                <Link href='/[...param]' as='/cerveny/darjeeling' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Darjeeling
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              onMouseEnter={() => {
                setShowGreenDropdown(true);
              }}
              onMouseLeave={() => {
                setShowGreenDropdown(false);
              }}
              show={showGreenDropdown}
              className='mx-auto text-center'
            >
              <Link href='/[...param]' as='/zeleny' passHref>
                <Dropdown.Toggle as={NavMenu.Link} id='dropdown-green'>
                  Zelený
                </Dropdown.Toggle>
              </Link>
              <Dropdown.Menu>
                <Link href='/[...param]' as='/zeleny/cina' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Čína
                  </Dropdown.Item>
                </Link>
                <Link href='/[...param]' as='/zeleny/vietnam' passHref>
                  <Dropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                    Vietnam
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
          </NavMenu>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
