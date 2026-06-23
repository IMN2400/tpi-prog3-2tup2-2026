import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  return (
    <main className="main-page">
      <Container>
        <section className="main-hero-section">
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="main-hero-content">
                <span className="main-badge">
                  Bienvenido a la comunidad
                </span>

                <h1 className="main-title">
                  El lugar para debatir, aprender y compartir
                </h1>

                <p className="main-description">
                  Unite a la comunidad de TUP y participá en conversaciones
                  sobre programación, tecnología, materias, trabajos prácticos
                  y proyectos académicos.
                </p>

                <Link to="/foros" className="main-action-button">
                  Ver foros disponibles
                  <span>→</span>
                </Link>
              </div>
            </Col>

            <Col lg={6}>
              <div className="main-visual-area">
                <div className="main-visual-background">
                  <span className="main-bg-dot dot-one"></span>
                  <span className="main-bg-dot dot-two"></span>
                  <span className="main-bg-line line-one"></span>
                  <span className="main-bg-line line-two"></span>
                </div>

                <span className="main-floating-heart">♥</span>

                <div className="main-circle">
                  <div className="main-chat-card main-chat-card-top">
                    <div className="main-chat-line dark" />
                    <div className="main-chat-line medium" />
                  </div>

                  <div className="main-chat-card main-chat-card-bottom">
                    <div className="main-chat-line medium" />
                    <div className="main-chat-line" />
                    <div className="main-chat-line short" />
                  </div>
                </div>

                <div className="main-floating-icon left">👤</div>
                <div className="main-floating-icon right">👥</div>
              </div>
            </Col>
          </Row>
        </section>

        <section className="main-benefits-section">
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="main-benefit-card">
                <Card.Body>
                  <div className="main-benefit-icon">👥</div>
                  <Card.Title>Comunidad</Card.Title>
                  <Card.Text>
                    Conectá con personas que comparten tus intereses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="main-benefit-card">
                <Card.Body>
                  <div className="main-benefit-icon">📖</div>
                  <Card.Title>Aprendizaje</Card.Title>
                  <Card.Text>
                    Aprendé de otros y compartí tu conocimiento.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="main-benefit-card">
                <Card.Body>
                  <div className="main-benefit-icon">⚡</div>
                  <Card.Title>Actualidad</Card.Title>
                  <Card.Text>
                    Enterate de novedades, consultas y tendencias.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="main-benefit-card">
                <Card.Body>
                  <div className="main-benefit-icon">🛡</div>
                  <Card.Title>Respeto</Card.Title>
                  <Card.Text>
                    Un ambiente seguro y respetuoso para todos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="main-stats-bar">
          <div className="main-stat-item">
            <strong>+500</strong>
            <span>Usuarios activos</span>
          </div>

          <div className="main-stat-item">
            <strong>+1200</strong>
            <span>Publicaciones</span>
          </div>

          <div className="main-stat-item">
            <strong>+3000</strong>
            <span>Comentarios</span>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default MainPage;