import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ForumDisplay.css";

const ForumDisplay = ({ forum }) => {
  const navigate = useNavigate();

  const { id, nombre, descripcion } = forum;

  const goToForum = () => {
    navigate(`/forum/${id}`);
  };

  return (
    <Card className="single-forum-card">
      <Card.Body className="single-forum-card-body">
        <div className="single-forum-card-content">
          <Card.Title className="single-forum-card-title">
            {nombre}
          </Card.Title>

          <Card.Text className="single-forum-card-description">
            {descripcion || "Este foro no tiene descripción cargada."}
          </Card.Text>
        </div>

        <Button
          variant="outline-success"
          className="single-forum-card-action"
          onClick={goToForum}
        >
          Ver foro
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ForumDisplay;