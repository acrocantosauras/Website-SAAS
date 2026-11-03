# Design direction — Revenue Practice (working label)

The business name is not finalized. **Revenue Practice** is a neutral, configurable placeholder and must be replaced when the business confirms its name. No client names, performance claims, pricing, or testimonials are assumed to be real.

## Research and evidence

The two supplied websites returned readable page content through the web reader. Their pages could not be opened in the available browser, so visual details and live interactions were not verified.

- [KYA SCENE](https://kyaasceneee.netlify.app/) uses community-first language, varied section headings, and a narrative sequence from upcoming events to participation. The accessible text supports those content observations, not a claim about its visual styling.
- [Meet Jadhav portfolio](https://portfolio.meetjadhav2003.workers.dev/) presents an indexed systems dossier, technical labels, and a staged workflow with selectable stages. The accessible content supports the information-architecture observation; browser inspection failed.
- [MotionSites](https://motionsites.ai/) exposed a catalog including “3D Portfolio” and “Anchor AI”, but the named examples in the brief (including Cyberpunk Reveal, SynapticForge, and NovaAI) were not verifiable in the accessible output. Search URLs returned 404. No conclusions are attributed to those examples.
- [Aceternity UI](https://ui.aceternity.com/) provides reusable landing-page components and blocks, including text effects and tracing-beam components. Its broad component library does not justify importing effects that do not solve this product’s needs.
- [Skiper UI](https://skiper-ui.com/) advertises source-owned shadcn components and attention to interface details. Its component listing was accessible, but component-level visual inspection was not.
- [ReactBits](https://www.reactbits.dev/) lists text, background, and interaction effects, including heavier WebGL/cursor treatments. The list informed the choice to avoid decorative effects rather than copy them.
- [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/) and [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) support sequenced animation, media-query scoping, cleanup, and reduced-motion handling. GSAP is not needed for the selected lightweight motion system.
- [Lenis](https://github.com/darkroomengineering/lenis) retains native scroll behavior and can synchronize complex scenes; this site has no such need. [Vanta](https://www.vantajs.com/) documents WebGL performance and mobile caveats. [Spline](https://docs.spline.design/) supports interactive 2D/3D authoring and publishing, but no meaningful 3D object is required by the product story.
- [juliobsz/skills Awwwards skill](https://github.com/juliobsz/skills) emphasizes concept-first art direction, real content, responsive accessibility, performance, and browser QA. [elayadesign/landing-page-design](https://github.com/elayadesign/ai-design-skills/tree/main/skills/landing-page-design) emphasizes a coherent content, type, spacing, and motion system. These were consulted as guidance, not installed.
- [morluto/rea](https://github.com/morluto/rea) is a software reverse-engineering toolkit, not a design skill; it is not appropriate to install for this work.

## Three creative directions

### 1. Editorial Revenue Practice — selected

- **Concept:** A thoughtful sales practice: human judgment is primary, AI is useful leverage.
- **Typography:** Editorial serif display faces paired with restrained, legible sans-serif body text; small uppercase labels act as navigation, not decoration.
- **Colour:** Warm paper, charcoal/ink, muted copper, and quiet sage. Avoid gradients and high-chroma “AI” palettes.
- **Layout:** Asymmetrical editorial grids, deliberate whitespace, strong rules, varied section proportions, and an unboxed process diagram.
- **Hero:** A decisive typographic statement linked to a simple sequence showing human-led closing, prospect research, and outreach drafting.
- **Motion:** Short, optional opacity/transform transitions and a single purposeful hover/focus response. Respect `prefers-reduced-motion`; do not intercept native scrolling.
- **Signature interaction:** A keyboard-accessible workflow sequence that reveals where human review sits in the prospecting-to-outreach path.
- **Fit:** Best combination of premium human credibility and clear product explanation without relying on fabricated evidence or visual noise.

### 2. Systems Field Manual

- **Concept:** Revenue operations as a legible system with named stages and clear ownership.
- **Typography:** Compact sans-serif, monospaced metadata, large numeric stage markers.
- **Colour:** Bone, graphite, slate, and restrained signal orange.
- **Layout:** Modular columns, table-like rows, process schematics, and aligned labels.
- **Hero:** A workflow map with inputs, decisions, and reviewed outputs.
- **Motion:** Stage highlighting and low-amplitude line drawing; reduced motion uses a static diagram.
- **Signature interaction:** Select a stage to inspect its input, owner, and output.
- **Fit:** Strong for the product demo and operational clarity, but too technical as the primary public brand expression.

### 3. Modern Operator’s Journal

- **Concept:** A narrative account of building and improving a sales practice.
- **Typography:** Warm grotesk body, literary serif headlines, and occasional handwritten annotations.
- **Colour:** Natural neutrals with deep forest green and clay.
- **Layout:** Image-led stories, large quote-like passages, and a long-form case-study rhythm.
- **Hero:** A documentary-style editorial image with a short point of view and service links.
- **Motion:** Subtle image crops and reveal transitions; static fallback for reduced motion.
- **Signature interaction:** A case-study timeline that progresses from challenge to decision to outcome.
- **Fit:** Human and approachable, but genuine imagery and approved customer evidence are not currently available.

## Selected system

### Brand assumptions

- Use **Revenue Practice** only as a working label, configured in one place. Do not treat it as the final company name.
- Describe services and AI products directly. Do not invent business contact details, account holders, integrations, customer outcomes, or commercial terms.
- Mark simulated workflows and sample data as demo content.

### Tokens

| Token | Value | Use |
|---|---|---|
| `paper` | `#F2EEE7` | Marketing canvas |
| `white` | `#FBFAF7` | Content surfaces |
| `ink` | `#18201E` | Primary text and actions |
| `muted` | `#59615C` | Supporting text |
| `copper` | `#A56F48` | Small emphasis and markers |
| `sage` | `#DDE5DD` | Calm operational status |
| `rule` | `#D1C5B7` | Dividers and structure |
| `app-canvas` | `#F4F5F2` | SaaS workspace |

Use the system serif stack for display and the existing sans stack for body/UI. Prefer rules and square/low-radius surfaces over repeated pill and rounded-card treatments.

### Product workflow components

- Keep the public-facing editorial identity and the internal demo workspace on the same ink, muted, copper, sage, and rule palette.
- Inputs share one high-contrast field treatment, visible focus, comfortable touch targets, and explicit labels. Tables use a quiet header fill, row rules, and horizontal overflow rather than hiding columns on narrow screens.
- Status labels are textual as well as color-coded. Validation summaries show accepted, invalid, duplicate, and empty rows before any action; exclusions remain visible with a reason.
- Results lead with real saved-run counts, searchable records, qualification rationale, editable outreach drafts, quality notes, and explicit review/download actions. Label every synthetic record and do not imply live enrichment or delivery.
- Use compact rectangular controls, deliberate typography hierarchy, and an even spacing rhythm; reserve sage and copper for supportive emphasis rather than large decorative backgrounds.

### Layout and motion principles

- Keep the public site editorial and human; keep the authenticated demo operational and direct.
- Use grids and typography—not decorative cards—to communicate relationships.
- Use native links, forms, and scroll; visible keyboard focus is required.
- Make motion progressive enhancement. Static content remains complete when animation is disabled or unsupported.
- Avoid GSAP, Lenis, Vanta, and Spline unless a later, specific interaction has a demonstrated need.

## Page composition plan

### Marketing

- **Home:** Brand point of view; human services; diagram of the two AI products and how they support sales work; one consistent agency CTA; separate AI product navigation.
- **Services:** Outsourced Closing and Fractional Sales Leadership described as human-led engagements, with no unsupported conversion claims.
- **Proof:** Approved case studies only. Until supplied, use an explicit availability placeholder rather than invented narratives.
- **Contact:** A single contact form approach; no fabricated email or booking URL.
- **AI Tools:** Separate Prospecting and Outreach descriptions, workflow, demo entry, and unconfirmed pricing label.

### AI product routes and application

- **Prospecting:** ICP form → review summary → simulated checkout → simulated processing → sample rows clearly labelled as illustrative → export.
- **Outreach:** CSV upload or pasted records → parsed preview → simulated checkout → simulated processing → generated demo drafts for review → export. Never send email.
- **Dashboard:** Recent activity and statuses, with sample/demo indicators and useful empty states instead of invented pipeline figures.
- **Batches:** Searchable history for demo-created prospecting and outreach runs, with result export.
- **Account:** Clearly labelled demo workspace; no real user, billing, security, or API claims.

## Implementation sequence and risks

1. Centralize the working brand label and design tokens; retain the existing Next.js App Router structure.
2. Refine public marketing pages with the editorial system and accurate content.
3. Add a typed mock service boundary for client-side demo operations; keep all integration behavior simulated.
4. Implement Prospecting and Outreach workflows, then connect Dashboard and Batches to the same mock records.
5. Test routes, mobile navigation, input errors, downloads, reduced-motion behavior, and production build in a browser.

The most important risk is presenting a prototype artifact as a verified business fact. Keep data and operations visibly marked as sample/demo until the business supplies approved details and real integrations.
