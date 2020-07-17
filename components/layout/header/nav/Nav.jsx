import Link from 'next/link'
import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Account from './account/Account';

export default function Header() {
  return (
    <Row>
      <Col>
        <header>
          <Navbar bg='light' expand='lg'>
            <Navbar.Brand><Link href='/'><a>HP</a></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-nav' />
            <Navbar.Collapse className='flex-grow-1' id='responsive-nav'>
              <Nav>
                <NavDropdown title='Pu erh' id='dropdown-puerh'>
                  <Link href='/pu-erh/sheng' passHref><NavDropdown.Item>Sheng</NavDropdown.Item></Link>
                  <Link href='/pu-erh/shu' passHref><NavDropdown.Item>Shu</NavDropdown.Item></Link>
                </NavDropdown>
                <NavDropdown title='Oolong' id='dropdown-oolong'>
                  <Link href='/oolong/an-xi' passHref><NavDropdown.Item>An Xi</NavDropdown.Item></Link>
                  <Link href='/oolong/feng-huang' passHref><NavDropdown.Item>Feng Huang</NavDropdown.Item></Link>
                  <Link href='/oolong/wu-yi' passHref><NavDropdown.Item>Wu Yi</NavDropdown.Item></Link>
                  <Link href='/oolong/taiwan' passHref><NavDropdown.Item>Taiwan</NavDropdown.Item></Link>
                </NavDropdown>
              </Nav>
              <Form inline>
                <Form.Control type="text" placeholder="Hledat" />
              </Form>
            </Navbar.Collapse>
            <Account />
          </Navbar>
        </header>
      </Col>
    </Row>
  );
}
