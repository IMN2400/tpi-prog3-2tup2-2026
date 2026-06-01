import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const navStyle = {
    color: '#ffffff',
    fontFamily: '"Unica One","formera", "Century Gothic", fantasy',
  };

  return (
    <Navbar bg="success" expand="lg">
      <Container style={navStyle}>
        <Navbar.Brand as={Link} to="/login" className="text-white">
          GRAN FORO TUP
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="navbar-right">
          <Nav>
            <Nav.Link as={Link} to="/main" className="text-white bg-info">
              Página Principal
            </Nav.Link>

            <Nav.Link as={Link} to="/forumlist" className="text-white">
              Foros
            </Nav.Link>

            <Nav.Link as={Link} to="/404NotFound" className="text-white bg-info">
              Debug
            </Nav.Link>

            <Nav.Link as={Link} to="/login" className="text-white">
              Inicio de Sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;