# Update the FRI Term 2 portfolio page

Open the current website repository in VS Code. Read its instructions, inspect the working tree, and locate `Data_FRI_T2.html` and the extracted `T2_Portfolio_Pack` directory. Open `T2_PREVIEW.html` to see the revised page. Use `T2_PAGE_COPY.md` for the copy and slide references and `images/` for the flattened visuals.

Keep the existing project URL, portfolio header, back link, and related projects. Adapt the preview’s case-study body and styles to the site. Use the existing site layout and place the revised content inside it. The preview has a forest-green hero, a five-link section menu, a nine-view gallery, the original architecture and data model, and the workflow and outcomes figures.

| Order | Section | Anchor |
|---|---|---|
| 01 | Overview & My Role | `#overview` |
| 02 | Dashboard Walkthrough | `#dashboard-walkthrough` |
| 03 | System Architecture | `#system-architecture` |
| 04 | Databricks Workflow | `#databricks-workflow` |
| 05 | Results & Collaboration | `#results` |

Copy the 16 WebP files to the site’s T2 asset directory, such as `assets/pic/Project/Data/T2/`. Resolve paths relative to `Data_FRI_T2.html` and use the exact filename case. Use the preview’s captions, dimensions, and alt text. Keep the original seven-stage architecture and MU Code model, the original design gallery, and the reusable template board. Link the dashboard CTA to `#dashboard-walkthrough`. Preserve any inbound anchors in use elsewhere on the site.

Replace the old workbook embeds, open buttons, Tableau profile CTA, and embed help with the original-design walkthrough. Remove the page-specific Tableau scripts and dashboard fit code once the embed references are gone. Use only the supplied flattened images for the public case. Keep original PowerPoints and raw records in the working materials outside the published site. Preserve the visible labels where data and operational details were masked.

Keep the gallery keyboard operable and the selected image, title, caption, alternative text, and full-size link in sync. Scope CSS and JavaScript to the T2 page. Follow the site’s existing desktop and mobile navigation patterns. Check all five jump links, each gallery view, the image paths and full-size links, and the layout at desktop and phone widths. Search the updated page source for residual Tableau workbook and profile URLs, embeds, and initialization. Run `git diff --check` and report the local changes and verification results.
