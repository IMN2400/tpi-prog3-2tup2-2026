import ForumDisplay from "../forumDisplay/ForumDisplay";

const Forums = ({ forumsProp = [] }) => {
  const forums = Array.isArray(forumsProp) ? forumsProp : [];

  if (forums.length === 0) {
    return (
      <div className="forums-page-empty">
        <p>No se encontraron foros.</p>
      </div>
    );
  }

  return (
    <section className="forums-page-grid">
      {forums.map((forum) => (
        <ForumDisplay key={forum.id} forum={forum} />
      ))}
    </section>
  );
};

export default Forums;