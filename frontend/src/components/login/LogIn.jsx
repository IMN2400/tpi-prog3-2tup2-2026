import { useState, useRef  } from "react";
import { Container, Row, Col, Card, Form, Button} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./LogIn.css";
import { useAuth } from "../../context/AuthContext";

const LogIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  //declaro los refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
    }

    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);

    return newErrors;
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

const showLoginError = (message) => {
  if (message === "Usuario no encontrado") {
    setErrorGeneral("");

    setErrors({
      email: "El correo no se encuentra registrado",
      password: "",
    });

    emailRef.current?.focus();
    return;
  }

  if (message === "Contraseña incorrecta") {
    setErrorGeneral("");

    setErrors({
      email: "",
      password: "La contraseña es incorrecta",
    });

    passwordRef.current?.focus();
    return;
  }

  if (message?.toLowerCase().includes("baneado")) {
    setErrorGeneral(message);

    setErrors({
      email: "",
      password: "",
    });

    return;
  }

  if (message) {
    setErrorGeneral(message);

    setErrors({
      email: "",
      password: "",
    });

    return;
  }

  setErrorGeneral("Correo o contraseña incorrectos");

  setErrors({
    email: "Correo o contraseña incorrectos",
    password: "Correo o contraseña incorrectos",
  });

  emailRef.current?.focus();
};

const handleSubmit = async (event) => {
  event.preventDefault();

  setErrorGeneral("");


  const newErrors = validateForm();
  // validaciones para enfocar
  if (newErrors.email) {
    emailRef.current?.focus();
    return;
  }

  if (newErrors.password) {
    passwordRef.current?.focus();
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showLoginError(data.message || "No se pudo iniciar sesión");
      return;
    }

    login(data.user, data.token);

    navigate("/");

  } catch (error) {
    showLoginError("No se pudo conectar con el servidor");
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
                  <Form onSubmit={handleSubmit} noValidate>
                 <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="login-label">
                      Correo electrónico
                    </Form.Label>

                    <Form.Control
                      className="login-input"
                      type="text"
                      name="email"
                      placeholder="Ingrese su correo electrónico"
                      value={form.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      ref={emailRef}
                    />

                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.email !== "Correo o contraseña incorrectos" && errors.email}
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
                      ref={passwordRef}
                    />

                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.password !== "Correo o contraseña incorrectos" && errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                    {errorGeneral && (
                      <p className="text-danger mt-2 mb-0">
                        {errorGeneral}
                      </p>
                    )}
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