import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Bans.css";

const Bans = () => {
  const { token } = useAuth();

  const [bans, setBans] = useState([]);
  const [banLoadingId, setBanLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!token) {
    return;
  }

  const cargarBans = async () => {
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
  };

  cargarBans();
}, [token]);


  const desban = async (ban) => {
    try {
      setBanLoadingId(ban.id);

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
                    >
                    {banLoadingId === item.id ? "Desbaneando..." : "Desbanear"}
                    </Button>
                ) : (
                    <span className="text-muted">Sin acción</span>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </main>
  );
};

export default Bans;