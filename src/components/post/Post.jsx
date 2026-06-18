import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import "./Post.css";

const API_URL = "http://localhost:3000";

const Post = ({ postId }) => {
  const { token, user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [expandedThreads, setExpandedThreads] = useState({});
  const [likedByMe, setLikedByMe] = useState(false);

  const canBanUser = (targetUser) => {
    const isAdmin = user?.rol === "ADMIN" || user?.rol === "SYSADMIN";

    if (!isAdmin) return false;
    if (!targetUser?.id) return false;

    // Evita que un admin se banee a sí mismo
    if (Number(targetUser.id) === Number(user?.id)) return false;

    // Un ADMIN común no debería poder banear a un SYSADMIN
    if (user?.rol === "ADMIN" && targetUser?.rol === "SYSADMIN") return false;

    return true;
  };

  const goToBanForm = (targetUser) => {
    const userId = targetUser.id;
    const userName = targetUser.nombre || targetUser.nick || "Usuario";

    navigate(`/newban?userId=${userId}&userName=${encodeURIComponent(userName)}`);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const postResponse = await fetch(`${API_URL}/posts/${postId}`);

      if (!postResponse.ok) {
        throw new Error("No se pudo cargar la publicación");
      }

      const postData = await postResponse.json();

      setPost(postData);
      setLikedByMe(postData.likedByMe || postData.userLiked || false);

      const commentsResponse = await fetch(
        `${API_URL}/posts/${postId}/comments`
      );

      if (!commentsResponse.ok) {
        throw new Error("No se pudieron cargar los comentarios");
      }

      const commentsData = await commentsResponse.json();

      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [postId]);

  const formatDate = (date) => {
    if (!date) return "Hace un rato";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "Hace un rato";
    }

    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const buildCommentTree = (list) => {
    const map = new Map();

    list.forEach((comment) => {
      map.set(comment.id, {
        ...comment,
        children: [],
      });
    });

    const roots = [];

    list.forEach((comment) => {
      const parentId =
        comment.parentCommentId ||
        comment.parentId ||
        comment.commentParentId ||
        null;

      if (parentId && map.has(parentId)) {
        map.get(parentId).children.push(map.get(comment.id));
      } else {
        roots.push(map.get(comment.id));
      }
    });

    return roots;
  };

  const sortCommentsRecursive = (nodes) => {
    const sorted = [...nodes].sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.postDate || b.createdAt || 0) -
          new Date(a.postDate || a.createdAt || 0)
        );
      }

      return (b.likeCount || 0) - (a.likeCount || 0);
    });

    return sorted.map((node) => ({
      ...node,
      children: sortCommentsRecursive(node.children || []),
    }));
  };

  const filterTree = (nodes, term) => {
    if (!term.trim()) {
      return nodes;
    }

    const searchLower = term.toLowerCase();

    return nodes
      .map((node) => {
        const ownMatch =
          node.text?.toLowerCase().includes(searchLower) ||
          node.Person?.nombre?.toLowerCase().includes(searchLower);

        const children = filterTree(node.children || [], term);

        if (ownMatch || children.length > 0) {
          return {
            ...node,
            children,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const commentTree = useMemo(() => {
    const tree = buildCommentTree(comments);
    const sorted = sortCommentsRecursive(tree);

    return filterTree(sorted, search);
  }, [comments, search, sortBy]);

  const handleLikePost = () => {
    requireAuth(async () => {
      const previousLiked = likedByMe;
      const previousLikeCount = post.likeCount || 0;

      const nextLiked = !previousLiked;
      const nextLikeCount = nextLiked
        ? previousLikeCount + 1
        : Math.max(previousLikeCount - 1, 0);

      setLikedByMe(nextLiked);

      setPost((prevPost) => ({
        ...prevPost,
        likeCount: nextLikeCount,
      }));

      try {
        setError("");

        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "No se pudo actualizar el like de la publicación"
          );
        }

        setPost((prevPost) => ({
          ...prevPost,
          likeCount: data.likeCount ?? nextLikeCount,
        }));

        setLikedByMe(data.likedByMe ?? data.userLiked ?? nextLiked);
      } catch (err) {
        setLikedByMe(previousLiked);

        setPost((prevPost) => ({
          ...prevPost,
          likeCount: previousLikeCount,
        }));

        setError(err.message);
      }
    });
  };

  const handleCreateComment = (event) => {
    event.preventDefault();

    requireAuth(async () => {
      if (!commentText.trim()) {
        setCommentError("El comentario no puede estar vacío");
        return;
      }

      try {
        setCommentLoading(true);
        setCommentError("");

        const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "No se pudo crear el comentario");
        }

        setCommentText("");
        loadData();
      } catch (err) {
        setCommentError(err.message);
      } finally {
        setCommentLoading(false);
      }
    });
  };

  const toggleThread = (commentId) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderCommentNode = (comment, level = 0) => {
    const author = comment.Person?.nombre || "Usuario";
    const children = comment.children || [];
    const isExpanded = !!expandedThreads[comment.id];

    const visibleChildren = isExpanded ? children : children.slice(0, 1);
    const hiddenCount = children.length - visibleChildren.length;

    return (
      <div
        key={comment.id}
        className={`thread-comment level-${Math.min(level, 4)}`}
      >
        <div className="thread-comment-line" />

        <div className="thread-comment-main">
          <div className="thread-comment-avatar">{getInitial(author)}</div>

          <div className="thread-comment-body">
            <div className="thread-comment-meta">
              <span className="thread-comment-author">{author}</span>

              {canBanUser(comment.Person) && (
                <button
                  type="button"
                  className="ban-user-link"
                  onClick={() => goToBanForm(comment.Person)}
                >
                  Banear
                </button>
              )}

              <span className="thread-comment-dot">•</span>

              <span className="thread-comment-date">
                {formatDate(comment.postDate || comment.createdAt)}
              </span>
            </div>

            <p className="thread-comment-text">{comment.text}</p>

            <div className="thread-comment-actions">
              <button type="button">↑ {comment.likeCount || 0}</button>
              <button type="button">Responder</button>
            </div>

            {visibleChildren.length > 0 && (
              <div className="thread-children">
                {visibleChildren.map((child) =>
                  renderCommentNode(child, level + 1)
                )}
              </div>
            )}

            {children.length > 1 && (
              <button
                type="button"
                className="thread-more-btn"
                onClick={() => toggleThread(comment.id)}
              >
                {isExpanded
                  ? "Ver menos comentarios"
                  : `Ver más comentarios${
                      hiddenCount > 0 ? ` (${hiddenCount})` : ""
                    }`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Spinner animation="border" />
          <p>Cargando publicación...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Alert variant="warning" className="mb-0">
            Publicación no encontrada.
          </Alert>
        </div>
      </main>
    );
  }

  const authorName = post.Person?.nombre || "Usuario";
  const forumName = post.Forum?.nombre || "Foro";
  const forumId = post.Forum?.id || post.forumId;

  return (
    <main className="post-thread-page">
      <section className="post-thread-container">
        <div className="post-thread-breadcrumb">
          <Link to="/foros">Foros</Link>
          <span>›</span>

          {forumId ? (
            <Link to={`/forum/${forumId}`}>{forumName}</Link>
          ) : (
            <span>{forumName}</span>
          )}

          <span>›</span>
          <span>{post.title}</span>
        </div>

        <article className="post-main-block">
          <div className="post-main-meta">
            <div className="post-main-avatar">{getInitial(authorName)}</div>

            <div className="post-main-author-row">
              <span className="post-main-author">{authorName}</span>

              {canBanUser(post.Person) && (
                <button
                  type="button"
                  className="ban-user-link"
                  onClick={() => goToBanForm(post.Person)}
                >
                  Banear
                </button>
              )}

              <span className="post-main-dot">•</span>

              <span className="post-main-date">
                {formatDate(post.postDate || post.createdAt)}
              </span>
            </div>
          </div>

          <h1 className="post-main-title">{post.title}</h1>

          <p className="post-main-description">{post.body}</p>

          <div className="post-main-actions">
            <button
              type="button"
              onClick={handleLikePost}
              className={`post-like-button ${
                likedByMe ? "post-like-active" : ""
              }`}
              aria-label={likedByMe ? "Quitar me gusta" : "Dar me gusta"}
            >
              <svg
                className="post-like-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              <span>{post.likeCount || 0}</span>
            </button>

            <span className="post-comments-count">
              {comments.length} comentarios
            </span>
          </div>
        </article>

        <section className="post-comment-entry">
          <Form onSubmit={handleCreateComment} noValidate>
            <div className="post-comment-input-row">
              <div className="post-comment-user-avatar">
                {getInitial(user?.nombre || user?.nick || "U")}
              </div>

              <Form.Control
                type="text"
                className="post-comment-input"
                placeholder="Unite a la conversación"
                value={commentText}
                onChange={(event) => {
                  setCommentText(event.target.value);
                  setCommentError("");
                }}
                isInvalid={!!commentError}
              />
            </div>

            <Form.Control.Feedback
              type="invalid"
              className="post-comment-error d-block"
            >
              {commentError}
            </Form.Control.Feedback>

            <Button
              type="submit"
              className="post-comment-submit"
              disabled={commentLoading}
            >
              {commentLoading ? "Comentando..." : "Comentar"}
            </Button>
          </Form>
        </section>

        <section className="post-comments-toolbar">
          <div className="post-comments-sort">
            <span>Ordenar por:</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="post-comments-select"
            >
              <option value="best">Mejores</option>
              <option value="recent">Más recientes</option>
            </select>
          </div>

          <div className="post-comments-search">
            <input
              type="text"
              placeholder="Buscar comentarios"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="post-comments-thread">
          {commentTree.length === 0 ? (
            <div className="post-comments-empty">
              <h3>No hay comentarios todavía</h3>
              <p>Sé el primero en unirte a la conversación.</p>
            </div>
          ) : (
            commentTree.map((comment) => renderCommentNode(comment))
          )}
        </section>
      </section>
    </main>
  );
};

export default Post;