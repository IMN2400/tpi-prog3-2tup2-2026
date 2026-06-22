import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import "./Post.css";
import { formatBodyText } from "../../services/imgUtils/imgUtils";

const API_URL = "http://localhost:3000";

const Post = ({ postId }) => {
  const { token, user, isAdmin, isSysAdmin } = useAuth();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [editingPost, setEditingPost] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostBody, setEditPostBody] = useState("");
  const [editPostLoading, setEditPostLoading] = useState(false);
  const [editPostError, setEditPostError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteCommentError, setDeleteCommentError] = useState("");

  const [deletePostModal, setDeletePostModal] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [deletePostError, setDeletePostError] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentLoading, setEditCommentLoading] = useState(false);
  const [editCommentError, setEditCommentError] = useState("");

  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  const [expandedThreads, setExpandedThreads] = useState({});
  const [likedByMe, setLikedByMe] = useState(false);

  const canBanUser = (targetUser) => {
    if (!isAdmin) {
      return false;
    }

    if (!targetUser?.id) {
      return false;
    }

    if (Number(targetUser.id) === Number(user?.id)) {
      return false;
    }

    if (!isSysAdmin && targetUser?.rol === "SYSADMIN") {
      return false;
    }

    return true;
  };

  const canMakeAdmin = (targetUser) => {
    if (!isSysAdmin) {
      return false;
    }

    if (!targetUser?.id) {
      return false;
    }

    if (Number(targetUser.id) === Number(user?.id)) {
      return false;
    }

    if (targetUser.rol && targetUser.rol !== "USER") {
      return false;
    }

    return true;
  };

  const canDeleteComments = () => {
    return isAdmin || isSysAdmin;
  };

  const canDeletePost = () => {
    if (isSysAdmin) {
      return true;
    }

    if (isAdmin && post?.Person?.rol !== "SYSADMIN") {
      return true;
    }

    return false;
  };

  const canEditPost = () => {
    const postAuthorId = post?.userId || post?.Person?.id;

    return Number(postAuthorId) === Number(user?.id);
  };

  const canEditComment = (comment) => {
    const commentAuthorId = comment?.userId || comment?.Person?.id;

    return Number(commentAuthorId) === Number(user?.id);
  };

  const getNestedCommentCount = (comment) => {
    if (!comment?.children?.length) {
      return 0;
    }

    return comment.children.reduce((total, child) => {
      return total + 1 + getNestedCommentCount(child);
    }, 0);
  };

  const goToBanForm = (targetUser) => {
    const userId = targetUser.id;
    const userName = targetUser.nombre || "Usuario";

    navigate(`/newban?userId=${userId}&userName=${encodeURIComponent(userName)}`);
  };

  const handleMakeAdmin = (targetUser) => {
    requireAuth(async () => {
      const confirmed = window.confirm(
        `¿Querés convertir a ${
          targetUser.nombre || "este usuario"
        } en ADMIN?`
      );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        const response = await fetch(
          `${API_URL}/persons/${targetUser.id}/make-admin`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "No se pudo convertir el usuario en ADMIN"
          );
        }

        alert(data.message || "Usuario convertido en ADMIN correctamente");

        loadData();
      } catch (err) {
        setError(err.message);
      }
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const postResponse = await fetch(`${API_URL}/posts/${postId}`);
      const postData = await postResponse.json();

      if (!postResponse.ok) {
        throw new Error(postData.message || "No se pudo cargar el post");
      }

      setPost(postData);

      const commentsResponse = await fetch(`${API_URL}/posts/${postId}/comments`);
      const commentsData = await commentsResponse.json();

      if (!commentsResponse.ok) {
        throw new Error(
          commentsData.message || "No se pudieron cargar los comentarios"
        );
      }

      setComments(commentsData);

      if (token) {
        const myLikeResponse = await fetch(`${API_URL}/posts/${postId}/my-like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const myLikeData = await myLikeResponse.json();

        if (myLikeResponse.ok) {
          setLikedByMe(myLikeData.likedByMe);
        }
      } else {
        setLikedByMe(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [postId, token]);

  const formatDate = (date) => {
    if (!date) {
      return "Hace un rato";
    }

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

  const getRoleLabel = (role) => {
    if (role === "SYSADMIN") {
      return "SYSADMIN";
    }

    if (role === "ADMIN") {
      return "ADMIN";
    }

    return "USER";
  };

  const getRoleClass = (role) => {
    if (role === "SYSADMIN") {
      return "role-sysadmin";
    }

    if (role === "ADMIN") {
      return "role-admin";
    }

    return "role-user";
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

  const commentTree = buildCommentTree(comments);

  const handleStartEditPost = () => {
    requireAuth(() => {
      if (!canEditPost()) {
        setError("No tenés permisos para editar este post");
        return;
      }

      setEditingPost(true);
      setEditPostTitle(post.title);
      setEditPostBody(post.body);
      setEditPostError("");

      setEditingCommentId(null);
      setEditCommentText("");
      setEditCommentError("");
      setReplyingToId(null);
      setReplyText("");
      setReplyError("");
    });
  };

  const handleCancelEditPost = () => {
    setEditingPost(false);
    setEditPostTitle("");
    setEditPostBody("");
    setEditPostError("");
  };

  const handleUpdatePost = (event) => {
    event.preventDefault();

    requireAuth(async () => {
      if (!editPostTitle.trim()) {
        setEditPostError("El título no puede estar vacío");
        return;
      }

      if (!editPostBody.trim()) {
        setEditPostError("El contenido no puede estar vacío");
        return;
      }

      try {
        setEditPostLoading(true);
        setEditPostError("");

        const response = await fetch(`${API_URL}/posts/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editPostTitle.trim(),
            body: editPostBody.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "No se pudo editar el post"
          );
        }

        setEditingPost(false);
        setEditPostTitle("");
        setEditPostBody("");
        loadData();
      } catch (err) {
        setEditPostError(err.message);
      } finally {
        setEditPostLoading(false);
      }
    });
  };

  const handleOpenDeletePostModal = () => {
    requireAuth(() => {
      if (!canDeletePost()) {
        setError("No tenés permisos para borrar este post");
        return;
      }

      setDeletePostModal(true);
      setDeletePostError("");

      setEditingPost(false);
      setEditPostTitle("");
      setEditPostBody("");
      setEditPostError("");
      setEditingCommentId(null);
      setEditCommentText("");
      setEditCommentError("");
      setReplyingToId(null);
      setReplyText("");
      setReplyError("");
    });
  };

  const handleCloseDeletePostModal = () => {
    if (deletePostLoading) {
      return;
    }

    setDeletePostModal(false);
    setDeletePostError("");
  };

  const handleDeletePost = async () => {
    try {
      setDeletePostLoading(true);
      setDeletePostError("");

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo borrar el post");
      }

      setDeletePostModal(false);

      if (forumId) {
        navigate(`/forum/${forumId}`);
      } else {
        navigate("/foros");
      }
    } catch (err) {
      setDeletePostError(err.message);
    } finally {
      setDeletePostLoading(false);
    }
  };

  const handleLikePost = () => {
    requireAuth(async () => {
      if (likeLoading) {
        return;
      }

      try {
        setLikeLoading(true);
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

        setLikedByMe(data.likedByMe);

        setPost((prevPost) => ({
          ...prevPost,
          likeCount: data.likeCount,
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLikeLoading(false);
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

  const handleCreateReply = (event, parentCommentId) => {
    event.preventDefault();

    requireAuth(async () => {
      if (!replyText.trim()) {
        setReplyError("La respuesta no puede estar vacía");
        return;
      }

      try {
        setReplyLoading(true);
        setReplyError("");

        const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: replyText.trim(),
            parentCommentId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "No se pudo crear la respuesta");
        }

        setReplyText("");
        setReplyingToId(null);

        setExpandedThreads((prev) => ({
          ...prev,
          [parentCommentId]: true,
        }));

        loadData();
      } catch (err) {
        setReplyError(err.message);
      } finally {
        setReplyLoading(false);
      }
    });
  };

  const handleStartReply = (commentId) => {
    requireAuth(() => {
      setReplyingToId(commentId);
      setReplyText("");
      setReplyError("");

      setEditingCommentId(null);
      setEditCommentText("");
      setEditCommentError("");

      setEditingPost(false);
      setEditPostTitle("");
      setEditPostBody("");
      setEditPostError("");
    });
  };

  const handleOpenDeleteCommentModal = (comment) => {
    requireAuth(() => {
      if (!canDeleteComments()) {
        setError("No tenés permisos para borrar comentarios");
        return;
      }

      setCommentToDelete(comment);
      setDeleteCommentError("");
    });
  };

  const handleCloseDeleteCommentModal = () => {
    if (deleteCommentLoading) {
      return;
    }

    setCommentToDelete(null);
    setDeleteCommentError("");
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) {
      return;
    }

    try {
      setDeleteCommentLoading(true);
      setDeleteCommentError("");

      const response = await fetch(`${API_URL}/comments/${commentToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo borrar el comentario");
      }

      setCommentToDelete(null);
      setReplyingToId(null);
      setReplyText("");
      setEditingCommentId(null);
      setEditCommentText("");
      setEditCommentError("");
      loadData();
    } catch (err) {
      setDeleteCommentError(err.message);
    } finally {
      setDeleteCommentLoading(false);
    }
  };

  const handleStartEditComment = (comment) => {
    requireAuth(() => {
      if (!canEditComment(comment)) {
        setError("No tenés permisos para editar este comentario");
        return;
      }

      setEditingCommentId(comment.id);
      setEditCommentText(comment.text);
      setEditCommentError("");

      setReplyingToId(null);
      setReplyText("");
      setReplyError("");

      setEditingPost(false);
      setEditPostTitle("");
      setEditPostBody("");
      setEditPostError("");
    });
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setEditCommentError("");
  };

  const handleUpdateComment = (event, commentId) => {
    event.preventDefault();

    requireAuth(async () => {
      if (!editCommentText.trim()) {
        setEditCommentError("El comentario no puede estar vacío");
        return;
      }

      try {
        setEditCommentLoading(true);
        setEditCommentError("");

        const response = await fetch(`${API_URL}/comments/${commentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editCommentText.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "No se pudo editar el comentario"
          );
        }

        setEditingCommentId(null);
        setEditCommentText("");
        loadData();
      } catch (err) {
        setEditCommentError(err.message);
      } finally {
        setEditCommentLoading(false);
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
    const role = comment.Person?.rol;
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

              <span className={`user-role-badge ${getRoleClass(role)}`}>
                {getRoleLabel(role)}
              </span>

              {canBanUser(comment.Person) && (
                <button
                  type="button"
                  className="ban-user-link"
                  onClick={() => goToBanForm(comment.Person)}
                >
                  Banear
                </button>
              )}

              {canMakeAdmin(comment.Person) && (
                <button
                  type="button"
                  className="make-admin-link"
                  onClick={() => handleMakeAdmin(comment.Person)}
                >
                  Hacer admin
                </button>
              )}

              <span className="thread-comment-dot">•</span>

              <span className="thread-comment-date">
                {formatDate(comment.postDate || comment.createdAt)}
              </span>

              {canDeleteComments() && (
                <button
                  type="button"
                  className="delete-comment-icon"
                  onClick={() => handleOpenDeleteCommentModal(comment)}
                  title="Borrar comentario"
                  aria-label="Borrar comentario"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="delete-comment-svg"
                    aria-hidden="true"
                  >
                    <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" />
                    <path d="M6 9h12l-1 12H7L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" />
                  </svg>
                </button>
              )}
            </div>

            {editingCommentId === comment.id ? (
              <Form
                onSubmit={(event) => handleUpdateComment(event, comment.id)}
                className="thread-reply-form"
                noValidate
              >
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="thread-reply-input"
                  value={editCommentText}
                  onChange={(event) => {
                    setEditCommentText(event.target.value);
                    setEditCommentError("");
                  }}
                  isInvalid={!!editCommentError}
                />

                {editCommentError && (
                  <div className="thread-reply-error">{editCommentError}</div>
                )}

                <div className="thread-reply-actions">
                  <Button
                    type="submit"
                    className="thread-reply-submit"
                    disabled={editCommentLoading}
                  >
                    {editCommentLoading ? "Guardando..." : "Guardar"}
                  </Button>

                  <button
                    type="button"
                    className="thread-reply-cancel"
                    onClick={handleCancelEditComment}
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            ) : (
              <p
                className="thread-comment-text"
                dangerouslySetInnerHTML={{
                  __html: formatBodyText(comment.text),
                }}
              />
            )}

            <div className="thread-comment-actions">
              <button type="button" hidden>
                ↑ {comment.likeCount || 0}
              </button>

              <button
                type="button"
                onClick={() => handleStartReply(comment.id)}
              >
                Responder
              </button>

              {canEditComment(comment) && editingCommentId !== comment.id && (
                <button
                  type="button"
                  onClick={() => handleStartEditComment(comment)}
                >
                  Editar
                </button>
              )}
            </div>

            {replyingToId === comment.id && (
              <Form
                onSubmit={(event) => handleCreateReply(event, comment.id)}
                className="thread-reply-form"
                noValidate
              >
                <Form.Control
                  type="text"
                  className="thread-reply-input"
                  placeholder={`Responder a ${author}`}
                  value={replyText}
                  onChange={(event) => {
                    setReplyText(event.target.value);
                    setReplyError("");
                  }}
                  isInvalid={!!replyError}
                />

                {replyError && (
                  <div className="thread-reply-error">{replyError}</div>
                )}

                <div className="thread-reply-actions">
                  <Button
                    type="submit"
                    className="thread-reply-submit"
                    disabled={replyLoading}
                  >
                    {replyLoading ? "Respondiendo..." : "Responder"}
                  </Button>

                  <button
                    type="button"
                    className="thread-reply-cancel"
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyText("");
                      setReplyError("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            )}

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
  const authorRole = post.Person?.rol;
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

              <span className={`user-role-badge ${getRoleClass(authorRole)}`}>
                {getRoleLabel(authorRole)}
              </span>

              {canBanUser(post.Person) && (
                <button
                  type="button"
                  className="ban-user-link"
                  onClick={() => goToBanForm(post.Person)}
                >
                  Banear
                </button>
              )}

              {canMakeAdmin(post.Person) && (
                <button
                  type="button"
                  className="make-admin-link"
                  onClick={() => handleMakeAdmin(post.Person)}
                >
                  Hacer admin
                </button>
              )}

              <span className="post-main-dot">•</span>

              <span className="post-main-date">
                {formatDate(post.postDate || post.createdAt)}
              </span>
            </div>
          </div>

          {editingPost ? (
            <Form onSubmit={handleUpdatePost} noValidate>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={editPostTitle}
                  onChange={(event) => {
                    setEditPostTitle(event.target.value);
                    setEditPostError("");
                  }}
                  isInvalid={!!editPostError}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editPostBody}
                  onChange={(event) => {
                    setEditPostBody(event.target.value);
                    setEditPostError("");
                  }}
                  isInvalid={!!editPostError}
                />
              </Form.Group>

              {editPostError && (
                <Alert variant="danger">
                  {editPostError}
                </Alert>
              )}

              <div className="thread-reply-actions">
                <Button type="submit" disabled={editPostLoading}>
                  {editPostLoading ? "Guardando..." : "Guardar"}
                </Button>

                <button
                  type="button"
                  className="thread-reply-cancel"
                  onClick={handleCancelEditPost}
                >
                  Cancelar
                </button>
              </div>
            </Form>
          ) : (
            <>
              <h1 className="post-main-title">{post.title}</h1>

              <p
                className="post-main-description"
                dangerouslySetInnerHTML={{
                  __html: formatBodyText(post.body),
                }}
              />
            </>
          )}

          <div className="post-main-actions">
            <button
              type="button"
              onClick={handleLikePost}
              disabled={likeLoading}
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

            {canEditPost() && !editingPost && (
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                onClick={handleStartEditPost}
              >
                Editar post
              </Button>
            )}

            {canDeletePost() && (
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={handleOpenDeletePostModal}
              >
                Eliminar post
              </Button>
            )}
          </div>
        </article>

        <section className="post-comment-entry">
          <Form onSubmit={handleCreateComment} noValidate>
            <div className="post-comment-input-row">
              <div className="post-comment-user-avatar">
                {getInitial(user?.nombre || "U")}
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

        <Modal
          show={deletePostModal}
          onHide={handleCloseDeletePostModal}
          centered
        >
          <Modal.Header closeButton={!deletePostLoading}>
            <Modal.Title>Borrar post</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="mb-2">
              ¿Estás seguro que deseás borrar este post?
            </p>

            {deletePostError && (
              <Alert variant="danger" className="mt-3 mb-0">
                {deletePostError}
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseDeletePostModal}
              disabled={deletePostLoading}
            >
              Cancelar
            </Button>

            <Button
              variant="danger"
              onClick={handleDeletePost}
              disabled={deletePostLoading}
            >
              {deletePostLoading ? "Borrando..." : "Borrar"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={!!commentToDelete}
          onHide={handleCloseDeleteCommentModal}
          centered
        >
          <Modal.Header closeButton={!deleteCommentLoading}>
            <Modal.Title>Borrar comentario</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="mb-2">
              ¿Estás seguro que deseás borrar este comentario?
            </p>

            {commentToDelete && getNestedCommentCount(commentToDelete) > 0 && (
              <p className="delete-comment-warning mb-0">
                También se borrarán {getNestedCommentCount(commentToDelete)}
                {getNestedCommentCount(commentToDelete) === 1
                  ? " respuesta anidada."
                  : " respuestas anidadas."}
              </p>
            )}

            {deleteCommentError && (
              <Alert variant="danger" className="mt-3 mb-0">
                {deleteCommentError}
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseDeleteCommentModal}
              disabled={deleteCommentLoading}
            >
              Cancelar
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteComment}
              disabled={deleteCommentLoading}
            >
              {deleteCommentLoading ? "Borrando..." : "Borrar"}
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </main>
  );
};

export default Post;