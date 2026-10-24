// ============================================================
// PORTFOLIO CONFIG: schema v2 (frozen keys, see exec spec section 3)
// Everything on the site is driven by this single object.
// Content rule: no number appears here that is not already in the
// pre-v2 config or the writer's brief. Unknown measurements are omitted.
// ============================================================

// Declared with var so the object is reachable from node checks that eval this
// file. In the browser this is still a single global that script.js reads.
var PORTFOLIO = {

  // --- Personal ---
  personal: {
    name: "Idzharul Huda",
    initials: "ih",
    title: "Data Infrastructure Engineer",
    email: "hello@idzharulhuda.com",
    linkedin: "idzharulhuda",
    github: "idzharulhuda13",
    location: "Jakarta, Indonesia",

    // Not part of the frozen key list; optional extras that the About facts list
    // reads. The renderer skips either one when it is empty.
    focus: "Data infrastructure: analytics engineering, pipeline cost optimization, and delivery into the tools people already use",
    timezone: "Asia/Jakarta (UTC+7)",

    // Hero h1: positioning, not a job title
    headline: "Data platforms built end to end: ingestion, warehouse, orchestration, and the reports people open every day.",

    // Mono eyebrow
    availability: "Independent data and analytics engineering practice, run by Idzharul Huda",

    // Set when a real PDF exists; the CTA is skipped while this is empty
    productLabel: "RaschLab",
    productUrl: "https://raschlab.idzharulhuda.com",
    resumeUrl: "resume.pdf",

    // Hero lead
    tagline: "I build new data platforms from scratch and fix the ones already running. At Rey.id I lead the batch analytics platform: 121 tables ingested hourly, 599 dbt models, and 908 automated data tests. RaschLab, my psychometric analysis platform, is the product side of the same work.",

    // About prose
    bio: [
      {
        text: "I'm a Data Infrastructure Engineer who builds both the pipelines and the delivery layer around them. I engineer data systems that deliver insights wherever people need them: dashboards, spreadsheets, email, APIs, and chat.",
        highlights: ["the pipelines and the delivery layer around them", "dashboards, spreadsheets, email, APIs, and chat"]
      },
      {
        text: "At Rey.id, I cut BigQuery slot time on the reporting datamart by 96% and made the same model run 9x faster, built automated data quality checks that cut manual error resolution by 50%, and pioneered a dbt + Metabase framework that enabled 40+ stakeholders to self-serve analytics.",
        highlights: ["96% less slot time", "50%", "40+ stakeholders"]
      },
      {
        text: "Previously as an AI Engineer at Olvo.ai, I built OCR and LLM pipelines that digitized thousands of hardcopy documents into structured datasets.",
        highlights: ["Olvo.ai", "OCR and LLM pipelines"]
      },
      {
        text: "My goal is to create scalable, trustworthy data systems that empower teams to move faster with confidence.",
        highlights: []
      }
    ]
  },

  // --- Impact metrics: value and unit are separate strings ---
  metrics: [
    {
      value: "96",
      unit: "%",
      label: "less BigQuery slot time on the datamart the reports depend on",
      scope: "one production datamart model, same query and data volume before and after",
      source: "query audit, 2024",
      delta: {
        before: { value: "100", note: "slot time indexed to 100 on the original full-scan query" },
        after: { value: "4", note: "residual slot time after the rewrite" }
      }
    },
    {
      value: "9",
      unit: "x",
      label: "faster processing on that same datamart model",
      scope: "full-refresh run, same data volume",
      source: "query audit, 2024",
      delta: {
        before: { value: "1x", note: "baseline runtime of the original query" },
        after: { value: "9x", note: "after repartitioning and clustering" }
      }
    },
    {
      value: "599",
      unit: "",
      label: "dbt models in production, with 908 automated data tests",
      scope: "404 models write a physical table each run, 190 are inlined, 5 build incrementally; 233 models rebuild hourly and 124 daily",
      source: "platform measurement, Sep 2026",
      delta: null
    },
    {
      value: "121",
      unit: "",
      label: "tables refreshed every hour",
      scope: "about 2,900 table loads a day across 25 ingestion pipelines and 159 source tables in 7 groups; every load is a change-set with a 2-hour look-back window",
      source: "platform measurement, Sep 2026",
      delta: null
    },
    {
      value: "3.5",
      unit: "TB/day",
      label: "scanned in the warehouse, fully on-demand",
      scope: "about 105 TB a month; the warehouse holds 2.7 TB and 1.5 bn rows across roughly 3,800 tables in 28 datasets",
      source: "platform measurement, Aug-Sep 2026",
      delta: null
    }
  ],

  // --- Work projects (kind: "work") ---
  projects: [
      {
        title: "Internal Data Request and Catalogue Platform",
        description: "A platform for teams outside the data function to file, follow and audit data requests, with the asset catalogue and pipeline health in the same place. It holds no warehouse credentials: Airflow pushes the manifest, run results, catalogue and freshness into it, and the asset graph is reconciled as a snapshot with soft deletes.",
        outcome: "127 requests tracked end to end over three months, 49 of them in the busiest month, with 854 assets and 1,670 lineage edges kept current.",
        tech: ["FastAPI", "Postgres", "Jinja", "Airflow", "dbt"],
        githubUrl: "",
        detailUrl: "projects/internal-data-request-platform.html"
      },
    {
      title: "BigQuery Pipeline Optimization",
      description: "Optimized a datamart model to run 9x faster, cutting BigQuery slot time by 96%+ and data shuffled by 58%. Redesigned the partitioning strategy on event_date and added clustering keys on high-cardinality filter columns to bring compute cost down.",
      outcome: "One datamart model: 9x faster, 96% less slot time, 58% less data shuffled.",
      tech: ["BigQuery", "SQL", "Partitioning", "Clustering", "Cost Optimization"],
      githubUrl: "",
      detailUrl: "projects/bigquery-pipeline-optimization.html"
    },
    {
      title: "Dataverse: Conversational AI Analytics",
      description: "LLM-powered analytics platform that lets users query datasets (CSV, Excel, Parquet) in natural language. Automated data cleaning, SQL generation, and visualization: a headless data product that returns results without a dashboard.",
      outcome: "Upload a dataset, ask in plain language, get SQL and charts: no analyst in the loop.",
      tech: ["LLM", "Python", "Streamlit", "Pandas", "SQL Generation"],
      githubUrl: "https://github.com/idzharulhuda13/dataverse",
      detailUrl: "projects/dataverse-conversational-ai-analytics.html"
    },
    {
      title: "DBT + Metabase Self-Serve Analytics",
      description: "Pioneered a dbt + Metabase framework enabling 40+ stakeholders to self-serve analytics without analyst intervention. Migrated 50+ reports from manual Google Sheets workflows to automated BigQuery pipelines.",
      outcome: "50+ reports moved to BigQuery, daily to hourly, with 40+ stakeholders self-serving.",
      tech: ["dbt", "BigQuery", "Metabase", "SQL"],
      githubUrl: "https://github.com/idzharulhuda13/Analytics-Engineering-Portfolio",
      detailUrl: "projects/dbt-metabase-self-serve-analytics.html"
    },
    {
      title: "OCR + LLM Document Digitization",
      description: "Digitized thousands of hardcopy documents using OCR, YOLO, and GPT-4, with a 70% efficiency improvement. Built the real-time demo app used in the client evaluation.",
      outcome: "Thousands of hardcopy documents digitized, 70% efficiency gain, client evaluation demo shipped.",
      tech: ["Python", "YOLO", "GPT-4", "OCR", "Streamlit"],
      githubUrl: "",
      detailUrl: ""
    },
    {
      title: "Automated Data Quality Framework",
      description: "Built end-to-end data quality checks and automated discrepancy detection, cutting manual error resolution by 50%. Enforced ISO 27001:2022 aligned data handling standards across analytics workflows.",
      outcome: "Automated checks and discrepancy detection: 50% less manual error resolution.",
      tech: ["dbt tests", "BigQuery", "Python", "Airflow"],
      githubUrl: "",
      detailUrl: ""
    },
    {
      title: "Telehealth Cost-Effectiveness Study",
      description: "Published paper showing telehealth-powered managed care was 7x more cost-effective than conventional care for Acute Respiratory Infection (ARI).",
      outcome: "Telehealth managed care at 7x the cost-effectiveness of conventional care for ARI.",
      tech: ["Research", "Statistical Analysis"],
      githubUrl: "",
      detailUrl: "projects/telehealth-cost-effectiveness-study.html"
    }
  ],

  // --- Side builds (same object shape as projects) ---
  sideBuilds: [
    {
      title: "Hourly Incentive Reporting Pipeline",
      description: "Multi-source sync that pulls eight SQL cards from Metabase and Zoho Analytics into a single Google Sheets workbook on an hourly trigger. The SQL for every card is version-controlled in the repo and the BI tool is only the runner; the sheet tabs are the read surface. Weekly rows are frozen once a week closes, so a late-arriving change shows up as an audited divergence instead of silently rewriting history.",
      outcome: "Eight analytics feeds, hourly, into one workbook: every divergence audited.",
      tech: ["Google Apps Script", "Metabase", "Zoho Analytics", "SQL", "Google Sheets"],
      githubUrl: "",
      detailUrl: "projects/hourly-incentive-reporting-pipeline.html"
    },
    {
      title: "Incentive Performance Dashboard",
      description: "Google Apps Script web app over the same workbook: pick a week, get per-person and per-team performance: sales, quotes, mechanization, collections, restructuring, targets, achievement percentages, status and bonus. Read-only by design: no business logic in the web app, and the diagnostics panel reports a missing or renamed column instead of quietly returning zeros.",
      outcome: "One URL that answers the current incentive week without spreadsheet wrangling.",
      tech: ["Google Apps Script", "JavaScript", "Google Sheets", "Web App"],
      githubUrl: "",
      detailUrl: "projects/incentive-performance-dashboard.html"
    },
    {
      title: "RaschLab engine",
      description: "The Python engine behind RaschLab, the web platform listed under Products: it reproduces the output of a legacy item-response-analysis tool on real assessment datasets, so old and new results can be compared row by row instead of by eye.",
      outcome: "The engine behind RaschLab, checked row by row against a legacy tool on real datasets.",
      tech: ["Python", "Item Response Theory", "Rasch model", "Statistical parity"],
      githubUrl: "",
      detailUrl: "projects/raschlab.html"
    },
    {
      title: "Clinic Incentives Dashboard",
      description: "Google Apps Script and Sheets dashboard for a dental clinic: a Config tab holds the targets and period settings, and the incentive figures are computed by formulas off the entry data rather than by hand.",
      outcome: "Apps Script + Sheets dashboard with a Config tab and formula-driven incentive targets.",
      tech: ["Google Apps Script", "Google Sheets", "Formula dashboard"],
      githubUrl: "",
      detailUrl: "projects/clinic-incentives-dashboard.html"
    }
  ],

  // --- Experience ---
  // The timeline renders details[0] as the lead line plus the next two entries as
  // results (EXPERIENCE_POINTS_PER_ROLE in script.js). Order each list strongest
  // evidence first; anything past the third entry is a record, not a display.
  experience: [
    {
      role: "Analytics and Reporting Lead",
      company: "Rey.id",
      companyUrl: "https://rey.id",
      location: "Jakarta, Indonesia",
      period: "Aug 2026 - Present",
      details: [
        "Lead the analytics and reporting function and own the batch analytics platform behind client reporting",
        "Run the platform end to end: 25 ingestion pipelines, 21 of them hourly, loading 121 tables (about 2,900 table loads a day) into BigQuery with a change-set merge and a 2-hour look-back window",
        "Maintain 599 dbt models and 908 automated data tests: 233 models rebuild hourly, 124 daily, all transformation as SQL inside the warehouse (no Spark), run from git through GitHub Actions",
        "Added a daily completeness check that compares what each pipeline claims it built against what BigQuery actually changed, so a job that reports success but writes nothing is caught",
        "Kept the platform fully on-demand: 3.5 TB scanned a day (about 105 TB a month)",
        "Deliver client reports as files staged to Cloud Storage and pushed to SFTP or email, with per-contract password archives and cleanup after each run",
        "Instrumented the storage estate (2.7 TB, 1.5 bn rows, about 3,800 tables) and kept storage and processing inside the Jakarta region for Indonesian PDP and ISO 27001 alignment"
      ],
      techTags: ["Airflow", "dbt", "BigQuery", "Cloud Storage", "Looker Studio", "Metabase", "Dataplex", "GitHub Actions"]
    },
    {
      role: "Data Analyst (Analytics Engineer)",
      company: "Rey.id",
      companyUrl: "https://rey.id",
      location: "Jakarta, Indonesia",
      period: "Aug 2022 - Aug 2026",
      details: [
        "Enforced personal-data controls in the platform itself: column-level policy tags on name, email, phone, address, ID and financial fields, 29 tagged models, and a Dataplex catalogue of 776 tables and 1,473 relationships that blocks personal data from readers without clearance",
        "Boosted report accuracy by 13% (82% -> 95%) by automating CHISS workflows with dynamic master mapping",
        "Migrated 50+ reports from Google Sheets to BigQuery: daily -> hourly generation, 15 analysts freed from 2+ hours a day of manual reporting",
        "Built table-level lineage in that catalogue across 776 tables and 1,473 relationships, used daily (column-level lineage and lineage outside dbt are still open gaps)",
        "Documented the estate honestly: dev and scratch copies account for 88% of stored bytes, which is expected for a development estate; 94% of that had not been touched in 90+ days",
        "Optimized datamart model: 9x faster, 96%+ less BigQuery slot time, 58% less data shuffled",
        "Pioneered the DBT + Metabase framework for 40+ stakeholders to self-serve analytics",
        "Built data quality checks and automated discrepancy detection - 50% less manual error resolution",
        "Enforced ISO 27001:2022 aligned data handling standards across analytics workflows",
        "Built 10+ automated dashboards for marketing, operations, and finance teams"
      ],
      techTags: ["dbt", "BigQuery", "Metabase", "SQL", "GitHub Actions"]
    },
    {
      role: "AI Engineer",
      company: "Olvo.ai",
      companyUrl: "https://olvo.ai",
      location: "Hong Kong, China (Remote)",
      period: "Apr 2024 - Jan 2025",
      details: [
        "Digitized thousands of hardcopy documents using OCR, YOLO, and GPT-4 - 70% efficiency improvement",
        "Automated claims verification and pricing audits - 60% less manual review workload",
        "Designed an LLM-based embedding system to standardize hospital formularies across institutions",
        "Built a real-time client demo app with Streamlit for the client evaluation"
      ],
      techTags: ["Python", "YOLO", "OCR", "GPT-4", "Streamlit"]
    }
  ],

  // --- Tech stack: two groups, each entry names where it is used ---
  // The ML and vision tools were moved to the Olvo.ai bullets above: the current role is data platform work.
  skills: {
    daily: [
      { name: "SQL", where: "all transformation, 599 dbt models in the warehouse" },
      { name: "dbt", where: "the modeling layer, run from CI" },
      { name: "BigQuery", where: "2.7 TB stored, 3.5 TB scanned a day" },
      { name: "Airflow", where: "21 hourly pipelines, self-hosted on Kubernetes" },
      { name: "Looker Studio", where: "primary BI surface for the business" },
      { name: "Google Sheets", where: "analyst extracts and finance reporting" }
    ],
    production: [
      { name: "Metabase", where: "dedicated dataset and its own refresh job, secondary to Looker Studio" },
      { name: "Dataplex", where: "catalogue and data quality" },
      { name: "Cloud Storage", where: "file staging for ingestion and outbound delivery" },
      { name: "GitHub Actions", where: "6 workflows: PR checks, hourly, daily, on-demand, docs" },
      { name: "Python", where: "third-party API pulls and data jobs" },
      { name: "Google Apps Script", where: "clinic and incentive reporting dashboards" },
      { name: "Streamlit", where: "Dataverse, a public build" },
      { name: "Zoho Analytics", where: "hourly incentive sync into a reporting workbook" }
    ]
  },

  // --- Contact ---
  contact: {
    heading: "Work with me",
    description: "For a new platform build, a rescue of an existing pipeline, or a question about any of the numbers above, email is fastest.",
    links: [
      { type: "email",    label: "hello@idzharulhuda.com", href: "mailto:hello@idzharulhuda.com" },
      { type: "linkedin", label: "LinkedIn",                 href: "https://linkedin.com/in/idzharulhuda" },
      { type: "github",   label: "GitHub",                   href: "https://github.com/idzharulhuda13" }
    ],
    citation: {
      text: "Published cost-effectiveness study: telehealth-powered managed care was 7x more cost-effective than conventional care for acute respiratory infection (ARI).",
      href: ""
    }
  }
};
