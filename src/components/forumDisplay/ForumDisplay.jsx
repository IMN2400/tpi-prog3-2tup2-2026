import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./forumDisplay.css";

//Recibe por prop un foro mapeado por forum(padre) y lo renderiza visualmente
const ForumDisplay = ({ forum }) => {
  const navigate = useNavigate();

  const { id, nombre, descripcion } = forum;

  const posts = Array.isArray(forum.Posts) ? forum.Posts : [];
  const totalPosts = posts.length;
  const postsLabel = totalPosts === 1 ? "post" : "posts";

  // al tocar el boton "ir al foro" arma una url con el id del foro clickeado y usa navigate para ir a esa ruta.
  const handleGoToForum = () => {
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

          <div className="single-forum-card-stats">
            <span>
              {totalPosts} {postsLabel}
            </span>
          </div>
        </div>

          <Button
            variant="outline-success"
            className="single-forum-card-action"
            onClick={handleGoToForum}
          >
            Ir al foro
          </Button>
      </Card.Body>
    </Card>
  );
};

export default ForumDisplay;