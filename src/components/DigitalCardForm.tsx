import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Accordion, Card } from 'react-bootstrap';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '../lib/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalCardForm({ existingCard, onComplete }: { existingCard?: any, onComplete: () => void }) {
  const powersync = usePowerSync();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // We generate ID here so we know the URL immediately to build the QR Code
  const [cardId] = useState(() => existingCard?.id || uuidv4());

  const [formData, setFormData] = useState({
    digital_card_name: '',
    full_name: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    prefix: '',
    suffix: '',
    accreditations: '',
    preferred_name: '',
    title: '',
    department: '',
    company: '',
    headline: '',
    background_url: '',
    avatar_url: '',
    contact_type: '',
    notes: '',
    qr_code: '',
    theme: 'light',
    is_public: true,
    social_media: [] as string[]
  });

  useEffect(() => {
    if (existingCard) {
      let parsedSocialMedia = [];
      try {
        if (typeof existingCard.social_media === 'string') {
          parsedSocialMedia = JSON.parse(existingCard.social_media);
        } else if (Array.isArray(existingCard.social_media)) {
          parsedSocialMedia = existingCard.social_media;
        }
      } catch (e) {
        // failed to parse JSON, ignore
      }

      setFormData({
        ...existingCard,
        social_media: parsedSocialMedia
      });
    }
  }, [existingCard]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSocial = () => {
    setFormData(prev => ({ ...prev, social_media: [...prev.social_media, ''] }));
  };

  const handleSocialChange = (index: number, value: string) => {
    const newSocial = [...formData.social_media];
    newSocial[index] = value;
    setFormData(prev => ({ ...prev, social_media: newSocial }));
  };

  const handleRemoveSocial = (index: number) => {
    const newSocial = formData.social_media.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, social_media: newSocial }));
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white"; // Add white background to make it scannable
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `digital-card-qr-${cardId}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (existingCard?.id) {
        const updates = { ...formData };
        delete (updates as any).id;

        const payload = {
          ...updates,
          is_public: updates.is_public ? 1 : 0,
          social_media: JSON.stringify(updates.social_media)
        };

        const setClauses = Object.keys(payload).map(k => `"${k}" = ?`).join(', ');
        const values = Object.values(payload);

        await powersync.execute(`UPDATE digital_cards SET ${setClauses} WHERE id = ?`, [...values, cardId]);
      } else {
        const payload = {
          ...formData,
          id: cardId,
          user_id: user.id,
          created_at: new Date().toISOString(),
          is_public: formData.is_public ? 1 : 0,
          social_media: JSON.stringify(formData.social_media)
        };

        const columns = Object.keys(payload).map(k => `"${k}"`).join(', ');
        const placeholders = Object.keys(payload).map(() => '?').join(', ');
        const values = Object.values(payload);

        await powersync.execute(`INSERT INTO digital_cards (${columns}) VALUES (${placeholders})`, values);
      }
      onComplete();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <h4 className="mb-4">{existingCard?.id ? 'Edit' : 'Create'} Digital Card</h4>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Card Identifier (Internal Use)</Form.Label>
                <Form.Control required name="digital_card_name" value={formData.digital_card_name || ''} onChange={handleChange} placeholder="e.g. Work Profile" />
              </Form.Group>
            </Col>
          </Row>

          <Accordion defaultActiveKey="0" className="mb-3">

            <Accordion.Item eventKey="0">
              <Accordion.Header>Personal Details</Accordion.Header>
              <Accordion.Body>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Full Name / Display Name</Form.Label>
                      <Form.Control required name="full_name" value={formData.full_name || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control name="first_name" value={formData.first_name || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control name="middle_name" value={formData.middle_name || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control name="last_name" value={formData.last_name || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Prefix</Form.Label>
                      <Form.Control name="prefix" value={formData.prefix || ''} onChange={handleChange} placeholder="Dr." />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Suffix</Form.Label>
                      <Form.Control name="suffix" value={formData.suffix || ''} onChange={handleChange} placeholder="Jr." />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Preferred Name / Nickname</Form.Label>
                      <Form.Control name="preferred_name" value={formData.preferred_name || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Accreditations</Form.Label>
                  <Form.Control name="accreditations" value={formData.accreditations || ''} onChange={handleChange} placeholder="Ph.D, MD, etc." />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Professional Information</Accordion.Header>
              <Accordion.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control name="title" value={formData.title || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Department</Form.Label>
                      <Form.Control name="department" value={formData.department || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Company</Form.Label>
                      <Form.Control name="company" value={formData.company || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Headline / Bio</Form.Label>
                  <Form.Control as="textarea" rows={3} name="headline" value={formData.headline || ''} onChange={handleChange} />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Media & Contact Options</Accordion.Header>
              <Accordion.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Avatar Image URL</Form.Label>
                      <Form.Control name="avatar_url" value={formData.avatar_url || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Background Image URL</Form.Label>
                      <Form.Control name="background_url" value={formData.background_url || ''} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contact Number / Email</Form.Label>
                      <Form.Control name="contact_type" value={formData.contact_type || ''} onChange={handleChange} placeholder="+1234567890" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>QR Code</Form.Label>
                      <div className="d-flex align-items-center gap-3 bg-light p-3 rounded">
                        <QRCodeSVG
                          id="qr-code-svg"
                          value={`${window.location.origin}/${cardId}`}
                          size={80}
                          level="H"
                        />
                        <div>
                          <p className="mb-2 text-muted small">Scan to visit this profile</p>
                          <Button variant="outline-secondary" size="sm" onClick={downloadQRCode}>
                            Download PNG
                          </Button>
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes (Internal/Optional)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="notes" value={formData.notes || ''} onChange={handleChange} />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Social Media Links</Accordion.Header>
              <Accordion.Body>
                {formData.social_media.map((url, index) => (
                  <Row className="mb-2" key={index}>
                    <Col>
                      <Form.Control
                        placeholder="https://linkedin.com/in/username"
                        value={url}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="outline-danger" onClick={() => handleRemoveSocial(index)}>Remove</Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="outline-primary" size="sm" onClick={handleAddSocial} className="mt-2">+ Add Social Link</Button>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>

          <Row className="bg-light p-3 rounded mx-0 border mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Theme Style</Form.Label>
                <Form.Select name="theme" value={formData.theme} onChange={handleChange}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="minimalist">Minimalist & Modern</option>
                  <option value="glass">Modern Glassmorphism</option>
                  <option value="neon">Neon</option>
                  <option value="corporate">Corporate & Professional</option>
                  <option value="gradient">Gradient & Vibrant</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-center mt-3 mt-md-0 pt-md-4">
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="form-is-public-switch"
                  name="is_public"
                  label="Make card publicly visible"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="fw-bold"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={onComplete}>Cancel</Button>
            <Button variant="primary" type="submit" className="px-5">Save Card</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
