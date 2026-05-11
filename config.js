// ============================================================
// PORTFOLIO CONFIG -- Edit this file to update all content.
// Everything on the site is driven by this single object.
// ============================================================

const PORTFOLIO = {

  // --- Personal Info ---
  personal: {
    name: "Idzharul Huda",
    initials: "ih",
    title: "Analytics Engineer",
    email: "idzharul.huda@gmail.com",
    linkedin: "idzharulhuda",
    github: "idzharulhuda13",
    location: "Jakarta, Indonesia",
    // Lines that cycle in the hero typing animation
    roles: [
      "Analytics Engineer",
      "SQL & DBT Developer",
      "BigQuery Optimizer",
      "Data Quality Builder",
      "ML Engineer"
    ],
    // Bio paragraphs (shown in About section, highlighted with accent color)
    bio: [
      {
        text: "I'm an Analytics Engineer with 4+ years of experience specializing in DBT, SQL, and BigQuery.",
        highlights: ["DBT", "SQL", "BigQuery"]
      },
      {
        text: 'At Rey.id, I delivered a 30% increase in pipeline efficiency, built automated data quality checks that cut manual review effort by 50%, and pioneered a dbt + Metabase framework that enabled 40+ stakeholders to self-serve analytics.',
        highlights: ["30% increase in pipeline efficiency", "50%", "40+ stakeholders"]
      },
      {
        text: "Previously as an AI Engineer at Olvo.ai, I built OCR + LLM pipelines that digitized thousands of hardcopy documents and contributed to the company's first $1M+ sale.",
        highlights: ["Olvo.ai", "$1M+ sale"]
      },
      {
        text: "My goal is to create scalable, trustworthy data systems that empower teams to move faster with confidence.",
        highlights: []
      }
    ],
    // Short tagline under the hero name
    tagline: "Analytics Engineer specializing in DBT, SQL, and BigQuery. Building reliable single sources of truth for data-driven decisions."
  },

  // --- Impact Metrics Cards ---
  metrics: [
    { value: 30, suffix: "%", label: "Pipeline Efficiency Increase", icon: "&#9889;" },
    { value: 9,  suffix: "x", label: "Query Speed Improvement",     icon: "&#128640;" },
    { value: 50, suffix: "%", label: "Manual Review Reduction",       icon: "&#128200;" },
    { value: 40, suffix: "+", label: "Self-Serve Stakeholders",       icon: "&#128101;" }
  ],

  // --- Charts ---
  charts: {
    speed: {
      title: "Query Processing Speed",
      subtitle: "How many queries processed per unit time",
      type: "bar",          // "bar" or "horizontal-bar"
      labels: ["Before (1x baseline)", "After (9x faster)"],
      data: [1, 9],
      colors: ["rgba(239, 68, 68, 0.5)", "rgba(16, 185, 129, 0.7)"],
      borders: ["rgba(239, 68, 68, 1)", "rgba(16, 185, 129, 1)"],
      yUnit: "x"
    },
    savings: {
      title: "BigQuery Resource Savings",
      subtitle: "Reduction in compute cost",
      type: "horizontal",   // horizontal bar
      labels: ["Slot Time (-96%)", "Data Shuffled (-58%)"],
      data: [96, 58],
      colors: "rgba(16, 185, 129, 0.7)",
      border: "rgba(16, 185, 129, 1)",
      xUnit: "%",
      xMax: 100
    }
  },

  // --- Projects ---
  projects: [
    {
      title: "DBT + Metabase Self-Serve Analytics",
      description: "Pioneered a dbt + Metabase framework enabling 40+ stakeholders to self-serve analytics without analyst intervention.",
      tech: ["dbt", "BigQuery", "Metabase", "SQL"],
      metrics: [
        { value: "40+", label: "stakeholders enabled" },
        { value: "0",   label: "analyst intervention" }
      ],
      featured: true
    },
    {
      title: "BigQuery Pipeline Optimization",
      description: "Optimized datamart model making it 9x faster, decreasing BigQuery slot time by 96%+ and data shuffled by 58%.",
      tech: ["BigQuery", "SQL", "Partitioning"],
      metrics: [
        { value: "96%", label: "slot time reduction" },
        { value: "9x",  label: "faster processing" }
      ],
      featured: false
    },
    {
      title: "OCR + LLM Document Digitization",
      description: "Digitized thousands of hardcopy documents using OCR, YOLO, and GPT-4. Contributed to company's first $1M+ sale.",
      tech: ["Python", "YOLO", "GPT-4", "OCR", "Streamlit"],
      metrics: [
        { value: "70%", label: "efficiency improvement" },
        { value: "$1M+", label: "sale contribution" }
      ],
      featured: false
    },
    {
      title: "Automated Data Quality Framework",
      description: "Built end-to-end data quality checks and automated discrepancy detection, cutting manual error resolution by 50%.",
      tech: ["dbt tests", "BigQuery", "Python", "Airflow"],
      metrics: [
        { value: "50%", label: "less manual work" },
        { value: "13%", label: "accuracy boost" }
      ],
      featured: false
    },
    {
      title: "Dataverse APP - Conversational AI Analytics",
      description: "Conversational AI analytics platform for natural language interaction with datasets (CSV, Excel, Parquet).",
      tech: ["LLM", "Python", "Streamlit", "Pandas"],
      metrics: [],
      featured: false
    },
    {
      title: "Telehealth Cost-Effectiveness Study",
      description: "Published paper demonstrating telehealth-powered managed care was 7x more cost-effective than conventional care for ARI.",
      tech: ["Research", "Statistical Analysis"],
      metrics: [
        { value: "7x", label: "more cost-effective" }
      ],
      featured: false
    }
  ],

  // --- Experience ---
  experience: [
    {
      role: "Data Analyst (Analytics Engineer)",
      company: "Rey.id",
      companyUrl: "https://rey.id",
      location: "Jakarta, Indonesia",
      period: "Aug 2022 - Present",
      details: [
        "Boosted report accuracy by 13% (82% -> 95%) by automating CHISS workflows with dynamic master mapping",
        "Optimized datamart model: 9x faster, 96%+ less BigQuery slot time, 58% less data shuffled",
        "Enforced ISO 27001:2022 aligned data handling standards across analytics workflows",
        "Built data quality checks and automated discrepancy detection - 50% less manual error resolution",
        "Migrated from Google Sheets to BigQuery: daily -> hourly report generation",
        "Pioneered DBT + Metabase pilot for 40+ stakeholders to self-serve analytics",
        "Built 10+ automated dashboards for marketing, operations, and finance teams"
      ]
    },
    {
      role: "AI Engineer",
      company: "Olvo.ai",
      companyUrl: "https://olvo.ai",
      location: "Hong Kong, China (Remote)",
      period: "Apr 2024 - Jan 2025",
      details: [
        "Digitized thousands of hardcopy documents using OCR, YOLO, and GPT-4 - 70% efficiency improvement",
        "Designed LLM-based embedding system to standardize hospital formularies across institutions",
        "Built real-time client demo app with Streamlit, contributing to $1M+ first sale",
        "Automated claims verification & pricing audits - 60% less manual review workload"
      ]
    }
  ],

  // --- Skills / Tech Stack ---
  skills: [
    {
      category: "Data Engineering",
      items: [
        { name: "SQL",       level: "expert" },
        { name: "dbt",       level: "expert" },
        { name: "BigQuery",  level: "expert" },
        { name: "Airflow",   level: "advanced" }
      ]
    },
    {
      category: "BI & Visualization",
      items: [
        { name: "Metabase",      level: "expert" },
        { name: "Looker Studio", level: "expert" },
        { name: "Tableau",       level: "advanced" }
      ]
    },
    {
      category: "ML & AI",
      items: [
        { name: "Python",     level: "advanced" },
        { name: "TensorFlow", level: "advanced" },
        { name: "LLMs",       level: "advanced" },
        { name: "YOLO",       level: "advanced" },
        { name: "OCR",        level: "intermediate" }
      ]
    },
    {
      category: "Tools",
      items: [
        { name: "Git",              level: "expert" },
        { name: "Streamlit",        level: "advanced" },
        { name: "Google Apps Script", level: "advanced" }
      ]
    }
  ],

  // --- Contact CTA ---
  contact: {
    heading: "Let's Connect",
    description: "Open to Analytics Engineer and Data Engineering opportunities. Let's build something great together.",
    links: [
      { type: "email",    label: "idzharul.huda@gmail.com", href: "mailto:idzharul.huda@gmail.com" },
      { type: "linkedin", label: "LinkedIn",                 href: "https://linkedin.com/in/idzharulhuda" },
      { type: "github",   label: "GitHub",                   href: "https://github.com/idzharulhuda13" }
    ]
  },

  // --- Visual Settings ---
  settings: {
    particleCount: 80,           // Max particles (scales with canvas size)
    connectionDistance: 120,     // Max distance for particle lines (px)
    particleSpeed: 0.5,          // Speed multiplier
    particleRadius: [1, 3],      // Min/max particle radius [min, max]
    typedSpeed: 50,              // Typed.js type speed (ms)
    typedBackSpeed: 30,          // Typed.js backspace speed (ms)
    counterDuration: 2000,       // Animated counter duration (ms)
    fadeThreshold: 0.1           // Intersection observer threshold for fade-in
  }
};
