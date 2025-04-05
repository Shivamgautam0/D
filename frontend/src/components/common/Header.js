// src/components/common/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">NHAI Testing Report</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/projects">All Projects</Nav.Link>
            <Nav.Link as={Link} to="/projects/testing">Under Testing</Nav.Link>
            <Nav.Link as={Link} to="/projects/completed">Completed</Nav.Link>
            <Nav.Link as={Link} to="/projects/failed">Failed</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;