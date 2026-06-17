import { useEffect, useState } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Post = ({ postId }) => {
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const getPostAndComments = async () => {
    try {
      setLoading(true);

      const postResponse = await fetch(`http://localhost:3000/posts/${postId}`);

      if (!postResponse.ok) {
        throw new Error("No se pudo cargar el post");
      }

      const postData = await postResponse.json();
      setPost(postData);

      const commentsResponse = await fetch(
        `http://localhost:3000/posts/${postId}/comments`
      );

      if (!commentsResponse.ok) {
        throw new Error("No se pudieron cargar los comentarios");
      }

      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostAndComments();
  }, [postId]);

  const handleCreateComment = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    if (commentText.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No se pudo crear el comentario");
      }

      setCommentText("");
      getPostAndComments();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!post) {
    return <Alert variant="warning">Post no encontrado</Alert>;
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>

        <Card.Text>{post.body}</Card.Text>

        <small className="text-muted">
          Creado por {post.Person?.nombre || "Usuario desconocido"} ·{" "}
          {post.postDate
            ? new Date(post.postDate).toLocaleDateString()
            : "Fecha no disponible"}
        </small>

        <hr />

        <p>
          {comments.length} 💌 {post.likeCount || 0} ♥️
        </p>

        <h6>Comentarios</h6>

        {comments.length === 0 ? (
          <p className="text-muted">Todavía no hay comentarios.</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="mb-2">
              <Card.Body>
                <p className="mb-1">{comment.text}</p>

                <small className="text-muted">
                  Por {comment.Person?.nombre || "Usuario desconocido"}
                </small>
              </Card.Body>
            </Card>
          ))
        )}

        <hr />

        {token ? (
          <Form onSubmit={handleCreateComment}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Escribí un comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Comentar
            </Button>
          </Form>
        ) : (
          <Alert variant="info">
            Para comentar necesitás{" "}
            <Link to="/login">iniciar sesión</Link>.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default Post;