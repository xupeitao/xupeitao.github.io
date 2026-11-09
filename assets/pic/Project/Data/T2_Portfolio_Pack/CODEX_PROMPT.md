# Update the existing FRI Term 2 case study

Implement this change in the website repository open in VS Code. Read the repository instructions, inspect the working tree, and locate the existing `Data_FRI_T2.html` page and the extracted `T2_Portfolio_Pack` folder. The pack may be under my project documents folder. Use `T2_PAGE_COPY.md` as the page copy and `images/` as the source of the three figures.

## Page structure

Keep the existing T2 page URL, site navigation, portfolio typography, back link, and related-project navigation. Build one case-study page using this section order and these section anchors.

| Section | Anchor | Figure |
|---|---|---|
| Overview & My Role | `#overview` | |
| Dashboard Walkthrough | `#dashboard-walkthrough` | `01-t2-dashboard-walkthrough.svg` |
| System Architecture | `#system-architecture` | `02-t2-system-architecture.svg` |
| Databricks Workflow | `#databricks-workflow` | `03-t2-databricks-status-update.svg` |
| Results & Collaboration | `#results` | |

Set the document title and H1 from the pack. Put the intro and a **View Dashboard Walkthrough** link near the top. Add a compact in-page navigation list for the five sections. Keep existing inbound anchors where the repo uses them. Place the annotated dashboard figure ahead of the architecture figure. Place the technical details in a native `<details>` disclosure under Databricks Workflow and the synthetic QA example under Results & Collaboration.

## Figures and site integration

Copy the three supplied SVGs to `assets/pic/Project/Data/T2/`, or the equivalent project-specific asset folder if the repository layout has changed. Use the exact filenames, alt text, captions, width, and height from the pack. Use semantic `<figure>` and `<figcaption>` elements, responsive images, and a local full-size view link where it helps on a phone. Reuse the site’s existing components and styling. Scope any new CSS to the T2 case study.

Replace the live Tableau embeds and their open buttons, the T2 page’s Tableau profile button, and the embed help text and fallbacks with the local walkthrough. Remove the page’s Tableau initialization and fit logic once their references are gone. Replace the old architecture image reference with the simplified figure. Use the supplied synthetic figures and copy as the public materials. Keep the original presentations and operational screenshots in the working materials outside the published site. Preserve the distinction between the fictional workflow illustration and the actual project contribution.

## Validation

- Verify the five jump links, the primary link, the three image paths, the disclosure, and the existing navigation.
- Check the layout at desktop and phone widths, including image sizing and the line wrapping of the section links.
- Search the revised page source for Tableau workbook URLs, the organization’s Tableau profile link, embed tags, and stale embed initialization. The expected result for each is zero matches.
- Review `git diff --check` and the changed-file list. Limit changes to the T2 page, its three figures, and any page-specific styling needed.

Finish with local changes and a brief report of the files changed, checks run, and any item that needs review before publishing.
