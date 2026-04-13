import { useState, useEffect, useRef } from "react";

// ─── saas.group BRAND PALETTE ─────────────────────────────────────────────────
// Black Night     #2E2B27
// Cinnabar        #F04E23
// Bittersweet     #D95B6F
// Sky Magenta     #B57DC8
// Tropical Indigo #7B6FCC
const BRAND = {
  // Text only — never use as a UI background or border colour
  black:        "#2E2B27",
  // Brand colours — for backgrounds, borders, accents, fills
  cinnabar:     "#F04E23",
  bitter:       "#D95B6F",
  magenta:      "#B57DC8",
  indigo:       "#7B6FCC",
  // Tints (light fills for selected states, pills, cards)
  cinnabarTint: "#FDE8E3",
  bitterTint:   "#FAEAED",
  magentaTint:  "#F3EAF8",
  indigoTint:   "#EDEAFC",
  // Darker shades for functional themes (distinct from Part 1)
  cinnabarDark: "#C44220",
  cinnabarDarkTint: "#FCDDD6",
  bitterDark:   "#B8495F",
  bitterDarkTint: "#F7E0E4",
  indigoDark:   "#6358B8",
  indigoDarkTint: "#E5E3F8",
  magentaDark:  "#9A6AB0",
  magentaDarkTint: "#EFE2F6",
};

// ─── GENERAL COMPETENCY THEMES ────────────────────────────────────────────────
const GENERAL_THEMES = [
  {
    id: "influence",
    name: "Scope of influence",
    color: BRAND.cinnabar,
    lightColor: BRAND.cinnabarTint,
    subdimensions: [
      {
        id: "cross_functional",
        name: "Cross-functional impact",
        statements: {
          IC2: "I work closely with my own team.",
          IC3: "I work primarily in my own function but sometimes collaborate across teams.",
          IC4: "I collaborate across seniorities and departments; I may oversee freelancers or manage less senior staff.",
          IC5: "I regularly partner with senior leadership to align on and advance goals.",
        },
      },
      {
        id: "strategy",
        name: "Strategy",
        statements: {
          IC2: "I understand my team's strategy and direction.",
          IC3: "I apply strategy in my daily work while contributing to team/brand strategy; I influence functional decisions with key insights.",
          IC4: "I actively contribute to strategic decisions; I advocate for business decisions to wider teams.",
          IC5: "I set functional area strategy (short/medium-term); I lead discussions around team direction and priorities.",
        },
      },
      {
        id: "business_impact",
        name: "Business / Product impact",
        statements: {
          IC2: "My direct impact focuses on myself and my immediate peers.",
          IC3: "I lead projects and coordinate cross-functional work.",
          IC4: "I lead high-risk & high-impact projects and process improvements, identify growth opportunities, and own KPIs/roadmap.",
          IC5: "I drive strategic impact through projects and initiatives within and beyond my direct brand/team; I act as a multiplier.",
        },
      },
    ],
  },
  {
    id: "autonomy",
    name: "Level of autonomy",
    color: BRAND.indigo,
    lightColor: BRAND.indigoTint,
    subdimensions: [
      {
        id: "decision_making",
        name: "Autonomy & decision-making",
        statements: {
          IC2: "I work with a limited degree of autonomy, supported by the team.",
          IC3: "I am self-reliant in my expertise area with minimal supervision; I seek guidance on critical or complex decisions.",
          IC4: "I work independently within my role; I lead projects without formal authority and make well-reasoned decisions independently.",
          IC5: "I am a recognized key decision-maker in my expertise area; I influence company direction and performance.",
        },
      },
      {
        id: "independence",
        name: "Independence & Guidance",
        statements: {
          IC2: "I receive task directions and priorities, follow established rules and guidelines, and get help from more experienced colleagues.",
          IC3: "I work with general direction to complete projects; I prioritize tasks effectively.",
          IC4: "I proactively influence team and organizational processes; I support others in prioritizing and improving efficiency.",
          IC5: "I shape organizational guidelines and frameworks; I define priorities aligned with business strategy.",
        },
      },
    ],
  },
  {
    id: "complexity",
    name: "Complexity & problem solving",
    color: BRAND.bitter,
    lightColor: BRAND.bitterTint,
    subdimensions: [
      {
        id: "tasks",
        name: "Tasks complexity",
        statements: {
          IC2: "I confidently handle small to medium tasks.",
          IC3: "I deliver high-quality work, lead smaller projects, and contribute to larger ones.",
          IC4: "I manage complex, large-scale projects across teams and departments.",
          IC5: "I own and lead large, complex projects across the organization.",
        },
      },
      {
        id: "process",
        name: "Process ownership & Innovation",
        statements: {
          IC2: "I use familiar tools and methods to solve problems.",
          IC3: "I identify opportunities for improvement with new tools and methods.",
          IC4: "I develop complex processes and set high work standards.",
          IC5: "I develop systems and processes that enhance team effectiveness.",
        },
      },
      {
        id: "expertise",
        name: "Expertise & team contribution",
        statements: {
          IC2: "I learn and progress quickly, am eager to ask questions, and actively seek out feedback.",
          IC3: "I assist in training new team members and provide feedback.",
          IC4: "I possess deep expertise, mentor juniors, share market insights, and provide proactive feedback.",
          IC5: "I act as a subject matter expert and thought leader, providing mentoring and feedback across teams.",
        },
      },
      {
        id: "problem_solving",
        name: "Problem-solving",
        statements: {
          IC2: "I identify simple problems and seek assistance from colleagues to resolve them.",
          IC3: "I solve complex problems using data to make decisions, both in my role and across the team.",
          IC4: "I resolve complex issues independently and contribute to innovative solutions.",
          IC5: "I solve the most challenging problems faced by my team.",
        },
      },
    ],
  },
  {
    id: "ai",
    name: "AI fluency",
    color: BRAND.magenta,
    lightColor: BRAND.magentaTint,
    subdimensions: [
      {
        id: "ai_adoption",
        name: "AI adoption & personal productivity",
        statements: {
          IC2: "I explore AI tools with curiosity; I am eager to learn and experiment.",
          IC3: "I am proficient in using AI tools to boost my personal productivity.",
          IC4: "I drive AI adoption within my team to improve efficiency and team productivity.",
          IC5: "I lead AI innovation, promote tooling adoption, and educate others.",
        },
      },
      {
        id: "ai_ways",
        name: "AI-informed ways of working",
        statements: {
          IC2: "I use AI assistants for simple tasks (e.g., drafting, summarizing, brainstorming) with guidance on when AI output needs verification.",
          IC3: "I integrate AI tools into recurring workflows; I critically evaluate AI outputs and know when to trust or override them.",
          IC4: "I identify opportunities to embed AI into team processes and workflows; I coach others on effective prompting and responsible AI use.",
          IC5: "I shape my team's or function's AI strategy; I evaluate emerging AI tools and define standards for responsible, effective use across the group.",
        },
      },
    ],
  },
  {
    id: "collaboration",
    name: "Communication & Collaboration",
    color: BRAND.cinnabar,
    lightColor: BRAND.cinnabarTint,
    subdimensions: [
      {
        id: "communication",
        name: "Communication",
        statements: {
          IC2: "I communicate effectively in English; I express my thoughts clearly, succinctly, and constructively.",
          IC3: "I explain complex concepts clearly. I effectively advocate for ideas and push back when necessary.",
          IC4: "I ensure open and effective communication across all levels of the organization.",
          IC5: "I communicate the most complex ideas simply and clearly.",
        },
      },
      {
        id: "collab_stakeholder",
        name: "Collaboration & stakeholder management",
        statements: {
          IC2: "I keep everyone updated on task progress. I provide timely, constructive feedback, seek help when blocked, and align with team values.",
          IC3: "I share knowledge and motivate teammates; I live team values and set a positive example.",
          IC4: "I independently manage stakeholder relationships; I am able to mediate and resolve conflicts. I embody and promote team values as a role model.",
          IC5: "I facilitate collaboration, foster open communication and a culture of shared success. I proactively surface and address team-wide concerns.",
        },
      },
    ],
  },
];

// ─── ACCOUNTING FUNCTIONAL THEMES ─────────────────────────────────────────────
// Functional themes use darkened brand colour variants — no Black Night used as a colour
const FUNCTIONAL_THEMES = [
  {
    id: "acc_standards",
    name: "Accounting Standards & Compliance",
    color: "#C44220",    // Cinnabar darkened
    lightColor: "#FCDDD6",
    subdimensions: [
      {
        id: "standards_knowledge",
        name: "Standards knowledge & application",
        statements: {
          IC2: "I have foundational awareness of the company's primary accounting standard (e.g. IFRS or US GAAP) and apply it to routine transactions under guidance.",
          IC3: "I apply our primary accounting standard confidently to day-to-day transactions; I understand key GAAP vs. IFRS differences and flag compliance issues proactively.",
          IC4: "I interpret and apply accounting standards to complex or non-routine transactions (e.g. lease accounting, business combinations) and act as the internal go-to for standards questions.",
          IC5: "I am the recognised authority on US GAAP, IFRS, and local GAAPs; I own the company's accounting policy framework and advise senior leadership on standards implications of strategic decisions.",
        },
      },
    ],
  },
  {
    id: "acc_operations",
    name: "Core Accounting Operations",
    color: "#B8495F",    // Bittersweet darkened
    lightColor: "#F7E0E4",
    subdimensions: [
      {
        id: "accounting_cycle",
        name: "Accounting cycle & period-end close",
        statements: {
          IC2: "I process routine transactions accurately (invoices, payments, payroll inputs) and complete assigned month-end tasks from a checklist with guidance.",
          IC3: "I independently manage an AR, AP, or Payroll sub-function end-to-end and own a set of GL accounts through period-end close.",
          IC4: "I oversee the full month/quarter/year-end close process across multiple entities, review and approve journal entries, and lead tax compliance across jurisdictions.",
          IC5: "I set the standard for accounting operations quality across the organisation; I design and own the global close process calendar and drive the tax strategy.",
        },
      },
    ],
  },
  {
    id: "acc_revenue",
    name: "Revenue Recognition & Billing",
    color: "#5E51A3",    // Tropical Indigo darkened
    lightColor: "#E8E5F8",
    subdimensions: [
      {
        id: "rev_rec",
        name: "Revenue recognition (ASC 606 / IFRS 15)",
        statements: {
          IC2: "I understand the basic 5-step model of ASC 606 / IFRS 15 conceptually and assist with processing subscription invoices and reconciling billing data.",
          IC3: "I apply revenue recognition principles to standard SaaS contracts (subscription, seat-based, usage-based) and independently maintain deferred and accrued revenue schedules.",
          IC4: "I analyse complex contract structures (multi-element, variable consideration, renewals), own the revenue close, and partner with Sales and Legal on deal structuring.",
          IC5: "I define the revenue recognition framework for the organisation across all product lines and geographies; I am the ultimate authority on complex revenue scenarios.",
        },
      },
    ],
  },
  {
    id: "acc_reporting",
    name: "Financial Reporting & Group Consolidation",
    color: "#9A5CA8",    // Sky Magenta darkened
    lightColor: "#F0E4F7",
    subdimensions: [
      {
        id: "reporting",
        name: "Reporting & consolidation",
        statements: {
          IC2: "I prepare standard recurring reports using templates and gather data for management reporting packs; I am learning intercompany eliminations under guidance.",
          IC3: "I produce management reporting packs with commentary, perform intercompany reconciliations, and deliver meaningful variance analysis.",
          IC4: "I lead consolidated group financial statement preparation across multiple entities, own the management reporting cycle, and partner with FP&A on budget and forecast inputs.",
          IC5: "I define the group reporting framework and chart of accounts; I am accountable for all external and internal financial reporting and drive narrative at Board and investor level.",
        },
      },
    ],
  },
  {
    id: "acc_audit",
    name: "Audit & Internal Controls",
    color: "#A83B50",    // Bittersweet deep — distinct from B8495F above
    lightColor: "#F5D9DE",
    subdimensions: [
      {
        id: "audit_controls",
        name: "Audit readiness & control environment",
        statements: {
          IC2: "I prepare assigned audit schedules accurately and on time; I understand the purpose of internal controls and follow them in day-to-day work.",
          IC3: "I independently prepare audit files, respond to auditor queries, maintain control documentation, and track audit findings through remediation.",
          IC4: "I lead the annual audit process end-to-end, design and monitor the internal control framework, and manage the external auditor relationship year-round.",
          IC5: "I own the organisation's audit and controls strategy; I design the control environment for new entities or geographies and champion a culture of continuous control improvement.",
        },
      },
    ],
  },
  {
    id: "acc_systems",
    name: "Systems, Tools & Process Improvement",
    color: "#7360C0",    // Tropical Indigo lighter dark — distinct from 5E51A3 above
    lightColor: "#EAE7FA",
    subdimensions: [
      {
        id: "systems_process",
        name: "Systems proficiency & process optimisation",
        statements: {
          IC2: "I use the primary accounting system for routine tasks, adhere to data-entry standards, and flag manual or repetitive tasks as improvement opportunities.",
          IC3: "I use advanced system features (dashboards, recurring journals), implement small-scale process improvements, and use AI tools to boost personal productivity.",
          IC4: "I lead system configuration changes and new module rollouts, drive meaningful process improvement projects (close acceleration, automation), and evaluate new tooling.",
          IC5: "I define the accounting systems and technology roadmap; I lead ERP upgrades or migrations and pioneer a culture of continuous improvement and automation.",
        },
      },
    ],
  },
];

const LEVELS = ["IC2", "IC3", "IC4", "IC5"];
const LEVEL_LABELS = { IC2: "Beginner", IC3: "Proficient", IC4: "Fully proficient", IC5: "Domain expert" };

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  const totalGeneral = GENERAL_THEMES.flatMap((t) => t.subdimensions).length;
  const totalFunctional = FUNCTIONAL_THEMES.flatMap((t) => t.subdimensions).length;
  const total = totalGeneral + totalFunctional;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 20px 40px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRAND.cinnabar, background: BRAND.cinnabarTint, padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>
          Career Framework · Accounting
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: BRAND.black, lineHeight: 1.15, margin: "0 0 12px", fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif" }}>
          Self-assessment<br />levelling exercise
        </h1>
        <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{total} questions · ~12 minutes</p>
      </div>

      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: "#374151", marginBottom: 28 }}>
        <p style={{ margin: "0 0 14px" }}>This exercise helps you reflect on where you currently stand across both the <strong>general</strong> competencies shared across all roles and the <strong>functional</strong> competencies specific to the Accounting job family.</p>
        <p style={{ margin: 0 }}>For each sub-dimension, choose the statement that best describes how you work <em>today</em> — not where you aspire to be.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <div style={{ flex: 1, background: BRAND.cinnabarTint, border: "1px solid " + BRAND.cinnabar + "40", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.cinnabar, marginBottom: 6 }}>Part 1</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.black, marginBottom: 4 }}>General competencies</div>
          <div style={{ fontSize: 12.5, color: "#6B7280" }}>{totalGeneral} questions across 5 themes</div>
        </div>
        <div style={{ flex: 1, background: BRAND.indigoTint, border: "1px solid " + BRAND.indigo + "40", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.indigo, marginBottom: 6 }}>Part 2</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.black, marginBottom: 4 }}>Accounting competencies</div>
          <div style={{ fontSize: 12.5, color: "#6B7280" }}>{totalFunctional} questions across 6 competencies</div>
        </div>
      </div>

      <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 22px", marginBottom: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: BRAND.black, marginBottom: 10 }}>Tips for honest self-assessment</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#4B5563" }}>
          <li style={{ marginBottom: 4 }}>Pick the level where you <em>consistently</em> operate — not your best day, not your worst.</li>
          <li style={{ marginBottom: 4 }}>If torn between two levels, choose the lower one and note the higher as a growth area.</li>
          <li>There are no right or wrong answers.</li>
        </ul>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
        {[...GENERAL_THEMES, ...FUNCTIONAL_THEMES].map((t) => (
          <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: t.lightColor, color: t.color, fontSize: 11, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
            {t.name}
          </span>
        ))}
      </div>

      <button onClick={onStart}
        style={{ width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 600, color: "#fff", background: BRAND.cinnabar, border: "none", borderRadius: 12, cursor: "pointer", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#C44220")}
        onMouseLeave={(e) => (e.currentTarget.style.background = BRAND.cinnabar)}>
        Begin self-assessment
      </button>
    </div>
  );
}

// ─── PHASE TRANSITION SCREEN ──────────────────────────────────────────────────
function PhaseTransitionScreen({ onContinue }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "64px 20px 48px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, " + BRAND.cinnabarTint + ", #FBD0C6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 28 }}>✓</div>
      <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRAND.cinnabar, background: BRAND.cinnabarTint, padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>
        Part 1 complete
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: BRAND.black, margin: "0 0 14px", fontFamily: "'Newsreader', Georgia, serif" }}>General competencies done</h2>
      <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
        Great work so far. You're now moving into <strong style={{ color: BRAND.black }}>Part 2 — Accounting-specific competencies</strong>. These 6 questions focus on the technical skills and knowledge specific to your role.
      </p>
      <div style={{ background: BRAND.indigoTint, border: "1px solid " + BRAND.indigo + "30", borderRadius: 14, padding: "20px 24px", marginBottom: 36, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.indigo, marginBottom: 12 }}>Accounting competencies covered</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FUNCTIONAL_THEMES.map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: t.color, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onContinue}
        style={{ width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 600, color: "#fff", background: BRAND.indigo, border: "none", borderRadius: 12, cursor: "pointer", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#5E51A3")}
        onMouseLeave={(e) => (e.currentTarget.style.background = BRAND.indigo)}>
        Continue to Part 2
      </button>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, themeColor, phase }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E5E7EB", padding: "10px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 620, margin: "0 auto 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: themeColor, background: themeColor + "18", padding: "2px 8px", borderRadius: 4 }}>
            {phase === "general" ? "Part 1 · General" : "Part 2 · Accounting"}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>Q {current + 1} of {total}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: themeColor }}>{pct}%</span>
      </div>
      <div style={{ maxWidth: 620, margin: "0 auto", height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: themeColor, borderRadius: 2, transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
function QuestionCard({ theme, subdimension, selectedLevel, onSelect, onNext, onPrev, isFirst, isLast }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.32s ease, transform 0.32s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [subdimension.id]);

  return (
    <div ref={wrapRef} style={{ maxWidth: 620, margin: "0 auto", padding: "28px 20px 40px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 13px", borderRadius: 20, background: theme.lightColor, marginBottom: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.color }} />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: theme.color }}>{theme.name}</span>
      </div>
      <h2 style={{ fontSize: 23, fontWeight: 700, color: BRAND.black, margin: "0 0 6px", fontFamily: "'Newsreader', Georgia, serif" }}>{subdimension.name}</h2>
      <p style={{ fontSize: 13.5, color: "#9CA3AF", margin: "0 0 24px", lineHeight: 1.5 }}>Which statement best describes how you consistently operate?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEVELS.map((level) => {
          const sel = selectedLevel === level;
          return (
            <button key={level} onClick={() => onSelect(level)}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: sel ? "2px solid " + theme.color : "1.5px solid #E5E7EB", background: sel ? theme.lightColor : "#fff", textAlign: "left", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.borderColor = "#CBD5E1"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.borderColor = sel ? theme.color : "#E5E7EB"; }}>
              <div style={{ minWidth: 20, height: 20, borderRadius: "50%", marginTop: 2, border: sel ? "6px solid " + theme.color : "2px solid #D1D5DB", background: "#fff", boxSizing: "border-box", transition: "all 0.15s ease", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sel ? theme.color : "#B0B0B0", marginBottom: 3 }}>{level} · {LEVEL_LABELS[level]}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: sel ? BRAND.black : "#4B5563" }}>{subdimension.statements[level]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
        <button onClick={onPrev} disabled={isFirst}
          style={{ padding: "11px 22px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: isFirst ? "#D1D5DB" : BRAND.black, cursor: isFirst ? "default" : "pointer" }}>
          Back
        </button>
        <button onClick={onNext} disabled={!selectedLevel}
          style={{ padding: "11px 28px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "none", background: selectedLevel ? theme.color : "#D1D5DB", color: "#fff", cursor: selectedLevel ? "pointer" : "default", transition: "background 0.2s" }}>
          {isLast ? "View results" : "Next"}
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ answers, onRestart }) {
  const lvlNum = { IC2: 2, IC3: 3, IC4: 4, IC5: 5 };
  const numLvl = { 2: "IC2", 3: "IC3", 4: "IC4", 5: "IC5" };

  const calcThemeResults = (themes) =>
    themes.map((theme) => {
      const scores = theme.subdimensions.map((sd) => ({ name: sd.name, level: answers[sd.id], num: lvlNum[answers[sd.id]] || 0 }));
      const avg = scores.reduce((s, r) => s + r.num, 0) / scores.length;
      return { theme, scores, avg, dominant: numLvl[Math.round(avg)] || "IC3" };
    });

  const generalResults = calcThemeResults(GENERAL_THEMES);
  const functionalResults = calcThemeResults(FUNCTIONAL_THEMES);

  const generalAvg = generalResults.reduce((s, t) => s + t.avg, 0) / generalResults.length;
  const functionalAvg = functionalResults.reduce((s, t) => s + t.avg, 0) / functionalResults.length;
  const overallAvg = (generalAvg + functionalAvg) / 2;
  const overallLevel = numLvl[Math.round(overallAvg)] || "IC3";
  const generalLevel = numLvl[Math.round(generalAvg)] || "IC3";
  const functionalLevel = numLvl[Math.round(functionalAvg)] || "IC3";

  const ThemeBlock = ({ theme, scores, avg, dominant }) => (
    <div style={{ marginBottom: 16, border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", background: theme.color, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{theme.name}</span>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>{dominant} · avg {avg.toFixed(1)}</span>
      </div>
      <div style={{ padding: "14px 18px" }}>
        {scores.map((s, i) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < scores.length - 1 ? 10 : 0 }}>
            <div style={{ flex: "0 0 160px", fontSize: 12, color: "#374151", fontWeight: 500, lineHeight: 1.3 }}>{s.name}</div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 7, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: ((lvlNum[s.level] || 0) / 5) * 100 + "%", background: theme.color, borderRadius: 4, transition: "width 0.7s ease" }} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: theme.color, minWidth: 26, textAlign: "right" }}>{s.level || "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const copyResults = () => {
    const lines = [
      "CAREER FRAMEWORK — ACCOUNTING SELF-ASSESSMENT RESULTS", "",
      `Overall indicative level: ${overallLevel} (${LEVEL_LABELS[overallLevel]}) — average ${overallAvg.toFixed(1)}`, "",
      "── GENERAL COMPETENCIES ──", `  Overall: ${generalLevel} (avg ${generalAvg.toFixed(1)})`, "",
    ];
    generalResults.forEach(({ theme, scores, avg, dominant }) => {
      lines.push(`■ ${theme.name} — ${dominant} (avg ${avg.toFixed(1)})`);
      scores.forEach((s) => lines.push(`  ${s.name}: ${s.level}`));
      lines.push("");
    });
    lines.push("── ACCOUNTING FUNCTIONAL COMPETENCIES ──", `  Overall: ${functionalLevel} (avg ${functionalAvg.toFixed(1)})`, "");
    functionalResults.forEach(({ theme, scores, avg, dominant }) => {
      lines.push(`■ ${theme.name} — ${dominant} (avg ${avg.toFixed(1)})`);
      scores.forEach((s) => lines.push(`  ${s.name}: ${s.level}`));
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 48px" }}>
      <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRAND.cinnabar, background: BRAND.cinnabarTint, padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>Results</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: BRAND.black, margin: "0 0 6px", fontFamily: "'Newsreader', Georgia, serif" }}>Your self-assessment profile</h1>
      <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px", lineHeight: 1.6 }}>Use this as a starting point for your alignment conversation with your manager. The overall level is indicative — the pattern across dimensions matters most.</p>

      {/* Overall banner */}
      <div style={{ background: "linear-gradient(135deg, " + BRAND.cinnabarTint + " 0%, " + BRAND.indigoTint + " 100%)", border: "1px solid " + BRAND.cinnabar + "30", borderRadius: 16, padding: "24px", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid #E5E7EB", paddingRight: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Overall</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: BRAND.black, lineHeight: 1, fontFamily: "'Newsreader', Georgia, serif" }}>{overallLevel}</div>
            <div style={{ fontSize: 13, color: "#374151", fontWeight: 500, marginTop: 2 }}>{LEVEL_LABELS[overallLevel]}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>avg {overallAvg.toFixed(1)}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingLeft: 4 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 14px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: BRAND.cinnabar, marginBottom: 2 }}>General</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: BRAND.black, fontFamily: "'Newsreader', Georgia, serif" }}>{generalLevel}</span>
                <span style={{ fontSize: 11.5, color: "#6B7280" }}>{LEVEL_LABELS[generalLevel]} · avg {generalAvg.toFixed(1)}</span>
              </div>
            </div>
            <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 14px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: BRAND.indigo, marginBottom: 2 }}>Accounting functional</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: BRAND.black, fontFamily: "'Newsreader', Georgia, serif" }}>{functionalLevel}</span>
                <span style={{ fontSize: 11.5, color: "#6B7280" }}>{LEVEL_LABELS[functionalLevel]} · avg {functionalAvg.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General section divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", whiteSpace: "nowrap" }}>Part 1 · General competencies</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>
      {generalResults.map((r) => <ThemeBlock key={r.theme.id} {...r} />)}

      {/* Functional section divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 14px" }}>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", whiteSpace: "nowrap" }}>Part 2 · Accounting functional competencies</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>
      {functionalResults.map((r) => <ThemeBlock key={r.theme.id} {...r} />)}

      {/* Next steps */}
      <div style={{ background: BRAND.cinnabarTint, border: "1px solid " + BRAND.cinnabar + "40", borderRadius: 12, padding: "16px 20px", marginTop: 24, marginBottom: 28 }}>
        <div style={{ fontWeight: 600, color: BRAND.cinnabar, fontSize: 13.5, marginBottom: 6 }}>Next steps</div>
        <div style={{ fontSize: 13, color: "#5A2010", lineHeight: 1.65 }}>Share these results with your manager. Discuss where your self-assessment aligns with their perspective and where it diverges — those gaps are the richest areas for feedback and development planning. Use the "Copy results" button to paste into your feedback cycle notes.</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onRestart} style={{ flex: 1, padding: "13px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: BRAND.black, cursor: "pointer" }}>Start over</button>
        <button onClick={copyResults} style={{ flex: 1, padding: "13px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "none", background: BRAND.cinnabar, color: "#fff", cursor: "pointer" }}>Copy results</button>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const generalQ = GENERAL_THEMES.flatMap((theme) => theme.subdimensions.map((sd) => ({ theme, subdimension: sd, phase: "general" })));
  const functionalQ = FUNCTIONAL_THEMES.flatMap((theme) => theme.subdimensions.map((sd) => ({ theme, subdimension: sd, phase: "functional" })));
  const allQ = [...generalQ, ...functionalQ];

  const select = (level) => setAnswers((p) => ({ ...p, [allQ[qIdx].subdimension.id]: level }));

  const next = () => {
    const isLastGeneral = qIdx === generalQ.length - 1;
    const isLastOverall = qIdx === allQ.length - 1;
    if (isLastOverall) { setScreen("results"); return; }
    if (isLastGeneral) { setScreen("transition"); return; }
    setQIdx((i) => i + 1);
  };

  const prev = () => { if (qIdx > 0) setQIdx((i) => i - 1); };
  const continueToFunctional = () => { setQIdx(generalQ.length); setScreen("questions"); };
  const restart = () => { setScreen("intro"); setQIdx(0); setAnswers({}); };

  if (screen === "intro") return <IntroScreen onStart={() => setScreen("questions")} />;
  if (screen === "transition") return <PhaseTransitionScreen onContinue={continueToFunctional} />;
  if (screen === "results") return <ResultsScreen answers={answers} onRestart={restart} />;

  const q = allQ[qIdx];
  const phaseTotal = q.phase === "general" ? generalQ.length : functionalQ.length;
  const phaseIdx = q.phase === "general" ? qIdx : qIdx - generalQ.length;
  const isLastQ = qIdx === allQ.length - 1;

  return (
    <div>
      <ProgressBar current={phaseIdx} total={phaseTotal} themeColor={q.theme.color} phase={q.phase} />
      <QuestionCard
        theme={q.theme}
        subdimension={q.subdimension}
        selectedLevel={answers[q.subdimension.id] || null}
        onSelect={select}
        onNext={next}
        onPrev={prev}
        isFirst={qIdx === 0}
        isLast={isLastQ}
      />
    </div>
  );
}

