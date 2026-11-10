# Maintaining the research catalogue

Edit `assets/data/research-publications.json`; cards are rendered by `assets/js/research-publications.js`. Serve the repository over HTTP (such as VS Code Live Server), since browsers restrict JSON fetches from `file://` pages. No build or additional dependency is required.

## Adding a verified record

1. Confirm the title, year, venue or patent number, and Peitao Xu's authorship/inventorship against a reliable source. Keep a source URL and record what it supports in `verificationNotes`.
2. Check for duplicate titles, translations, conference/journal versions, and patent application stages. Do not treat a changed title or A/B publication stage as an additional work automatically.
3. Add an object to `records` with a unique `id`, `type` (`journal`, `conference`, `patent`, `standard`, `article`, or `thesis`), `title`, numeric `year` (or null when unknown), `summary`, and three to five `keywords`. Optional fields include `venue`, `citation`, `authors`, `url`, `urlLabel`, `sourceType`, `patentNumber`, `patentType`, `patentStatus`, `statusSource`, `publicationDate`, `sourceDate`, `cnkiFileName`, `grantDate` (YYYY-MM-DD), `verificationStatus`, `verificationNotes`, and `featured`.
4. Use `CNKI Abstract`, `ProQuest Record`, `LinkedIn Record`, or `Google Patents Record` accurately. Do not label evidence pages as full text. Omit unavailable metadata or use null; missing links are not rendered. Unknown years sort last and display as Undated.
5. Preview `Publications.html`. Verify the new card, reverse chronological order, all category filters, title/year/keyword/number search, keyboard focus and mobile layout. Check links and source labels.

All visible catalogue content should be English. Summaries describe the research; they do not assign precise personal contributions. Rendered data is inserted as text, and source URLs are restricted to HTTP(S).

`featured` is editorial metadata for future use; the three current topic highlights are authored in HTML rather than generated claims about individual works. There are no citation metrics or profile publication totals.

## Profile configuration

Set `profiles.orcidUrl` to the complete verified ORCID profile URL when available. It is currently null, so no ORCID link is displayed. Google Scholar and LinkedIn links live in the hero and Explore My Research sections of `Publications.html`. The LinkedIn target is `https://www.linkedin.com/in/peitaoxu/details/publications/`. Inventor-search links have been removed from the page; each patent links directly to its English Google Patents record.

## Verification record (November 10, 2026)

The catalogue contains ten journal articles, one conference paper, one master’s thesis, one newsletter interview, two technical standards and twelve patent records. These are catalogue records, not a claim about the number of distinct inventions.

- The six filter buttons are ordered All Works, Journal Articles, Patents, Conference Papers, Technical Standards, Other Publications. The final filter includes the newsletter interview and master’s thesis, which retain their accurate individual type labels.
- Both Straits Publishing Group technical standards are dated 2021, as confirmed by the owner. Their url and urlLabel are null, so no LinkedIn or substitute link is displayed.
- A CNKI Overseas author search for the Chinese author name returned twenty records. Eleven are relevant structural-engineering works: nine journal articles, one conference paper and the master’s thesis. The nine medical records belong to a namesake and are excluded. All eleven engineering abstract pages were retrieved and matched to their CNKI identities and author lists.
- Every CNKI research work links directly to its own oversea.cnki.net/kcms2/article/abstract page with language=EN and uniplatform=OVERSEA. The source URLs were copied from the English results; do not replace them with LinkedIn or a generic search page. cnkiFileName retains a durable identity to help locate the work again if CNKI later rotates an encoded URL.
- The five additional CNKI works are the 2020 load-transfer paper, 2019 beam-hoisting paper, two 2018 equivalent-strut journal papers, and the 2018 valve-hall master’s thesis. Existing Fujian journal venue names, issue numbers and pages were checked against their English abstract records. The conference record is dated 2020-11-21 in CNKI.
- sourceDate stores the date shown in the CNKI results and is used for chronological ordering. It is not displayed as a print publication date: CNKI explicitly distinguishes online release dates from print dates. Publication years, volumes, issues and page ranges remain visible. Do not manufacture a full publication date when only a year or issue is confirmed.
- Seismic Behavior of an Inter-story Hinged Lateral Resistance Braced Frame is included as a 2023 journal article in Jordan Journal of Civil Engineering, 17(4), by Yu Ren, Yujun Wu and Peitao Xu. The owner-supplied ProQuest record was successfully retrieved; the official journal volume index confirms the author list. A targeted CNKI title search returned no result, so this record uses the supplied ProQuest permalink, accurately labelled ProQuest Record. No CNKI URL is invented for it.
- The newsletter interview (2016-01-10, Graduate Education Newsletter, issue 48) was supplied directly by the owner and retains its LinkedIn Record evidence link. It is distinct from the research-paper links above.
- Google Patents' public inventor search returned ten Chinese-name records and three English-name results. Exclude AU2023399184A1 (Data reading method and related apparatus), which the owner identified as another person's work. Its related data-reading patent family is also excluded.
- English pages were successfully retrieved for all twelve search records on November 10, 2026. Each lists Peitao Xu (Chinese or English name). Titles, application numbers, publication dates and reported statuses were checked against the pages. All public patent URLs end in /en. Google Patents may still show original inventor names or side-by-side source text on its English pages.
- The English search's ZA202200211B and ZA202304886B are included as South African jurisdictional records, with their relation to Chinese records documented.
- CN113123517A's timeline identifies the granted B-stage record, CN113123517B, dated 2025-12-23. Display B only. The direct B-stage request was rate-limited; its grant metadata was verified on the successfully retrieved English A-stage page.
- CN113508755B is now included: its inventor list explicitly includes Peitao Xu, and its grant/publication date is 2025-06-27. It is no longer an unverified candidate.
- Patent statuses are attributed to Google Patents and are not an independent legal determination.

## Deduplication and future reconciliation

- CN113123516A/B, CN113123517A/B, CN113508755A/B and CN115012549A/B are application/grant stages. Show each granted version once.
- Chinese invention applications, utility models and South African jurisdictional records have different application numbers. They may cover related systems; keep their identity clear rather than presenting them as distinct inventions.
- The older LinkedIn title Experimental and Numerical Study on the Structural Behavior of Close-fitted Composite Two-way Reinforced Concrete Slabs remains an alias of the 2023 paper, not an additional entry.
- The earlier incomplete CNKI inventory has been reconciled with the full author result set. Keep the eleven engineering records distinct from the nine medical namesake records. Add later works only after checking authorship, subject and institutional context.
- The original portfolio sheet contains historical material beyond this catalogue, including standards and reports. It remains intact with its full-size link. Its historical counts are not reused as current totals.

## Preserved asset

Original image SHA-256: `caa765e064c54929504bbbcf391ac60b37b82185801a8e22fad8cb7e6c755267`.
Do not resize, crop, recompress or overwrite this file. Responsive CSS uses its natural aspect ratio.
