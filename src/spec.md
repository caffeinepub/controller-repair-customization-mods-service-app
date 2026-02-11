# Specification

## Summary
**Goal:** Simplify the Controller Platform selector on the Service Request form by merging Nintendo and PC controller choices into the existing “Other” option.

**Planned changes:**
- Update the Service Request page’s Controller Platform dropdown to remove the options for “Nintendo Switch Pro”, “Nintendo Switch Joy-Con”, and “PC/Generic”.
- Ensure the “Other” option remains available and continues to submit as `Platform: Other` in the description payload.

**User-visible outcome:** On the Service Request page, users no longer see separate Nintendo or PC controller platform options and can choose “Other” instead; submitting with “Other” continues to work as before.
