# Vaibhavi's Kitchen

A responsive, culture-led website for a vegetarian multi-cuisine home kitchen. Orders are accepted by phone or WhatsApp for pickup only.

## Highlights

- Traditional Indian visual language without food photography
- Responsive layouts for phones, tablets, desktops, and large screens
- Searchable, category-based menu with progressive loading
- WhatsApp and telephone pickup-order actions
- Coordinate-based embedded pickup map
- Secure owner-only menu management
- Admin-managed categories, dishes, and optional dish descriptions
- Shared menu storage through Netlify Blobs

## Project structure

- `index.html` — website content and interface
- `styles.css` — primary visual design
- `responsive.css` — device-specific layout adjustments
- `script.js` — menu, search, admin interface, and browser interactions
- `netlify/functions/auth.mjs` — server-side admin authentication
- `netlify/functions/menu.mjs` — shared menu API
- `netlify/functions/_auth.mjs` — signed session utilities
- `netlify.toml` — Netlify build and Functions configuration

## Local use

Open `index.html` directly in Safari or another modern browser. The public website and menu work locally. Secure admin access is available only on the deployed HTTPS website because authentication depends on server-side Netlify Functions and HttpOnly cookies.

## Deployment

The production site is configured for Netlify. Required private environment variables are stored in Netlify and must never be committed to this repository:

- `ADMIN_CREDENTIALS`
- `SESSION_SECRET`

Deploy from the repository root with Netlify build processing enabled so Functions and dependencies are bundled.

## Admin menu management

Approved owners can sign in from the Admin Login button. Menu changes are stored online and become available to all visitors without editing source files or requesting a developer deployment.

Admin credentials are intentionally excluded from this repository and documentation.

## Ordering

The website does not provide checkout, delivery, or online payment. Customers order by WhatsApp or telephone and collect confirmed orders by pickup.
