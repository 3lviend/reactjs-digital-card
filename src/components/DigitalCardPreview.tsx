import React, { useEffect } from 'react';
import ProfileSection from './ProfileSection/ProfileSection';
import CardElement from './CardElement/CardElement';
import SocialMediaElement from './SocialMedia/Element/SocialMediaElement';
// Import the old specific theme files to be injected dynamically
import '../colorThemes/light.css';
import '../colorThemes/dark.css';
import '../colorThemes/minimalist.css';
import '../colorThemes/glass.css';
import '../colorThemes/neon.css';
import '../colorThemes/corporate.css';
import '../colorThemes/gradient.css';

interface DigitalCardPreviewProps {
  card: any;
  miniature?: boolean;
}

const DigitalCardPreview: React.FC<DigitalCardPreviewProps> = ({ card, miniature = false }) => {
  // Use a local theme class approach instead of full document element since it might be embedded in the dashboard
  const themeClass = card?.theme ? `${card.theme}-theme-wrapper` : 'light-theme-wrapper';

  const formatName = () => {
    const parts = [card.prefix, card.first_name, card.middle_name, card.last_name, card.suffix].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
    if (card.preferred_name) return card.preferred_name;
    return card.full_name || 'Unnamed';
  };

  const profileName = formatName();

  let parsedSocialMedia = [];
  try {
    if (typeof card.social_media === 'string') {
      parsedSocialMedia = JSON.parse(card.social_media);
    } else if (Array.isArray(card.social_media)) {
      parsedSocialMedia = card.social_media;
    }
  } catch (e) {
    // skip parse errors
  }

  const descriptionNode = (
    <>
      {card.title && <><strong className="fs-5">{card.title}</strong><br /></>}
      {card.department && <><span style={{ opacity: 0.8 }}>{card.department}</span><br /></>}
      {card.company && <><em className="fw-bold">{card.company}</em><br /></>}
      {(card.title || card.department || card.company) && <br />}
      {card.headline && <span>{card.headline}</span>}
    </>
  );

  // Scale down for dashboard
  const containerStyle = miniature ? { transform: 'scale(0.8)', transformOrigin: 'top center', maxHeight: '500px', overflow: 'hidden', pointerEvents: 'none' as any } : {};

  return (
    <div className={`PublicCard ${themeClass}`} style={containerStyle}>
      <div className="ContentWrapper" style={miniature ? { padding: 0, marginTop: 0 } : { paddingTop: '40px' }}>
        <div style={{
          backgroundColor: 'var(--background-color)',
          borderRadius: miniature ? '0' : '24px',
          boxShadow: miniature ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          border: miniature ? 'none' : '1px solid var(--border-color)',
          paddingBottom: '30px',
          marginBottom: '20px'
        }}>
          <ProfileSection
            name={profileName}
            backgroundImage={card.background_url}
            profileImage={card.avatar_url}
            description={descriptionNode}
          />

          <div className="px-3 px-md-4">
            {/* Dynamic Fields */}
            {card.contact_type && (
              <CardElement
                title="Contact Info"
                description={card.contact_type}
                icon="fa-address-card"
                href={card.contact_type.includes('@') ? `mailto:${card.contact_type}` : `tel:${card.contact_type}`}
              />
            )}

            {card.accreditations && (
              <CardElement
                title="Accreditations"
                description={card.accreditations}
                icon="fa-award"
                href="#"
              />
            )}

            {card.notes && (
              <CardElement
                title="About / Notes"
                description={card.notes}
                icon="fa-info-circle"
                href="#"
              />
            )}

            {card.qr_code && (
              <CardElement
                title="QR Link"
                description="Scan or click to visit"
                icon="fa-qrcode"
                href={card.qr_code}
              />
            )}

            {parsedSocialMedia && parsedSocialMedia.length > 0 && (
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                {parsedSocialMedia.map((link: string, index: number) => {
                  if (!link || !link.trim()) return null;
                  return <SocialMediaElement key={index} href={link.trim()} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {!miniature && (
        <footer className="text-center mt-5 pb-3">
          <small className="text-muted">
            Powered by <a href="/">My Digital Card</a>
          </small>
        </footer>
      )}
    </div>
  );
};

export default DigitalCardPreview;
