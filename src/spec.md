# Specification

## Summary
**Goal:** Display the business phone number in the footer “Support / Contact Us” section as a clickable phone link.

**Planned changes:**
- Update the footer Support/Contact Us content (frontend/src/components/SiteFooter.tsx) to show the phone number **1-242-821-0504**.
- Render the phone number as a clickable `tel:` link (e.g., `href="tel:+12428210504"`) and ensure it remains readable in both light and dark themes.

**User-visible outcome:** Users can see **1-242-821-0504** in the footer Support/Contact Us area and tap/click it to initiate a phone call.
