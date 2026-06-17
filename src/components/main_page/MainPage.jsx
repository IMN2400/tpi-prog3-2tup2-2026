import { Container, Row, Col, Card } from "react-bootstrap";

const MainPage = () => {
  return (
    <main className="main-page">
      <Container>
        <section className="main-hero">
          <span className="main-badge">Comunidad TUP</span>

          <h1 className="main-title">Gran Foro TUP</h1>

          <p className="main-description">
            Gran Foro TUP es un espacio digital pensado para estudiantes de la
            Tecnicatura Universitaria en Programación. Su objetivo es facilitar
            la participación, el intercambio de ideas, la resolución de dudas y
            la comunicación entre alumnos dentro de un entorno organizado.
          </p>

          <p className="main-description-secondary">
            Desde la plataforma se pueden consultar foros, leer publicaciones,
            ver comentarios y participar activamente iniciando sesión. La idea
            principal es centralizar las conversaciones académicas y evitar que
            la información importante quede dispersa en distintos canales.
          </p>
        </section>

        <section className="main-content-section">
          <Row className="g-4">
            <Col md={12}>
              <Card className="main-feature-card">
                <Card.Body>
                  <Card.Title>¿Para qué sirve?</Card.Title>
                  <Card.Text>
                    Sirve para organizar consultas, debates y publicaciones
                    relacionadas con materias, programación, trabajos prácticos,
                    proyectos y temas generales de la carrera.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="main-feature-card">
                <Card.Body>
                  <Card.Title>Participación de usuarios</Card.Title>
                  <Card.Text>
                    Cualquier visitante puede ingresar y leer el contenido
                    disponible. Para comentar o crear publicaciones, el usuario
                    debe iniciar sesión con una cuenta registrada.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="main-feature-card">
                <Card.Body>
                  <Card.Title>Moderación y organización</Card.Title>
                  <Card.Text>
                    Los administradores pueden gestionar usuarios, foros y
                    acciones de moderación para mantener un espacio ordenado,
                    respetuoso y útil para la comunidad.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default MainPage;