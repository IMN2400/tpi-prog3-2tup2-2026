import ForumDisplay from "../forumDisplay/ForumDisplay";

const Forums = ({ forumsProp = [] }) => {
  const forums = Array.isArray(forumsProp) ? forumsProp : [];

  if (forums.length === 0) {
    return <p>No hay foros cargados todavía.</p>;
  }

  return (
    <section className="d-flex flex-wrap gap-3">
      {forums.map((forum) => (
        <ForumDisplay key={forum.id} forum={forum} />
      ))}
    </section>
  );
};

export default Forums;