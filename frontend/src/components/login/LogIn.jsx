import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import "./LogIn.css";
import { useAuth } from "../../context/AuthContext";

const LogIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    correo: "",
    password: "",
  });

  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      correo: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(form.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    }

    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);

    return !newErrors.correo && !newErrors.password;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setErrorGeneral("");
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  setErrorGeneral("");

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorGeneral(data.message || "Error al iniciar sesión");
      return;
    }

    login(data.user, data.token);

    navigate("/");
  } catch (error) {
    setErrorGeneral("Error al conectar con el servidor");
  } finally {
    setLoading(false);
  }
};

return (
  <main className="login-page">
    <Container>
      <Row className="login-row align-items-center justify-content-center">
        <Col xs={12} md={10} lg={9} xl={8}>
          <Card className="login-card">
            <Row className="g-0">
              <Col md={5} className="login-info-panel">
                <div className="login-info-content">
                  <div className="login-info-badge">Foro TUP</div>

                  <h1>Bienvenido de nuevo</h1>

                  <p>
                    Ingresá a tu cuenta para participar en foros, crear publicaciones
                    y continuar conectado con la comunidad.
                  </p>

                  <div className="login-info-features">
                    <div>
                      <span>✓</span>
                      Participá en discusiones
                    </div>
                    <div>
                      <span>✓</span>
                      Creá y respondé posts
                    </div>
                    <div>
                      <span>✓</span>
                      Gestioná tu perfil
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={7}>
                <Card.Body className="login-card-body">
                  <div className="login-header">
                    <div className="login-badge">Acceso</div>

                    <h2 className="login-title">Iniciar sesión</h2>

                    <p className="login-subtitle">
                      Ingresá tus datos para acceder al sistema
                    </p>
                  </div>

                  {errorGeneral && (
                    <Alert variant="danger" className="login-alert">
                      {errorGeneral}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} noValidate>
                 <Form.Group className="mb-3" controlId="correo">
                    <Form.Label className="login-label">
                      Correo electrónico
                    </Form.Label>

                    <Form.Control
                      className="login-input"
                      type="text"
                      name="correo"
                      placeholder="Ingrese su correo electrónico"
                      value={form.correo}
                      onChange={handleChange}
                      isInvalid={!!errors.correo}
                    />

                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.correo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="login-label">
                      Contraseña
                    </Form.Label>

                    <Form.Control
                      className="login-input"
                      type="password"
                      name="password"
                      placeholder="Ingrese su contraseña"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />

                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                    <Button
                      type="submit"
                      className="login-button"
                      disabled={loading}
                    >
                      {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                  </Form>

                  <div className="login-footer">
                    <span>¿No tenés cuenta?</span>{" "}
                    <Link to="/register">Registrate</Link>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);
};
export default LogIn;