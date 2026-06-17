import { Accordion, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForumDisplay = ({ forum }) => {
  const navigate = useNavigate();

  const { id, nombre, descripcion, reglas, fundadorId, Person } = forum;

  const goToForum = () => {
    navigate(`/forum/${id}`);
  };

  const fundador = Person?.nombre || `Usuario ${fundadorId}`;

  return (
    <Card className="forum-display-card">
      <Card.Body>
        <Card.Title className="forum-display-title">{nombre}</Card.Title>

        <Card.Subtitle className="mb-3 text-muted">
          {descripcion}
        </Card.Subtitle>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Reglas</Accordion.Header>
            <Accordion.Body>
              {reglas || "Este foro no tiene reglas cargadas."}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Fundador</Accordion.Header>
            <Accordion.Body>
              Foro fundado por {fundador}.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Button variant="success" className="mt-3" onClick={goToForum}>
          Ir al foro
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ForumDisplay;