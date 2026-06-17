import { useParams } from "react-router-dom";
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI";
import Post from "../post/Post";

const ForumPage = () => {
  const { forumId } = useParams();

  const {
    data: posts,
    loading,
    error,
  } = useFetchFromAPI(`/forums/${forumId}/posts`, []);

  if (loading) return <p>Cargando posts...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h1>Posts del foro</h1>

      {posts.length === 0 ? (
        <p>No hay posts en este foro todavía.</p>
      ) : (
        posts.map((item) => (
          <Post key={item.id} postId={item.id} />
        ))
      )}
    </div>
  );
};

export default ForumPage;