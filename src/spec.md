# Specification

## Summary
**Goal:** Replace all app branding imagery with an asset set generated from the uploaded “Tech Repair Logo with Blue and Gray.jpg”, including UI logo usage and HTML head metadata (favicon, apple touch icon, OG image).

**Planned changes:**
- Generate a complete logo asset set from the uploaded logo and add it under `frontend/public/assets/generated` using the exact required filenames (logo, favicons, apple touch icon, OG image), ensuring centered composition, no distortion, and adequate padding for legibility at small sizes.
- Update the site header logo and landing page hero logo to use `/assets/generated/kslab-logo.dim_512x512.png`.
- Update `frontend/index.html` to reference the generated favicon(s), apple-touch-icon, and `og:image`, and remove any remaining references to legacy logo assets.

**User-visible outcome:** The app displays the new uploaded logo consistently across the header and landing hero, and browser/tab icons plus social link previews use the new favicon/apple-touch/OG assets.
