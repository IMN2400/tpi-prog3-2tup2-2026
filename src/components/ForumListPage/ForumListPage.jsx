import { Container, Alert, Spinner } from "react-bootstrap";
import Forums from "../forums/Forums";
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI";

const ForumListPage = () => {
  const { data: forums, loading, error } = useFetchFromAPI("/forums", []);

  if (loading) {
    return (
      <main className="main-page">
        <Container>
          <div className="forums-loading">
            <Spinner animation="border" />
            <p>Cargando foros...</p>
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-page">
        <Container>
          <Alert variant="danger">
            Error al cargar los foros: {error}
          </Alert>
        </Container>
      </main>
    );
  }

  return (
    <main className="main-page">
      <Container>
        <section className="main-hero">
          <span className="main-badge">Foros disponibles</span>

          <h1 className="main-title">Foros de la comunidad</h1>

          <p className="main-description-secondary">
            Elegí un foro para ver sus publicaciones, leer comentarios y
            participar en las conversaciones de la comunidad TUP.
          </p>
        </section>

        <Forums forumsProp={forums || []} />
      </Container>
    </main>
  );
};

export default ForumListPage;