# My Digital Card (Offline-First PowerSync Edition)

> **Attribution Note:** This project is a heavily upgraded fork of the original [My Digital Card by weisser-dev](https://github.com/weisser-dev/my-digital-card). The original template provided a beautiful static JSON-based digital card. This fork evolves that concept into a fully dynamic, multi-tenant, offline-first application!

My Digital Card is a modern, React-based application designed to create personalized and interactive digital business cards. This upgraded version transforms the static template into a full SaaS-style application where users can create accounts, manage multiple active cards from a private dashboard, and rely on robust offline capabilities.

## Major New Features

- **Offline-First PWA:** Powered by Vite PWA and Workbox, the entire app shell and routing logic work flawlessly without an internet connection.
- **PowerSync + Local SQLite:** All dashboard data is gracefully stored directly on your device using WASM SQLite. When you are offline, you can still view and interact with your cards. When you reconnect, PowerSync automatically reconciles your data with the central Postgres database!
- **Supabase Authentication:** Secure User Login and Registration using Supabase Auth.
- **Dynamic User Dashboard:** A private workspace to dynamically create, edit, delete, and toggle visibility on up to 3 different digital cards.
- **7 Beautiful Themes:** In addition to the original light and dark modes, choose from Minimalist, Glassmorphism, Corporate, Neon, and Gradient themes!
- **QR Code Generation:** Instantly generate and download scannable QR Code PNGs for your specific digital cards to place on physical media.
- **Dynamic SEO:** The app automatically generates proper metadata titles and descriptions specifically matching the profile you are viewing.

## Installation

To run this heavily upgraded stack locally, you will need a Supabase project and a PowerSync instance.

1. Clone the repository:
   ```bash
   git clone https://github.com/weisser-dev/my-digital-card.git # Replace with your fork URL
   cd my-digital-card
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Create a `.env` file at the root of the project with your database credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_POWERSYNC_URL=your_powersync_instance_url
   ```

4. Database Setup:
   Execute the provided `schema.sql` file in your Supabase SQL Editor, which sets up the `digital_cards` table and the necessary Row Level Security (RLS) policies for secure multi-tenant access.

5. Start the Vite Dev Server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/`
  - `components/`: Reusable UI pieces (Dashboard Modals, DigitalCardPreview, SocialMediaElement).
  - `lib/`: The core infrastructure connecting Supabase Auth, PowerSync, and Drizzle ORM.
  - `pages/`: The dynamic routes (`/login`, `/register`, `/dashboard`, `/:digital_card_url`).
  - `colorThemes/`: The diverse CSS variable definitions for the 7 available themes.
- `schema.sql`: The Supabase postgres schema and security policies.

## Contributing & License

While this project is a robust fork, we highly encourage exploring the elegant origins of this repository over at [weisser-dev's github](https://github.com/weisser-dev/my-digital-card). 

Both the original project and this upgraded implementation are released under the MIT License.
## Screenshots

### Mobile View
![Mobile View](./screenshots/mobile.png)

### Desktop View
![Desktop View](./screenshots/desktop.png)

### Themes
![Light Theme](./screenshots/light.png)
![Dark Theme](./screenshots/dark.png)
![Mobile View](./screenshots/mobile.png)
