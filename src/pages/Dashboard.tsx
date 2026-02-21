import React, { useState } from 'react';
import { Container, Button, Navbar, Nav, Card, Row, Col, Badge, Form } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { usePowerSync, useQuery } from '@powersync/react';
import DigitalCardForm from '../components/DigitalCardForm';
import DigitalCardPreview from '../components/DigitalCardPreview';

export default function Dashboard() {
  const navigate = useNavigate();
  const powersync = usePowerSync();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);

  // Watch query via PowerSync
  // is_public comes as an integer from sqlite, we can handle it in UI
  const { data: cards, isLoading } = useQuery('SELECT * FROM digital_cards ORDER BY created_at DESC');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      await powersync.execute('DELETE FROM digital_cards WHERE id = ?', [id]);
    }
  };

  const handleTogglePublic = async (card: any) => {
    const newStatus = card.is_public === 1 ? 0 : 1;
    await powersync.execute('UPDATE digital_cards SET is_public = ? WHERE id = ?', [newStatus, card.id]);
  };

  const openEdit = (card: any) => {
    setEditingCard({
      ...card,
      is_public: card.is_public === 1
    });
    setShowForm(true);
  };

  const openCreate = () => {
    let prefill = null;

    // If they already have a card, use the latest one to prefill
    if (cards && cards.length > 0) {
      const latest = cards[0]; // Ordered by created_at DESC
      prefill = { ...latest };

      // Remove unique/system identifiers so it counts as a new Create rather than Edit
      delete prefill.id;
      delete prefill.digital_card_name;
      delete prefill.created_at;

      // Make sure the copy is set up as public by default or respects the boolean conversion
      prefill.is_public = prefill.is_public === 1;
    }

    setEditingCard(prefill);
    setShowForm(true);
  };

  const handleShare = (id: string) => {
    const fullUrl = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Copied link: ' + fullUrl);
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand>My Digital Card - Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {showForm ? (
          <DigitalCardForm existingCard={editingCard} onComplete={() => setShowForm(false)} />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Your Digital Cards</h2>
              <Button variant="primary" onClick={openCreate} disabled={cards.length >= 3}>
                + Create New Card
              </Button>
            </div>

            {cards.length >= 3 && (
              <div className="alert alert-info py-2">
                You have reached the maximum limit of 3 digital cards.
              </div>
            )}

            {isLoading ? (
              <p>Loading your cards...</p>
            ) : cards.length === 0 ? (
              <div className="text-muted text-center py-5 bg-white shadow-sm rounded">
                <p>You haven't created any digital cards yet.</p>
                <Button variant="outline-primary" onClick={openCreate}>Create Your First Card</Button>
              </div>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {cards.map((card: any) => (
                  <Col key={card.id}>
                    <Card className="h-100 shadow-sm border-0 bg-white">

                      {/* Name Plate */}
                      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-5 text-truncate">
                          {card.digital_card_name || 'Unnamed Card'}
                        </span>
                        <Badge bg={card.theme === 'dark' ? 'dark' : 'secondary'}>
                          {card.theme || 'light'}
                        </Badge>
                      </div>

                      {/* Mini Preview Component Container */}
                      <div className="position-relative overflow-hidden bg-light" style={{ height: '350px' }}>
                        <DigitalCardPreview card={card} miniature={true} />
                      </div>

                      <Card.Body className="border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <Form.Check
                            type="switch"
                            id={`public-switch-${card.id}`}
                            label={card.is_public === 1 ? 'Public' : 'Private'}
                            checked={card.is_public === 1}
                            onChange={() => handleTogglePublic(card)}
                          />
                          <small className="text-muted text-truncate w-50 text-end">
                            /{card.id.split('-')[0]}...
                          </small>
                        </div>

                        <div className="gap-2 d-flex flex-wrap">
                          <Button variant="outline-primary" size="sm" onClick={() => openEdit(card)}>Edit</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(card.id)}>Delete</Button>
                          <Button variant="success" size="sm" onClick={() => handleShare(card.id)} disabled={card.is_public !== 1}>Share URL</Button>
                          <Button variant="info" size="sm" onClick={() => navigate(`/${card.id}`)} disabled={card.is_public !== 1}>Preview</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
