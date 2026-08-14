# Vaibhavi's Kitchen

A responsive, culture-led website for a vegetarian multi-cuisine home kitchen. Orders are accepted by phone or WhatsApp for pickup only.

**Live website:** [vaibhavis-kitchen.netlify.app](https://vaibhavis-kitchen.netlify.app)

**Repository:** [Harshil-Lotwala/Vaibhavis-Kitchen](https://github.com/Harshil-Lotwala/Vaibhavis-Kitchen)

## Highlights

- Traditional Indian visual language without food photography
- Responsive layouts from small phones through tablets, desktops, and large screens
- Fast indexed search across dish names, descriptions, and categories
- Progressive menu loading that initially renders 12 dishes
- WhatsApp and telephone pickup-order actions
- Coordinate-based embedded pickup map
- Secure owner-only menu management
- Admin-managed categories, dishes, and optional dish descriptions
- Shared menu storage through Netlify Blobs
- Self-hosted fonts, deferred JavaScript, and optimized browser caching
- Automatic Netlify deployment from GitHub

## Project structure

- `index.html` — website content and interface
- `styles.css` — primary visual design
- `responsive.css` — device-specific layout adjustments
- `script.js` — menu, search, admin interface, and browser interactions
- `netlify/functions/auth.mjs` — server-side admin authentication
- `netlify/functions/menu.mjs` — shared menu API
- `netlify/functions/_auth.mjs` — signed session utilities
- `netlify.toml` — Netlify build and Functions configuration
- `assets/fonts/` — locally hosted WOFF2 fonts
- `README.md` — current project behavior, setup, and operational notes

## Local use

Open `index.html` directly in Safari or another modern browser. The public website and menu work locally. Secure admin access is available only on the deployed HTTPS website because authentication depends on server-side Netlify Functions and HttpOnly cookies.

## Deployment and branches

The Netlify project is connected directly to this GitHub repository. Git pushes trigger Netlify builds automatically.

- `main` — primary source branch and current live auto-deployment branch
- `production` — synchronized release branch and enabled Netlify branch deployment

Required private environment variables are stored in Netlify and must never be committed to this repository:

- `ADMIN_CREDENTIALS`
- `SESSION_SECRET`

Manual Netlify deployment is not required during normal development. Push the completed source to GitHub and allow Netlify to build the static site and server functions.

## Admin menu management

Approved owners can sign in from the Admin Login button. Menu changes are stored online and become available to all visitors without editing source files or requesting a developer deployment.

Admin credentials are intentionally excluded from this repository and documentation.

Admins can change their own password from the dashboard. New passwords require at least eight characters, including one uppercase letter, one number, and one special character.

Password changes require the current password and affect only the signed-in owner. Changed passwords are salted and stored in a private Netlify Blob. Successful changes invalidate the current session and require a fresh sign-in.

Authentication uses a signed, Secure, HttpOnly, SameSite session cookie. Admin credentials and password hashes are not stored in browser storage or the current GitHub source.

## Performance

- Search text is indexed when menu data loads instead of being rebuilt for every keystroke.
- Search rendering is synchronized with the browser's animation frame to remain responsive while typing.
- Only the currently visible menu batch is rendered.
- Fonts are served locally and preloaded without third-party font requests.
- JavaScript is deferred until HTML parsing is complete.
- Font assets receive long-lived immutable caching headers.

## Ordering

The website does not provide checkout, delivery, or online payment. Customers order by WhatsApp or telephone and collect confirmed orders by pickup.

## Documentation maintenance

Update this README in the same commit whenever a change affects features, security, deployment, configuration, project structure, administrator workflows, or customer behavior. Documentation updates are part of feature completion, not a separate follow-up task.
