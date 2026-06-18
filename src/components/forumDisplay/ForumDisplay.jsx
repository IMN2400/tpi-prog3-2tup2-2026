import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./forumDisplay.css";

const ForumDisplay = ({ forum }) => {
  const navigate = useNavigate();

  const { id, nombre, descripcion } = forum;

  const posts = Array.isArray(forum.Posts) ? forum.Posts : [];
  const totalPosts = posts.length;
  const postsLabel = totalPosts === 1 ? "post" : "posts";

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

          <div className="single-forum-card-stats">
            <span>
              {totalPosts} {postsLabel}
            </span>
          </div>
        </div>

          <Button
            variant="outline-success"
            className="single-forum-card-action"
            onClick={goToForum}
          >
            Ir al foro
          </Button>
      </Card.Body>
    </Card>
  );
};

export default ForumDisplay;