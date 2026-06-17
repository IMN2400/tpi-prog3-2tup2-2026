import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const brandStyle = {
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: "1.8rem",
    letterSpacing: "1.5px",
  };

  const linkStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: "500",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="success" expand="lg">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/main"
          className="text-white"
          style={brandStyle}
        >
          GRAN FORO TUP
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/foros"
              className="text-white"
              style={linkStyle}
            >
              Foros
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/404NotFound"
              className="text-white bg-info"
              style={linkStyle}
            >
              Debug
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {token ? (
              <>
                <span className="text-white me-3" style={linkStyle}>
                  {user?.nombre}
                </span>

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  style={linkStyle}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="text-white"
                style={linkStyle}
              >
                Inicio de Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;