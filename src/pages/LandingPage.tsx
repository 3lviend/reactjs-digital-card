import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../lib/AuthContext';

export default function LandingPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate('/dashboard');
    }
  }, [session, loading, navigate]);
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="display-4 fw-bold mb-4">Your Professional Digital Identity</h1>
          <p className="lead mb-5">
            Create a stunning digital business card to showcase your personal profile and portfolio.
            Share your professional presence easily everywhere you go.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/auth/register">
              <Button variant="primary" size="lg" className="px-4 gap-3">
                Create Your Card Free
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline-secondary" size="lg" className="px-4">
                Login
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Multiple Cards</Card.Title>
              <Card.Text>Manage up to 3 different cards tailored for specific audiences.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Custom Themes</Card.Title>
              <Card.Text>Choose between elegant light and dark themes to match your brand style.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Offline Ready</Card.Title>
              <Card.Text>Your cards sync seamlessly. Manage your profile even without an internet connection.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
