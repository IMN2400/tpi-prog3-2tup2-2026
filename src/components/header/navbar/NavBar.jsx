import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container fluid className="app-navbar-container">
        <Navbar.Brand as={Link} to="/main" className="app-navbar-brand">
          GRAN FORO TUP
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="app-navbar-toggle"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="app-navbar-links">
            <Nav.Link as={Link} to="/foros" className="app-navbar-link">
              Foros
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/404NotFound"
              className="app-navbar-link app-navbar-link-active"
            >
              Debug
            </Nav.Link>
          </Nav>

          <Nav className="app-navbar-user">
            {token ? (
              <>
                <span className="app-navbar-username">
                  {user?.nombre || "Usuario"}
                </span>

                <Button
                  className="app-navbar-logout"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="app-navbar-link">
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