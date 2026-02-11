# Specification

## Summary
**Goal:** Replace the app’s current logo everywhere with a resized asset set generated from the uploaded “Tech Repair Logo with Blue and Gray.png”, including proper favicon, Apple touch icon, and social preview support.

**Planned changes:**
- Generate a complete set of resized logo assets (UI logo, favicons, apple touch icon, Open Graph image) from the uploaded logo, ensuring centered placement, no distortion, and padding for small-size clarity.
- Update in-app logo references to use the new generated brand logo asset (at minimum in SiteHeader and LandingPage hero), removing usage of `/assets/generated/controller-logo.dim_512x512.png` for branding.
- Update `frontend/index.html` head tags to reference the new favicon assets, apple-touch-icon, and Open Graph social preview image.

**User-visible outcome:** The app shows the new “K’s Lab tech repair” logo in the header and landing hero, and browsers/social shares use the updated favicon and preview image.
