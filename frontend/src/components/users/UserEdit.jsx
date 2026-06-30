import { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    FormGroup,
    Row
} from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!token) return;
        const loadProfile = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "http://localhost:3000/persons/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setFormData({
                    name: data.name,
                    age: data.age,
                    email: data.email,
                    password: "",
                });

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [token]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }

        if (Number(formData.age) < 1) {
            setError("La edad debe ser mayor a 0.");
            return;
        }

        if (!formData.email.trim()) {
            setError("El email es obligatorio.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const body = {
                name: formData.name,
                age: Number(formData.age),
                email: formData.email,
            };

            if (formData.password.trim() !== "") {
                body.password = formData.password;
                console.log ("la contraseña es", formData.password, "body:", body.password)
            }
            setError("");
            setSuccess("");
            const response = await fetch(
                "http://localhost:3000/persons/me",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSuccess("Perfil actualizado correctamente.");

            setFormData(prev => ({
                ...prev,
                password: "",
            }));

        } catch (error) {
            setError(error.message || "Error conectando con el servidor");

        } finally {
            setLoading(false);
        }
    };


    return (
        <div centered>
            <Card
                className="p-4 shadow bg-success text-light"
            >
                <Card.Body>

                    <h2 className="text-center mb-4">
                        Editar perfil
                    </h2>

                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success">
                            {success}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>

                        <FormGroup className="mb-3">
                            <Form.Label>Nombre</Form.Label>

                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Form.Label>Edad</Form.Label>

                            <Form.Control
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>

                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <Form.Label>Nueva contraseña</Form.Label>

                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Dejar vacío para mantener la actual"
                            />
                        </FormGroup>

                        <Row>
                            <Col md={6}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Guardando..."
                                        : "Guardar cambios"}
                                </Button>
                            </Col>

                            <Col md={6}>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    className="w-100"
                                    onClick={() => navigate("/")}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Row>

                    </Form>

                </Card.Body>
            </Card>
        </div>);
};
export default UserEdit;