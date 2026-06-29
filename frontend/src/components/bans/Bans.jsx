import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Table, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import EditBan from "../bans/BanModification"
import "./Bans.css";

const Bans = () => {
  const { token } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBan, setSelectedBan] = useState(null);

  const [bans, setBans] = useState([]);
  const [banLoadingId, setBanLoadingId] = useState(null);
  const [error, setError] = useState("");


  const cargarBans = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:3000/bans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudieron cargar los baneos");
      }

      setBans(data);
    } catch (error) {
      setError(error.message);
      setBans([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    cargarBans();
  }, [cargarBans]);

  const desban = async (ban) => {
    try {
      setBanLoadingId(ban.id);

      const banDate = new Date(ban.date);

      const expirationDate = new Date(banDate);

      expirationDate.setDate(expirationDate.getDate() + ban.duration);

      const today = new Date();

      const diffTime = expirationDate - today;

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newDuration = ban.duration - diffDays;

      if (newDuration < 0) {
        newDuration = 0;
      }

      const respuesta = await fetch(`http://localhost:3000/bans/${ban.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "desbaneado",
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || "Error al actualizar el ban");
      }

      setBans((prevBans) =>
        prevBans.map((item) =>
          item.id === ban.id
            ? {
              ...item,
              status: "desbaneado",
            }
            : item
        )
      );

      toast.success("Usuario desbaneado correctamente", {
        className: "toast-success-custom",
        progressClassName: "toast-progress-custom",
      });

    } catch (error) {
      toast.error(error.message || "No se pudo desbanear el usuario");
    } finally {
      setBanLoadingId(null);
    }
  };

  const openEditModal = (ban) => {
    setSelectedBan(ban);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBan(null);
  };

  return (

    <main className="bans-page">
      <div className="container mt-4">
        <h1 className="mb-4" style={{ color: "green" }}>
          Lista de baneos
        </h1>
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        <Table striped bordered hover>
          <thead className="table-success">
            <tr>
              <th>Usuario baneado</th>
              <th>Admin</th>
              <th>Motivo</th>
              <th>Fecha de baneo</th>
              <th>Duración</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {bans.map((item) => (
              <tr key={item.id}>
                <td>{item.bannedUser?.name || "Usuario no encontrado"}</td>

                <td>{item.adminUser?.name || "Admin no encontrado"}</td>

                <td>{item.reason}</td>

                <td>{new Date(item.date).toLocaleDateString("es-AR")}</td>

                <td>
                  {item.duration === 1 ? "1 día" : `${item.duration} días`}
                  <br />({item.remainingText})
                </td>

                <td>{item.status}</td>

                <td>
                  {item.status === "activo" ? (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => desban(item)}
                      disabled={banLoadingId === item.id}
                      className="me-2"
                    >
                      {banLoadingId === item.id ? "Desbaneando..." : "Desbanear"}
                    </Button>
                  ) : (
                    <span className="text-muted" className="me-2">Ban inactivo</span>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openEditModal(item)}
                  >
                    Modificar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        show={showEditModal}
        onHide={closeEditModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Modificar ban
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedBan && (
            <EditBan
              ban={selectedBan}
              onClose={closeEditModal}
              onUpdated={cargarBans}
            />
          )}
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Bans;