import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'; 

const NavBar = () => {
    const navStyle = {
        color:'#ffffff',
        fontFamily:'"Unica One","formera", "Century Gothic", fantasy',
    }
    return (
        <Navbar bg="success" expand="lg">
            <Container style={navStyle}>
                <Navbar.Brand href="#login" className="text-white">GRAN FORO TUP</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="navbar-right">
                <Nav> 
                        <Nav.Link href="/main" className="text-white bg-info"> Página Principal </Nav.Link>
                        <Nav.Link href="/forumlist"className="text-white"> Foros </Nav.Link>
                        <Nav.Link href="/404NotFound"className="text-white bg-info"> Debug </Nav.Link>
                        <Nav.Link href="/login"className="text-white"> Inicio de Sesión </Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar> 
    )
}

export default NavBar