import Link from 'next/link';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';

import Account from './account/Account';

export default function Header() {
  return (
    <Navbar
      className='border-bottom border-primary'
      bg='secondary'
      expand='lg'
      collapseOnSelect
    >
      <Navbar.Brand>
        <Link href='/'>
          <a>HP</a>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-nav' />
      <Navbar.Collapse id='responsive-nav'>
        <div className='order-lg-1 flex-grow-1 d-flex justify-content-between'>
          <Form inline>
            <Form.Group controlId='nav-search-field'>
              <Form.Label srOnly>Vyhledávač</Form.Label>
              <Form.Control type='search' placeholder='Hledat' />
            </Form.Group>
          </Form>
          <Account />
        </div>
        <div className='order-lg-0'>
          <Nav>
            <NavDropdown
              title='Pu erh'
              className='mx-auto text-center'
              id='dropdown-puerh'
            >
              <Link href='/[...param]' as='/pu-erh/sheng' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  Sheng
                </NavDropdown.Item>
              </Link>
              <Link href='/[...param]' as='/pu-erh/shu' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  Shu
                </NavDropdown.Item>
              </Link>
            </NavDropdown>
            <NavDropdown
              title='Oolong'
              className='mx-auto text-center'
              id='dropdown-oolong'
            >
              <Link href='/[...param]' as='/oolong/an-xi' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  An Xi
                </NavDropdown.Item>
              </Link>
              <Link href='/[...param]' as='/oolong/feng-huang' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  Feng Huang
                </NavDropdown.Item>
              </Link>
              <Link href='/[...param]' as='/oolong/wu-yi' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  Wu Yi
                </NavDropdown.Item>
              </Link>
              <Link href='/[...param]' as='/oolong/formosa' passHref>
                <NavDropdown.Item className='d-flex justify-content-center justify-content-lg-start'>
                  Formosa
                </NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
