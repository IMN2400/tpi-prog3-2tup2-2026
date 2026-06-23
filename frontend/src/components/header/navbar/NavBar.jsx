import { Alert, Navbar, Container, Nav, Button, Dropdown, DropdownButton, Modal, ModalFooter } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./NavBar.css";
import { useState } from "react";


const NavBar = () => {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3000";


  // estados para el modal, para el loading y de error
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
  const [deleteAccountError, setDeleteAccountError] = useState("")
  

  // traigo del conxtexo el usuario, si esta loggeado, y la funcion para cerrar sesion
  const { user, isAuthenticated, logout, isAdmin, token } = useAuth();


  //funcion para cerrar sesion con el boton
  const handleLogout = () => {
    // la funcion logout viene del contexto y borra el usuario y el token del localStorage y limpia los estados
    logout();
    navigate("/login");
  };


  // función que abre el modal para eliminar la cuenta
  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  //función que lo cierra
  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  // función que elimina la cuenta
  const handleDeleteAccount = async() => {
    setDeleteAccountLoading(true)
    setDeleteAccountError("")
    const idUserToRemove = user.id
    try {
      console.log(idUserToRemove)
      const response = await fetch(`${API_URL}/persons/${idUserToRemove}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo eliminar el usuario");
      }
      else {
      closeDeleteModal();
      logout();
      navigate("/register")}
    } catch (err) {
      setDeleteAccountError(err)
    } finally {
      setDeleteAccountLoading(false);
    }
  }

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
                <DropdownButton className="app-navbar-username" title={user?.nombre || "Usuario"}>
                  <Dropdown.Item onClick={handleLogout}> Cerrar sesión </Dropdown.Item>
                  <Dropdown.Item variant="danger" onClick={openDeleteModal}>Eliminar cuenta</Dropdown.Item>
                </DropdownButton>
              <Modal show={deleteModal}>
                <Modal.Header><Modal.Title>¿Eliminar cuenta?</Modal.Title></Modal.Header>
                {deleteAccountError && <Alert variant="danger">{deleteAccountError.message || deleteAccountError}</Alert>}
                <Modal.Body>
                  <img 
                    style={{display:'block', marginLeft:'auto', marginRight:'auto'}} 
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp7683467.jpg&f=1&nofb=1&ipt=944c6bd243f846daed0b91dfc007ca0c5130b28f7de5184c0b65edc68989aece" width="250px" alt="Por favor, ¡reconsidere!"></img>
                  <br/><p>Si acepta, su cuenta será eliminada y ya <b>no</b> podrá entrar al foro con ella. ¿Está seguro que eso es lo que quiere?</p>
                  </Modal.Body>
                  <ModalFooter>
                    <Button variant="secondary" onClick={closeDeleteModal} disabled={deleteAccountLoading}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteAccount} disabled={deleteAccountLoading}>Eliminar mi cuenta</Button>
                  </ModalFooter>
              </Modal>
                
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