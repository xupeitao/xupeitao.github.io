# FRI Term 2 Forest Inventory Dashboards

## Page introduction

A Tableau dashboard series for exploring LiDAR-derived forest inventory and comparing results across forest management units.

**Role** Primary dashboard developer

**Tools** Tableau, Databricks, GIS

## Overview & My Role

Ontario’s Forest Resources Inventory (FRI) program uses a collaborative review process to prepare and deliver forest inventories. The Term 2 dashboard series brought the maps, LiDAR-derived stand measures, and review information together at the Forest Management Unit (FMU) level.

### What I built

As the primary dashboard developer, I built the Navigator, unit-level Tableau views, and comparison layouts. I designed reusable templates, calculated fields, and parameters so analysts could prepare new FMU views using the same structure.

### Who it supported

I worked with FRI scientists to review spatial patterns and unusual values. I also worked with platform colleagues on data preparation and used forestry partner feedback to refine the views for inventory review and delivery.

The original checkpoint diagram shows where remote-sensing validation and draft inventory review fit in the Term 2 process.

## Dashboard Walkthrough

The Navigator helps users locate a unit. The unit dashboard brings together species composition, stand metrics, and LiDAR maps. The comparison view lets reviewers apply the same controls to two units.

These are original design boards and screenshots. Unit identifiers, live map layers, and example values are masked where they appear.

- **FMU Navigator** · Users can switch map themes and check whether a dashboard is available for a unit. The original status cards explain each stage in the delivery process. (`02-dashboard-navigator.webp`)
- **Unit Overview** · A species map sits beside area and age-class summaries. Selecting a chart element narrows the view so a reviewer can look at one species at a time. (`02-unit-overview.webp`)
- **Stand Metrics** · The layout combines vertical structure, species, and site-class summaries. Filters help the reviewer compare stand measures within the selected unit. (`02-stand-metrics.webp`)
- **LiDAR Attributes** · The view pairs area-weighted stand averages with distributions by species and bin. Users can choose the metric, age group, site class, and bin size. (`02-lidar-attributes.webp`)
- **LiDAR by Age & Site Class** · The layout pairs stand-level mean values by age class with measures of variability and area distributions. The accompanying definitions help users interpret non-applicable site classes. (`02-age-site-class.webp`)
- **Map by LiDAR Metric** · The first panel selects the LiDAR metric. The second applies species, age, site class, and vertical structure filters so the reviewer can focus the map. (`02-lidar-metric-map.webp`)
- **FMU Comparison** · Both selected units stay in view. The shared metric and filter controls let users compare the same slice of inventory across the two maps. (`02-fmu-comparison.webp`)
- **About & Metadata** · The reference page keeps LiDAR attribute definitions, bin sizes, and species codes close to the analysis so reviewers can check how the values are classified. (`02-metadata.webp`)
- **Design Features** · Original color swatches, legend symbols, navigation treatments, and status icons establish a consistent visual language across the workbook. (`02-design-features.webp`)

## System Architecture

The original architecture follows the work from inventory inputs and spatial validation through transformation, storage, Tableau development, and delivery. It also shows where QA, version control, and publishing standards apply.

The architecture brings LiDAR-derived polygons, unit boundaries, disturbance layers, and imagery into a repeatable process for producing maps and reports.

### MU Code as the unit identifier

The FMU schedule supplies unit-level context. MU Code relates it to boundaries, reporting status, and stand and raster products. A single FMU can contain many stand records, so unit-level and stand-level measures are handled at their respective levels of detail.

The reporting model also distinguishes inventory periods, forest regions, and ownership classes so filters can narrow the scope of a review.

The model connects temporal and spatial classifications with the review products.

## Databricks Workflow

The workflow prepares tabular and spatial sources separately. Tableau uses the prepared tables for status and lookups and uses geometry layers for the inventory maps.

The design connects cloud storage, Databricks, Tableau Desktop, and delivery. The test workbook details are masked.

### Excel to Delta

The notebook reads workbook sheets, normalizes fields, and writes Delta tables for metadata and lookups. The Navigator reads the prepared status record for each FMU.

Original notebook with catalog and storage details masked.

### Shapefiles to Lakebase

Geometry preparation includes checking the spatial reference system and loading stand and unit layers into Lakebase PostgreSQL. Tableau uses the prepared geometry in unit maps.

Original spatial load and table preview with connection details and inventory records masked.

## Results & Collaboration

The reusable Tableau template gave analysts a consistent set of calculations, filters, and layouts for new units. It also gave reviewers familiar views when moving between units.

The original template board shows the layout, calculation rules, and parameters used to adapt the view to different FMUs.

### Review unusual values

I used summaries and maps together to compare inventory periods and locate stands for follow-up with FRI scientists.

### Refine the views

Feedback from forestry partners informed the placement of filters, comparison views, and reference material.

### Prepare the next unit

The template pairs common calculation logic with unit-specific inputs so the workflow can be repeated across FMUs.

## Figure sources

The figure files are flattened, cropped exports of the original materials. Use the captions and alternative text in `T2_PREVIEW.html`.

| Figure | Original slide |
|---|---|
| `01-review-checkpoints.webp` | Workflow architechture.pptx · 2 |
| `02-dashboard-navigator.webp` | FRI T2 Dashboard Overview.pptx · 6 |
| `02-unit-overview.webp` | FRI T2 Dashboard Overview.pptx · 8 |
| `02-stand-metrics.webp` | FRI T2 Dashboard Overview.pptx · 9 |
| `02-lidar-attributes.webp` | FRI T2 Dashboard Overview.pptx · 10 |
| `02-age-site-class.webp` | FRI T2 Dashboard Overview.pptx · 11 |
| `02-lidar-metric-map.webp` | FRI T2 Dashboard Overview.pptx · 12 |
| `02-fmu-comparison.webp` | FRI T2 Dashboard Overview.pptx · 7 |
| `02-metadata.webp` | FRI T2 Dashboard Overview.pptx · 13 |
| `02-design-features.webp` | FRI T2 Dashboard Overview.pptx · 14 |
| `03-system-architecture.webp` | Workflow architechture.pptx · 4 |
| `03-mu-code-data-model.webp` | Workflow architechture.pptx · 5 |
| `04-databricks-workflow.webp` | Databricks to Tableau_10_08_2026 - Copy.pptx · 6 |
| `04-excel-to-delta.webp` | Databricks to Tableau_10_08_2026 - Copy.pptx · 7 |
| `04-shapefile-to-lakebase.webp` | Databricks to Tableau_10_08_2026 - Copy.pptx · 9 |
| `05-reusable-template.webp` | Workflow architechture.pptx · 6 |
