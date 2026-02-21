import { useEffect } from 'react';

interface SEOMetaProps {
  card: any;
  digital_card_url: string;
}

export default function SEOMeta({ card, digital_card_url }: SEOMetaProps) {
  useEffect(() => {
    if (!card) return;

    // Update SEO Metadata
    const profileName = [card.prefix, card.first_name, card.middle_name, card.last_name, card.suffix].filter(Boolean).join(' ') || card.preferred_name || card.full_name || 'Digital Card';

    document.title = `${profileName} | My Digital Card`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionText = card.headline || card.title || `Check out ${profileName}'s professional digital card.`;

    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionText);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = descriptionText;
      document.head.appendChild(meta);
    }

    // Dynamically override PWA manifest so "Add to Homescreen" links directly to this specific profile
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }

    const dynamicManifest = {
      name: `${profileName} - Digital Card`,
      short_name: profileName,
      start_url: `/${digital_card_url}`,
      display: "standalone",
      background_color: card.theme === 'dark' ? "#212529" : "#ffffff",
      theme_color: card.theme === 'dark' ? "#212529" : "#ffffff",
      icons: [
        {
          src: "/assets/favicon/favicon-96.png",
          sizes: "96x96",
          type: "image/png"
        }
      ]
    };

    const manifestStr = encodeURIComponent(JSON.stringify(dynamicManifest));
    manifestLink.setAttribute('href', `data:application/manifest+json;charset=utf-8,${manifestStr}`);

    // Inject Apple-specific iOS PWA fallback tags
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(appleTitle);
    }
    appleTitle.setAttribute('content', profileName);

    let appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapable) {
      appleCapable = document.createElement('meta');
      appleCapable.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleCapable);
    }
    appleCapable.setAttribute('content', 'yes');
  }, [card, digital_card_url]);

  return null;
}
