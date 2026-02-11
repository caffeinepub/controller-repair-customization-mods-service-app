# Specification

## Summary
**Goal:** Update displayed service pricing, remove “Hydro dip finish,” and add a selectable service list with a live calculated total on the Service Request form, including passing the calculated estimate and selected services through submission.

**Planned changes:**
- Update the Landing page Pricing section to show the exact provided service names and fixed prices under the existing three categories (Repairs / Customization / Performance Mods), and remove “Hydro dip finish.”
- Add a selectable list of services to the Service Request form (using the same updated priced services) and display a live-updating numeric “Total,” with a clear $0 state when nothing is selected.
- Add “Controller cleaning” as a selectable service on the Service Request form, marked as “Price TBD” (or similar) and excluded from the numeric total.
- On Service Request submission, send the calculated total as the stored price estimate (formatted string) and append a readable list of selected services to the submitted description, while keeping Status Lookup/Admin detail displaying price estimates as before.

**User-visible outcome:** Visitors see updated fixed prices in the Pricing section, can select one or more services on the Service Request form to get an instant total (with “Controller cleaning” shown as not priced), and submitted requests include the selected services plus a stored calculated price estimate for admins to review.
