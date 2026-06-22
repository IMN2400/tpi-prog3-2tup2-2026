import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NewBan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();

  const selectedUserId = searchParams.get("userId") || "";
  const selectedUserName = searchParams.get("userName") || "Usuario seleccionado";

  const [formData, setFormData] = useState({
    userId: selectedUserId,
    reason: "",
    duration: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: selectedUserId,
    }));
  }, [selectedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      setError("No se seleccionó ningún usuario para banear.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("El motivo del baneo es obligatorio.");
      return;
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      setError("La duración debe ser mayor a 0 días.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("http://localhost:3000/bans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(formData.userId),
          reason: formData.reason.trim(),
          duration: Number(formData.duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear el ban");
      }

      setSuccess("Ban creado correctamente.");

      setFormData({
        userId: selectedUserId,
        reason: "",
        duration: "",
      });
    } catch (error) {
      setError(error.message || "Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card className="p-4 shadow bg-success text-light" style={{ width: "700px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Nuevo Ban</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Form.Label>Usuario a banear</Form.Label>

              <Form.Control
                type="text"
                value={
                  selectedUserId
                    ? `${selectedUserName} (ID: ${selectedUserId})`
                    : "No se seleccionó ningún usuario"
                }
                disabled
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Label>Administrador</Form.Label>

              <Form.Control
                type="text"
                value={
                  user?.id
                    ? `${user?.nombre || "Admin"} (ID: ${user.id})`
                    : "Administrador logueado"
                }
                disabled
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Label>Motivo</Form.Label>

              <Form.Control
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Ej: comportamiento ofensivo"
              />
            </FormGroup>

            <FormGroup className="mb-4">
              <Form.Label>Duración</Form.Label>

              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                placeholder="Cantidad de días"
              />
            </FormGroup>

            <Row>
              <Col md={6}>
                <Button
                  variant="danger"
                  type="submit"
                  className="w-100"
                  disabled={loading || !selectedUserId}
                >
                  {loading ? "Baneando..." : "Banear"}
                </Button>
              </Col>

              <Col md={6}>
                <Button
                  variant="secondary"
                  type="button"
                  className="w-100"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewBan;