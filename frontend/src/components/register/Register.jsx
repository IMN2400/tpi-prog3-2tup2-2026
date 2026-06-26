import { useState, useRef  } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../login/LogIn.css";

const Register = () => {
  const navigate = useNavigate();

  const nickRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [form, setForm] = useState({
    nick: "",
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nick: "",
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });


  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {

    const newErrors = {
      nick: "",
      name: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nick.trim()) {
      newErrors.nick = "El nick es obligatorio";
    } else if (form.nick.trim().length < 3) {
      newErrors.nick = "El nick debe tener al menos 3 caracteres";
    }

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
    }

    if (!form.age.trim()) {
      newErrors.age = "La edad es obligatoria";
    } else if (Number(form.age) < 13) {
      newErrors.age = "La edad mínima es 13 años";
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

    return newErrors;
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

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    const newErrors = validateForm();

    // validaciones para enfocar cada campo
    if (newErrors.nick) {
      nickRef.current?.focus();
      return;
    }

    if (newErrors.name) {
      nameRef.current?.focus();
      return;
    }

    if (newErrors.email) {
      emailRef.current?.focus();
      return;
    }

    if (newErrors.age) {
      ageRef.current?.focus();
      return;
    }

    if (newErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    if (newErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
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
          nick: form.nick,
          name: form.name,
          email: form.email,
          age: Number(form.age),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {

        setErrors({
          ...errors,
          email: data.message || "No se pudo registrar el usuario",
        });

        emailRef.current?.focus();
        return;
      }

      setSuccess("Usuario registrado correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setErrors({
        ...errors,
        email: "Error de conexión con el servidor",
      });

      emailRef.current?.focus();
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
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="nick">
                    <Form.Label className="login-label">Nick</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="text"
                      name="nick"
                      value={form.nick}
                      onChange={handleChange}
                      placeholder="Ej: Juan123"
                      autoComplete="username"
                      isInvalid={!!errors.nick}
                      ref={nickRef}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.nick}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label className="login-label">Nombre</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ingresá tu nombre"
                      autoComplete="name"
                      isInvalid={!!errors.name}
                      ref={nameRef}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="login-label">
                      Correo electrónico
                    </Form.Label>
                    <Form.Control
                      className="login-input"
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ejemplo@mail.com"
                      autoComplete="email"
                      isInvalid={!!errors.email}
                      ref={emailRef}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label className="login-label">Edad</Form.Label>
                    <Form.Control
                      className="login-input"
                      type="number"
                      name="age"
                      min="13"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="13+"
                      isInvalid={!!errors.age}
                      ref={ageRef}
                    />
                    <Form.Control.Feedback type="invalid" className="login-error">
                      {errors.age}
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
                      placeholder="Contraseña (mínimo 6 caracteres)"
                      autoComplete="new-password"
                      isInvalid={!!errors.password}
                      ref={passwordRef}
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
                      ref={confirmPasswordRef}
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

                  {success && (
                    <p className="text-success text-center mt-3 mb-0">
                      {success}
                    </p>
                  )}
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