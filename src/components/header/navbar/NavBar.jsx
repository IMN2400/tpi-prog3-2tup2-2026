import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {
    return (
        <Navbar bg="success" expand="xxl" class="fixed-top">
            <Container>
                <Navbar.Brand href="#login">GRAN FORO TUP</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/main"> Página Principal </Nav.Link>
                    <Nav.Link href="/forumlist"> Foros </Nav.Link>
                    <Nav.Link href="/404NotFound"> Debug </Nav.Link>
                    <Nav.Link href="/login"> Inicio de Sesión </Nav.Link>
                </Nav>
            </Container>
        </Navbar> 
    )
}

export default NavBar