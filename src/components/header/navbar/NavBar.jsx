import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  // traigo del conxtexo el usuario, si esta loggeado, y la funcion para cerrar sesion
  const { user, isAuthenticated, logout, isAdmin } = useAuth();


  //funcion para cerrar sesion con el boton
  const handleLogout = () => {
    // la funcion logout viene del contexto y borra el usuario y el token del localStorage y limpia los estados
    logout();
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

            {isAuthenticated && isAdmin && (
              <Nav.Link as={Link} to="/bans" className="app-navbar-link">
                Baneos
              </Nav.Link>
            )}
          </Nav>

          <Nav className="app-navbar-user">
            {isAuthenticated ? (
              <>
                <span className="app-navbar-username">
                  {user?.nombre || "Usuario"}
                </span>

                <Button className="app-navbar-logout" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="app-navbar-link">
                  Iniciar sesión
                </Nav.Link>

                <Nav.Link as={Link} to="/register" className="app-navbar-link">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;