# InVaal [016]

**Community • Business • Media • Opportunities**

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](#-project-status)
[![Hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-blue)](#-deployment)
[![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)](#-technology-stack)
[![Data](https://img.shields.io/badge/data-JSON-green)](#-data-architecture)

> **Building digital visibility for the Vaal community.**

---

## 📖 About

**InVaal [016]** is a community-focused digital platform being developed to connect people, local businesses, creatives, events, opportunities, and information across the Vaal Triangle.

The platform is designed around a **static-first architecture**, allowing useful digital services to be developed without requiring an expensive backend or database during the early stages.

The long-term vision is to develop InVaal [016] into a local digital ecosystem supporting:

* 🏪 Local businesses
* 📰 Community news
* 📅 Events
* 💼 Jobs and opportunities
* 🎨 Creatives
* 🎵 Artists and musicians
* 📣 Business promotion
* 🤝 Community projects
* 💻 Digital services
* 📍 Local resources

---

# 🚦 Project Status

**Status:** 🟡 In Development

The project is actively being developed.

Some systems are currently static or experimental and may change as the platform architecture evolves.

### Current focus

* [x] Core website structure
* [x] Static HTML pages
* [x] JSON-based data
* [x] Business directory architecture
* [x] Business consent validation
* [x] Business logos
* [x] Featured businesses
* [x] Business verification display
* [x] Homepage business listings
* [x] Full business directory
* [ ] Business search
* [ ] Category filtering
* [ ] Town filtering
* [ ] Business submission system
* [ ] Business claiming
* [ ] Administration interface
* [ ] Database-backed platform

---

# 🧰 Technology Stack

The project intentionally uses a lightweight web stack.

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| HTML5           | Page structure                |
| CSS3            | Styling and responsive design |
| JavaScript ES6+ | Application logic             |
| JSON            | Structured data               |
| Git             | Version control               |
| GitHub          | Repository and collaboration  |
| GitHub Pages    | Static deployment             |

The project currently does **not** require:

* React
* Vue
* Angular
* Node.js build tooling
* A database
* A traditional backend

The architecture can evolve toward these technologies later if the platform requires them.

---

# 🏗️ Architecture

InVaal [016] currently follows a **static-first architecture**.

```text
┌─────────────────────┐
│      HTML Pages     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     CSS Styling     │
└─────────────────────┘

           +

┌─────────────────────┐
│   JavaScript ES6+   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      JSON Data      │
└─────────────────────┘
```

This approach provides:

* Low hosting costs
* Simple deployment
* Minimal dependencies
* Easy maintenance
* GitHub Pages compatibility
* A clear upgrade path

---

# 📁 Project Structure

The project follows a separation between pages, data, JavaScript, styling, assets, and administrative information.

```text
InVaal-016/
│
├── index.html
├── README.md
│
├── pages/
│   ├── businesses.html
│   │
│   └── businesses/
│       └── business-name.html
│
├── data/
│   ├── businesses.json
│   ├── news.json
│   └── jobs.json
│
├── admin-data/
│   └── business-content.json
│
├── js/
│   └── loaders/
│       └── business-loader.js
│
├── css/
│   └── ...
│
└── assets/
    ├── images/
    └── logos/
```

The structure may expand as additional features are introduced.

---

# 🗃️ Data Architecture

The website separates **data** from **presentation logic**.

For example:

```text
data/
    businesses.json
```

contains business information.

The JavaScript loader:

```text
js/loaders/business-loader.js
```

is responsible for reading that information and displaying it.

This prevents business records from being hard-coded directly into HTML or JavaScript.

---

# 🏪 Business Directory

The business directory is one of the core systems of InVaal [016].

The directory is designed around three major components:

```text
Business Data
     │
     ▼
Consent Data
     │
     ▼
Business Loader
     │
     ▼
Public Directory
```

### Business data

```text
/data/businesses.json
```

### Consent data

```text
/admin-data/business-content.json
```

### Business loader

```text
/js/loaders/business-loader.js
```

---

# 🔐 Business Consent System

A business should **not automatically become publicly listed simply because its information exists in the business data file**.

The project therefore separates:

1. Business information
2. Business status
3. Consent status

A business must pass all required publishing checks.

```text
Business
   │
   ├── Valid record
   │
   ├── status = active
   │
   └── consent = approved
           │
           ▼
      PUBLIC LISTING
```

The loader checks for an explicit approved consent record before displaying a business publicly.

---

# 🧾 Business Data

Business records are stored in:

```text
data/businesses.json
```

A business can contain fields such as:

```json
{
  "id": "business-001",
  "name": "Example Business",
  "slug": "example-business",
  "category": "food",
  "description": "A local business serving the Vaal community.",
  "status": "active",
  "featured": false,
  "verified": false,
  "logo": "./assets/logos/example-business.png",
  "images": [
    "./assets/images/example-business.jpg"
  ],
  "location": {
    "town": "Vanderbijlpark",
    "area": "Example Area"
  }
}
```

Additional fields can be introduced as the business directory develops.

---

# 📝 Consent Data

Consent records are stored separately:

```text
admin-data/business-content.json
```

The business ID connects the two records.

Example:

```json
{
  "consentRecords": [
    {
      "businessId": "business-001",
      "status": "approved"
    }
  ]
}
```

The loader searches for a matching:

```text
businessId
```

and requires:

```text
status = approved
```

before publishing the business.

---

# 🧠 Business Loader

The main directory logic is contained in:

```text
js/loaders/business-loader.js
```

The loader is responsible for:

* Loading business data
* Loading consent records
* Validating business records
* Checking publishing eligibility
* Detecting the current page
* Rendering homepage listings
* Rendering the complete directory
* Displaying business logos
* Displaying business images
* Displaying categories
* Displaying locations
* Displaying verification status
* Highlighting featured businesses
* Creating business-page links

---

# 🔄 One Loader, Multiple Pages

The project intentionally uses **one business loader** instead of maintaining separate loaders for every page.

```text
                 business-loader.js
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
        index.html          pages/businesses.html
             │                       │
             ▼                       ▼
        First 6 listings       Full directory
```

This reduces duplication and makes future changes easier.

---

# 🏠 Homepage Directory

The homepage provides a preview of the business directory.

Only the first six publishable businesses are displayed.

```javascript
businesses.slice(0, 6)
```

The homepage therefore acts as a discovery area rather than the complete directory.

Visitors can follow the business-directory link to see more businesses.

---

# 📚 Full Business Directory

The complete directory is located at:

```text
pages/businesses.html
```

Unlike the homepage, the full directory renders all businesses that pass the publishing checks.

```text
status = active
        +
consent = approved
        +
valid record
        =
publishable business
```

---

# 🖼️ Business Branding

Businesses can have their own logo.

Example:

```json
"logo": "./assets/logos/example-business.png"
```

Businesses can also provide listing images:

```json
"images": [
  "./assets/images/business-front.jpg",
  "./assets/images/business-inside.jpg"
]
```

The loader supports:

| Logo | Image | Result         |
| ---- | ----- | -------------- |
| ✅    | ✅     | Image + logo   |
| ✅    | ❌     | Logo           |
| ❌    | ✅     | Image          |
| ❌    | ❌     | Text-only card |

This means a business does not need professional photography before it can eventually have a directory listing.

---

# ⭐ Featured Businesses

Businesses can be marked as featured:

```json
"featured": true
```

Featured businesses are sorted before normal listings.

The loader adds:

```text
is-featured
```

to the business card.

CSS can then visually distinguish featured listings.

This provides a foundation for future promotional products such as:

* Featured listings
* Sponsored placement
* Promotional packages
* Business advertising

Any commercial implementation should be introduced with clearly defined policies.

---

# ✓ Business Verification

A business may contain:

```json
"verified": true
```

When enabled, the directory displays:

```text
✓ Verified
```

### Consent vs Verification

These concepts have different meanings.

**Consent**

> Permission to publish the business information.

**Verification**

> Confirmation that the platform has completed its defined verification process.

Therefore:

```text
Approved + Unverified
```

is possible.

And:

```text
Approved + Verified
```

is also possible.

Verification should only be applied once InVaal [016] has an established verification procedure.

---

# 🔗 Business Profile Pages

Each business can eventually have its own dedicated page.

Expected structure:

```text
pages/
└── businesses/
    ├── business-one.html
    ├── business-two.html
    └── business-three.html
```

The business record contains a slug:

```json
"slug": "business-one"
```

The loader can then generate:

```text
View business →
```

links automatically.

---

# 📍 Location Data

Business locations are structured rather than stored as one large string.

Example:

```json
"location": {
  "town": "Vanderbijlpark",
  "area": "Example Area"
}
```

This provides a foundation for future functionality such as:

* Town filtering
* Area filtering
* Google Maps integration
* Local search
* Location-based discovery

---

# 🛡️ Security

Security is considered part of the project's architecture rather than something added later.

## No `eval()`

The project should not use:

```javascript
eval()
```

or:

```javascript
new Function()
```

The project should also avoid passing JavaScript source strings into:

```javascript
setTimeout()
```

or:

```javascript
setInterval()
```

This is particularly important when using a restrictive Content Security Policy.

---

# 🔒 Content Security Policy

The website may use Content Security Policy restrictions to reduce the impact of certain injection attacks.

The preferred approach is to write JavaScript that works within the CSP.

Do **not** solve CSP problems by automatically adding:

```text
unsafe-eval
```

Instead:

1. Identify what is attempting string evaluation.
2. Remove the unnecessary dependency or code.
3. Replace it with normal JavaScript.
4. Only consider a CSP change when there is a genuine architectural reason.

---

# 🧱 DOM Safety

Business data is inserted using DOM APIs.

For example:

```javascript
element.textContent = business.name;
```

This is preferable to injecting external data through:

```javascript
element.innerHTML = business.name;
```

Using `textContent` helps prevent business-provided content from being interpreted as HTML.

---

# 🧪 Validation

Before a business can be published, the loader checks the minimum required structure.

The current validation expects information such as:

* Business ID
* Business name
* Category
* Location
* Town

The business must also have:

```text
status = active
```

and:

```text
consent.status = approved
```

---

# 🧑‍💻 Development Data

During development, demonstration businesses may be used.

Demo/test records should be clearly identifiable.

Development data should **never be confused with real business information**.

Before publishing a real business listing, the appropriate consent process should be completed.

---

# ⚖️ Privacy and Consent Principles

InVaal [016] should collect and publish business information responsibly.

Before publishing information belonging to a real business, the project should establish:

* What information is being collected
* Why the information is being collected
* What information will be publicly displayed
* How businesses can request corrections
* How businesses can request removal
* How consent is recorded
* Who manages the information

The platform should avoid collecting or publishing unnecessary personal information.

---

# 🌍 Geographic Focus

The initial geographic focus is the **Vaal Triangle**.

The platform is intended to support communities around:

* Vanderbijlpark
* Vereeniging
* Sasolburg

The geographic model can expand in the future.

---

# 📰 Other Data Systems

The same JSON-based architecture can support other sections of the platform.

Potential data sources include:

```text
data/
├── businesses.json
├── news.json
└── jobs.json
```

This allows different sections of the website to use the same general principle:

```text
JSON Data
    ↓
JavaScript Loader
    ↓
HTML Interface
```

---

# 🚀 Deployment

The intended initial deployment platform is:

**GitHub Pages**

The static architecture makes GitHub Pages suitable because the website does not currently require server-side processing.

Typical deployment flow:

```text
Local Development
       │
       ▼
      Git
       │
       ▼
     GitHub
       │
       ▼
 GitHub Pages
       │
       ▼
   Public Website
```

---

# 💻 Local Development

Because the project uses JavaScript `fetch()` requests for JSON files, it should preferably be tested through a local web server rather than opening HTML files directly with:

```text
file://
```

For example:

```text
http://localhost/
```

This more closely matches how the website behaves when deployed.

---

# 🧹 Code Quality Principles

When adding new functionality:

### Prefer

* Small reusable functions
* Clear variable names
* ES6+ JavaScript
* Separation of concerns
* DOM APIs
* `textContent` for external data
* Reusable loaders
* Data-driven rendering
* Comments explaining how important code works

### Avoid

* Duplicate loaders
* Unnecessary dependencies
* Inline JavaScript
* `eval()`
* `new Function()`
* Unsafe HTML injection
* Hard-coded business records
* Publishing unapproved business information

---

# 🔄 Development Workflow

A simple development workflow is recommended:

```text
1. Plan
   ↓
2. Build
   ↓
3. Test locally
   ↓
4. Check browser console
   ↓
5. Check mobile layout
   ↓
6. Review security
   ↓
7. Commit
   ↓
8. Push to GitHub
   ↓
9. Verify GitHub Pages
```

---

# 🧪 Business Directory Testing Checklist

Before committing business-directory changes:

### Data

* [ ] `businesses.json` loads
* [ ] Consent data loads
* [ ] Invalid records are ignored
* [ ] Inactive businesses are ignored
* [ ] Businesses without approved consent are ignored
* [ ] Approved businesses are displayed

### Cards

* [ ] Business name displays
* [ ] Category displays
* [ ] Description displays
* [ ] Location displays
* [ ] Logo displays
* [ ] Images display
* [ ] Verification badge works
* [ ] Featured styling works

### Links

* [ ] Business profile links work
* [ ] Homepage links work
* [ ] Directory links work

### Homepage

* [ ] Maximum six businesses display
* [ ] Empty state works
* [ ] No JavaScript errors

### Directory

* [ ] All publishable businesses display
* [ ] Empty state works
* [ ] No JavaScript errors

### Security

* [ ] No `eval()`
* [ ] No `new Function()`
* [ ] No unnecessary inline JavaScript
* [ ] No unsafe HTML injection
* [ ] CSP remains functional

---

# 🗺️ Roadmap

## Phase 1 — Foundation

* [x] Static website
* [x] Core pages
* [x] JSON data
* [x] GitHub repository
* [x] GitHub Pages deployment

## Phase 2 — Business Directory

* [x] Business data model
* [x] Consent records
* [x] Business loader
* [x] Homepage listings
* [x] Full directory
* [x] Business logos
* [x] Business images
* [x] Featured businesses
* [x] Verification display
* [ ] Individual business profiles

## Phase 3 — Discovery

* [ ] Search
* [ ] Category filtering
* [ ] Town filtering
* [ ] Area filtering
* [ ] Improved business profiles
* [ ] Google Maps integration
* [ ] WhatsApp/contact integration

## Phase 4 — Business Participation

* [ ] Business submission
* [ ] Business claiming
* [ ] Business editing
* [ ] Consent workflow
* [ ] Verification workflow

## Phase 5 — Administration

* [ ] Admin interface
* [ ] Content moderation
* [ ] Business management
* [ ] Consent management
* [ ] Analytics

## Phase 6 — Platform Infrastructure

When the static architecture becomes insufficient:

* [ ] Backend
* [ ] Database
* [ ] Authentication
* [ ] API
* [ ] User accounts
* [ ] Advanced administration

---

# 💡 Long-Term Vision

The goal is not simply to create another website directory.

InVaal [016] is intended to become a **local digital platform** where people can discover and interact with their community.

Potential future ecosystem:

```text
                  InVaal [016]
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
   Businesses        Media          Community
       │               │               │
       ▼               ▼               ▼
   Services          News           Events
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
                 Opportunities
                       │
                       ▼
                  Local Growth
```

---

# 🤝 Contribution Guidelines

As the project develops, contributions should follow these principles:

1. Keep the code understandable.
2. Avoid unnecessary duplication.
3. Keep data separate from presentation logic.
4. Protect business and personal information.
5. Do not publish business information without appropriate consent.
6. Prefer reusable functions.
7. Keep the website responsive.
8. Maintain accessibility.
9. Avoid unnecessary dependencies.
10. Test changes before pushing them.

---

# 📄 Licence

The project's final licensing model has not yet been formally defined.

Until an explicit licence is added, do not assume that the project's:

* Code
* Branding
* Artwork
* Content
* Business data
* Documentation

is available for unrestricted reuse.

---

# 📌 Project Information

| Item             | Details                                      |
| ---------------- | -------------------------------------------- |
| **Project**      | InVaal [016]                                 |
| **Focus**        | Community • Business • Media • Opportunities |
| **Region**       | Vaal Triangle, South Africa                  |
| **Architecture** | Static-first                                 |
| **Frontend**     | HTML5 • CSS3 • JavaScript                    |
| **Data**         | JSON                                         |
| **Hosting**      | GitHub Pages                                 |
| **Repository**   | In development                               |

---

# 📣 InVaal [016]

> **Building digital visibility for the Vaal community.**

**Community. Business. Media. Opportunities.**

---
