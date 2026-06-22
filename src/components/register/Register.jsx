import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import "../login/LogIn.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    edad: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    edad: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      nombre: "",
      correo: "",
      edad: "",
      password: "",
      confirmPassword: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!form.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(form.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    }

    if (!form.edad.trim()) {
      newErrors.edad = "La edad es obligatoria";
    } else if (Number(form.edad) < 13) {
      newErrors.edad = "La edad mínima es 13 años";
    }

    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return (
      !newErrors.nombre &&
      !newErrors.correo &&
      !newErrors.edad &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          edad: Number(form.edad),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      setSuccess("Usuario registrado correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page login-page-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="login-card-body">
                <div className="login-header">
                  <div className="login-badge">Foro TUP</div>

                  <h2 className="login-title">Crear cuenta</h2>

                  <p className="login-subtitle">
                    Unite al Gran Foro TUP y empezá a participar
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="login-alert">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="login-alert">
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label className="login-label">Nombre</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingresá tu nombre"
                      autoComplete="name"
                      isInvalid={!!errors.nombre}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="correo">
                    <Form.Label className="login-label">
                      Correo electrónico
                    </Form.Label>
                    <Form.Control
                      className="login-input"
                      type="text"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="ejemplo@mail.com"
                      autoComplete="email"
                      isInvalid={!!errors.correo}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.correo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="edad">
                    <Form.Label className="login-label">Edad</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="number"
                      name="edad"
                      min="13"
                      value={form.edad}
                      onChange={handleChange}
                      placeholder="13+"
                      isInvalid={!!errors.edad}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.edad}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="login-label">Contraseña</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Creá una contraseña"
                      autoComplete="new-password"
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="login-label">
                      Confirmar contraseña
                    </Form.Label>
                    <Form.Control
                      className="login-input"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repetí tu contraseña"
                      autoComplete="new-password"
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? "Registrando..." : "Crear cuenta"}
                  </Button>
                </Form>

                <div className="login-footer">
                  <span>¿Ya tenés cuenta?</span>{" "}
                  <Link to="/login">Iniciar sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Register;