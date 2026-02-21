import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DigitalCardPreview from '../components/DigitalCardPreview';
import SEOMeta from '../components/SEOMeta';
import { useAuth } from '../lib/AuthContext';
import { Button } from 'react-bootstrap';

export default function PublicCard() {
  const { digital_card_url } = useParams(); // ID
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth(); // Check if logged in

  useEffect(() => {
    async function fetchCard() {
      if (!digital_card_url) return;

      try {
        // Fetch from remote Supabase since visitors won't have local PowerSync data for others
        const { data, error } = await supabase
          .from('digital_cards')
          .select('*')
          .eq('id', digital_card_url)
          .single();

        if (error) {
          console.error("Error fetching card:", error);
          setCard(null);
        } else {
          // We have a result. The Row Level Security (RLS) policy in Supabase 
          // already guarantees they can only fetch this row IF it's public OR they are the owner!
          setCard(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCard();
  }, [digital_card_url]);

  useEffect(() => {
    if (card && card.theme) {
      document.documentElement.setAttribute('data-theme', card.theme);
    }
  }, [card]);

  if (isLoading) {
    return <div className="text-center mt-5">Loading Card...</div>;
  }

  // 404 Handle
  if (!card) {
    return (
      <div className="text-center mt-5">
        <h2>Card Not Found</h2>
        <p>This digital card might be private, deleted, or does not exist.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  return (
    <>
      <SEOMeta card={card} digital_card_url={digital_card_url || ''} />
      {session && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <Link to="/dashboard">
            <Button variant="dark" size="sm" className="shadow opacity-75 rounded-pill px-3">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      )}
      <DigitalCardPreview card={card} />
    </>
  );
}
