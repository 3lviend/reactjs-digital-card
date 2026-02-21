import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4" id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required minLength={6} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              Already have an account? <Link to="/auth/login">Log In</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
