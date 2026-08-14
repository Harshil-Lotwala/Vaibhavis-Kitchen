# Vaibhavi's Kitchen

A responsive, culture-led website for a vegetarian multi-cuisine home kitchen in Surat. The business accepts pickup orders by WhatsApp or telephone. It is not a dine-in restaurant, does not offer delivery, and does not provide online checkout or payment.

**Live website:** [vaibhavis-kitchen.netlify.app](https://vaibhavis-kitchen.netlify.app)

**GitHub repository:** [Harshil-Lotwala/Vaibhavis-Kitchen](https://github.com/Harshil-Lotwala/Vaibhavis-Kitchen)

## Brand and design

- Traditional Indian cultural visual language without food photography
- Culture, hospitality, family, variety, and tradition are the central brand themes
- Multi-cuisine positioning rather than a Gujarati-only taste claim
- Featured cuisines include Gujarati, Punjabi, Indo-Chinese, Mexican, Italian, Indian street food, and other global influences
- Primary palette:
  - Maroon: `#6f161b`
  - Red: `#a62522`
  - Saffron: `#ec851c`
  - Turmeric: `#f2b632`
  - Cream: `#fff4d8`
  - Paper: `#fffaf0`
  - Brown: `#3d2118`
  - Green: `#325b3f`
  - Gold: `#d8a32b`
- Display font: Yatra One
- Interface font: DM Sans
- Both fonts are self-hosted as WOFF2 assets
- `favicon.svg` uses the same palette, decorative Indian geometry, and a centered “V’s” monogram
- Browser theme color matches the maroon brand color

## Customer experience

- Sticky desktop header with Menu, Our Story, Pickup & Contact, Admin Login, and WhatsApp Order actions
- Mobile header with compact Admin Login and WhatsApp actions
- Mobile bottom navigation contains only Menu and WhatsApp
- Hero section presents the multi-cuisine, one-family-kitchen message
- Cultural artwork is created with HTML and CSS rather than food photography
- Story and values sections explain Indian hospitality, authentic variety, and the family-kitchen approach
- Menu categories appear as horizontally scrollable tabs on small screens
- Menu initially renders 12 dishes to prevent excessive scrolling
- “Show more dishes” progressively reveals the next batch
- A direct “Skip to pickup & contact” action avoids scrolling through the menu
- Dish cards show category, dish name, and an optional administrator-written description
- Pickup information clearly states that there is no dine-in or delivery
- Embedded Google Map uses coordinates `21.189791, 72.799361`
- No written location name or street address is displayed
- Map includes an Open in Maps action

## Ordering contacts

Orders are placed directly and confirmed for pickup.

- WhatsApp and telephone: `+91 98790 75854`
- WhatsApp and telephone: `+91 88662 19289`

WhatsApp links include a prepared pickup-order greeting. Customers should provide dishes, quantities, date, and preferred pickup time. Availability and pricing are confirmed directly by the business.

## Menu and search

- Default menu data is stored in `script.js`
- Online administrator changes are stored in Netlify Blobs
- Menu data is organized as categories containing dish objects
- Every dish has a required name and an optional description
- Categories have names only and do not have descriptions
- Search covers dish names, dish descriptions, and category names
- Searchable text is normalized and indexed when menu data loads
- Input updates cancel obsolete rendering work and run on the browser's next animation frame
- Only the visible result batch is rendered
- Category changes and new searches reset the visible batch to 12
- Local browser storage provides a fallback menu copy
- The deployed shared menu takes precedence when available

## Responsive behavior

The website is designed for small phones through tablets, laptops, desktops, and large screens.

- Under `380px`: extra-small header, typography, spacing, and single-column facts
- Up to `680px`: phone navigation, one-column content, full-screen admin dashboard, compact forms, and touch-sized controls
- Up to `900px`: tablet navigation changes, single-column hero/story/contact sections, and two-column menu cards
- Up to `1100px`: reduced desktop spacing and typography adjustments
- From `1400px`: expanded wide-screen spacing and four-column menu layout
- Fluid `clamp()` typography and flexible widths prevent extreme scaling
- Horizontal overflow is suppressed
- Interactive controls receive larger touch targets on touch devices
- Reduced-motion preferences disable unnecessary smooth animation behavior
- The Google Map, menu, admin tools, contact panel, cultural artwork, and footer all adapt independently

## Admin access

- Admin Login is available from the top-right header
- Only approved owner email accounts can authenticate
- Account details and passwords are intentionally excluded from this repository and README
- Admin access works only on the deployed HTTPS website
- Opening `index.html` locally continues to support the public customer site but not secure administration
- The admin dashboard never opens automatically on page load, reload, browser-history restoration, or reopened tabs
- Safari page-cache restoration is explicitly handled through the `pageshow` event
- A valid signed-in session may allow the dashboard to reopen after pressing Admin Login until sign-out or expiry

## Admin menu management

Authenticated owners can:

- Add categories
- Delete categories and their contained dishes after confirmation
- Add dishes to a selected category
- Add a dish with or without a description
- Edit dish names and descriptions
- Move an edited dish between categories
- Delete individual dishes
- View item counts for each category
- See items without descriptions identified in the management view
- Publish menu changes immediately to the shared online menu

Menu administration does not require source-code editing, a technical person, or a new website deployment.

## Password management

- Every signed-in owner can change only their own password
- Change Password opens a separate compact centered dialog over the dashboard
- The dialog contains current password, new password, and confirmation fields
- The only dialog actions are Update Password and Exit
- Clicking outside the dialog also closes it
- The current password must be correct
- The new password must differ from the current password
- The confirmation must match the new password
- New passwords require:
  - At least 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character
- Changed passwords are salted with a cryptographically random salt and derived with scrypt
- Password overrides are stored in a private Netlify Blob
- Successful password changes clear the current session and require a new login

## Authentication and security

- Login verification happens only inside a Netlify Function
- Passwords and current password hashes are not included in browser JavaScript
- Passwords are not stored in localStorage or sessionStorage
- Approved initial credential records are stored in the private `ADMIN_CREDENTIALS` Netlify environment variable
- `SESSION_SECRET` is stored privately in Netlify
- Both values are configured as secret production environment variables and must never be committed
- Sessions are signed with HMAC-SHA256
- Session cookies are `Secure`, `HttpOnly`, `SameSite=Strict`, and restricted to the site path
- Sessions expire after eight hours
- Menu write requests require a valid signed session cookie
- Unauthorized menu writes return HTTP `401`
- Authentication and menu API responses use `Cache-Control: no-store`
- Password comparisons use timing-safe comparison
- Secret values and passwords must never be added to this README, source code, commits, screenshots, or issue discussions

## Server endpoints

### `GET /api/auth`

Returns whether the current request has an authenticated session.

### `POST /api/auth`

Verifies an approved email and password, then creates the secure session cookie.

### `PATCH /api/auth`

Requires an authenticated session and changes the signed-in owner's password after current-password and strength validation.

### `DELETE /api/auth`

Clears the session cookie and signs the owner out.

### `GET /api/menu`

Returns the shared menu from Netlify Blobs or `null` before the first online menu write.

### `PUT /api/menu`

Requires an authenticated session and stores the complete shared menu in Netlify Blobs.

## Storage

- `localStorage` key `vk_menu` stores a local menu copy for offline/local fallback
- `sessionStorage` key `vk_admin` tracks dashboard presentation during the current tab session but does not contain credentials
- Netlify Blob store `vaibhavis-kitchen-menu` stores the shared online menu
- Netlify Blob store `vaibhavis-kitchen-security` stores per-account password overrides
- Initial credential records and the session signing key remain private Netlify environment variables

## Performance

- Total menu rendering is limited through progressive batches
- Search text is precomputed instead of rebuilt per keystroke
- Search rendering is scheduled with `requestAnimationFrame`
- JavaScript is loaded with `defer`
- DM Sans and Yatra One are self-hosted to eliminate Google Fonts runtime requests
- Both WOFF2 files are preloaded from the page head
- Font files receive `public, max-age=31536000, immutable` caching
- CSS receives a one-week public cache
- JavaScript receives a one-hour cache with revalidation
- The map iframe uses native lazy loading
- No food photography or large raster hero images are downloaded
- Netlify handles CDN delivery and compression

## Local operation

Double-click `index.html` to open the public website directly in Safari or another modern browser. No localhost server is required for public browsing, menu search, category filtering, contact actions, or locally cached menu viewing.

Server-dependent features do not work from the `file://` version:

- Secure admin login
- Shared online menu writes
- Password changes
- Netlify Blob access

## GitHub and Netlify deployment

- GitHub repository: `Harshil-Lotwala/Vaibhavis-Kitchen`
- `main` is the primary source branch and current live automatic-deployment branch
- `production` is maintained as a synchronized release branch and is enabled for Netlify branch deployments
- Both branches are kept at the same completed commit during normal releases
- The Netlify site is connected directly to GitHub
- GitHub deploy keys and Netlify notification hooks are configured
- A push to `main` automatically starts a Netlify production build
- Pull requests and enabled branches can receive Netlify branch/deploy-preview builds
- Manual Netlify deployment is not required during normal development
- Live production URL: `https://vaibhavis-kitchen.netlify.app`
- Netlify project dashboard: `https://app.netlify.com/projects/vaibhavis-kitchen`

## Required Netlify secrets

The following variable names must exist in the production context. Their values are deliberately omitted:

- `ADMIN_CREDENTIALS`
- `SESSION_SECRET`

## Project structure

```text
.
├── .gitignore
├── README.md
├── assets/
│   └── fonts/
│       ├── dm-sans.woff2
│       └── yatra-one.woff2
├── favicon.svg
├── index.html
├── netlify.toml
├── netlify/
│   └── functions/
│       ├── _auth.mjs
│       ├── auth.mjs
│       └── menu.mjs
├── package-lock.json
├── package.json
├── responsive.css
├── script.js
└── styles.css
```

## File responsibilities

- `index.html` — semantic content, customer interface, admin forms, favicon declaration, font preloads, and external contact/map links
- `styles.css` — brand palette, typography, cultural artwork, desktop layout, cards, modal styling, and admin components
- `responsive.css` — phone, tablet, laptop, large-screen, touch, and reduced-motion overrides
- `script.js` — default menu, search index, filtering, progressive loading, local fallback, admin interface, and API requests
- `favicon.svg` — scalable brand favicon and “V’s” monogram
- `assets/fonts/dm-sans.woff2` — self-hosted interface font
- `assets/fonts/yatra-one.woff2` — self-hosted display font
- `netlify/functions/_auth.mjs` — password verification, password storage, signed sessions, and cookie utilities
- `netlify/functions/auth.mjs` — login, session status, logout, and password-change endpoint
- `netlify/functions/menu.mjs` — public menu read and authenticated menu write endpoint
- `netlify.toml` — publish directory, function bundling, and caching headers
- `package.json` and `package-lock.json` — locked Netlify Blobs runtime dependency
- `.gitignore` — excludes macOS metadata, dependencies, Netlify local state, and log files

## Validation before release

- Run JavaScript syntax checks for browser and function files
- Run `git diff --check`
- Confirm no password, token, secret, or current credential hash is present in the staged source
- Verify login, logout, menu reads, rejected unauthorized writes, and password changes on HTTPS
- Verify search and category filters on phone and desktop widths
- Verify the admin modal remains closed on fresh loads and browser-history restoration
- Confirm `main` and `production` point to the intended release commit
- Confirm the GitHub-triggered Netlify build reaches the ready state
- Confirm the live favicon, fonts, cache headers, menu, and API endpoints respond successfully

## Documentation maintenance

Update this README in the same commit whenever a change affects features, content, styling, responsive behavior, contacts, location, performance, security, storage, APIs, dependencies, deployment, branches, project structure, administrator workflows, or customer behavior. Documentation updates are part of feature completion and must never include passwords or secret values.
