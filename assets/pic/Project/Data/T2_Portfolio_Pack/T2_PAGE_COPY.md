# FRI Term 2 Forest Inventory Dashboards

## Page header

| Field | Copy |
|---|---|
| Page title | FRI Term 2 Forest Inventory Dashboards |
| Intro | A Tableau dashboard series for reviewing LiDAR-derived forest inventories and comparing forest management units. |
| Primary link | View Dashboard Walkthrough |
| Project role | Primary dashboard developer |
| Tools | Tableau, Databricks, SQL, Python, Lakebase PostgreSQL, ArcGIS Pro |

## Overview & My Role

Ontario’s Forest Resources Inventory (FRI) program needed consistent maps and summaries to support review of Term 2 inventory across Forest Management Units (FMUs). The dashboard series gave forestry partners a way to find a unit, inspect LiDAR-derived stand metrics, and compare units during inventory review.

I was the primary dashboard developer. I built reusable Tableau templates with standardized calculations and filters. I worked with FRI scientists to review spatial and tabular data and with platform colleagues to develop the Databricks workflow.

## Dashboard Walkthrough

1. **Navigator.** Locate FMU A and check its review status.
2. **Single FMU.** Select stand height, then filter to the 40–59 year age class to explore the spatial distribution of the metric.
3. **Compare FMUs.** Apply the same metric, age class, and height ranges to FMU A and FMU B so the maps can be read side by side.

The example uses fictional units, boundaries, and values to show the layout and interactions.

## System Architecture

A shared FMU identifier relates inventory metadata to unit boundaries and LiDAR-derived stand records. Databricks prepares tabular data for Delta tables, and Lakebase PostgreSQL serves prepared spatial layers. Tableau uses those sources for maps and summaries, with reusable calculations and parameters configured for each unit.

## Databricks Workflow

In the example, a spreadsheet update changes FMU A’s status from **In preparation** to **Ready for review**. The illustrated checks cover the unit identifier, permitted status values, and one status row per unit. Databricks prepares the Delta record that the Navigator reads for that FMU.

### Technical Details

In the example model, the status table has one row per FMU. The spatial layer can contain multiple stands for the same unit. The shared FMU ID lets Tableau relate the datasets while keeping stand-level summaries at the appropriate level of detail.

## Results & Collaboration

The reusable template standardized calculations, map layouts, and filter behaviour across FMUs. I worked with FRI scientists to investigate unusual values and used feedback from forestry partners to refine the views for inventory review.

### QA example with synthetic data

Suppose a site-class category accounts for a larger share of FMU A in a new inventory. Start with the summary, locate the stands that drive the change, and check the source records and classification definitions before interpreting it as a change in forest conditions.

## Figure text

| Asset | Size | Alternative text | Caption |
|---|---|---|---|
| `01-t2-dashboard-walkthrough.svg` | 1440 × 790 | The Navigator locates FMU A, a single-unit map shows stand height by age class, and two maps compare FMU A and FMU B with shared filters. | Illustrative reconstruction with synthetic data. The same stand-height ranges are used in both comparison maps. |
| `02-t2-system-architecture.svg` | 1440 × 700 | Tabular inputs are prepared for Delta tables and spatial inputs for Lakebase PostgreSQL. Both feed Tableau views and share an FMU identifier. | Simplified architecture showing the tabular and spatial paths into Tableau. |
| `03-t2-databricks-status-update.svg` | 1440 × 680 | A fictional FMU A status update moves from a spreadsheet through validation and a Delta table to the Navigator. | Illustrative status update for FMU A using synthetic data. |

## Editorial notes for implementation

Publish the copy above through Results & Collaboration and use the figure text as image metadata. Use the short QA example inside Results & Collaboration and Technical Details inside an expandable section under Databricks Workflow. Keep the example labels visible on the page. The prepared copy uses qualitative results so that a verified and approved figure can be added later if appropriate.
