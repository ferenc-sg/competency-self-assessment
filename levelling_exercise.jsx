import { useState, useEffect, useRef } from "react";

const THEMES = [
  {
    id: "influence",
    name: "Scope of influence",
    color: "#2D6A4F",
    lightColor: "#D8F3DC",
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
          IC2: "I understand my team\u2019s strategy and direction.",
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
    color: "#1B4965",
    lightColor: "#D6E8F0",
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
    color: "#6B2737",
    lightColor: "#F2D7DD",
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
    color: "#5A189A",
    lightColor: "#E8DAEF",
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
          IC5: "I shape my team\u2019s or function\u2019s AI strategy; I evaluate emerging AI tools and define standards for responsible, effective use across the group.",
        },
      },
    ],
  },
  {
    id: "collaboration",
    name: "Communication & Collaboration",
    color: "#BF4800",
    lightColor: "#FDEBD0",
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

const LEVELS = ["IC2", "IC3", "IC4", "IC5"];
const LEVEL_LABELS = { IC2: "Beginner", IC3: "Proficient", IC4: "Fully proficient", IC5: "Domain expert" };

function IntroScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 20px 40px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D6A4F", background: "#D8F3DC", padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>Career Framework V3</div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: "#111827", lineHeight: 1.15, margin: "0 0 12px", fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif" }}>
          Self-assessment<br />levelling exercise
        </h1>
        <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>12 questions &middot; ~8 minutes</p>
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: "#374151", marginBottom: 32 }}>
        <p style={{ margin: "0 0 14px" }}>This exercise helps you reflect on where you currently stand across the general competencies defined in the Career Framework. It is designed to support a meaningful conversation with your manager &mdash; not to produce a final verdict.</p>
        <p style={{ margin: "0 0 14px" }}>For each of the <strong>12 sub-dimensions</strong> across 5 competency themes, you will see four statements &mdash; one per IC level. Choose the one that best describes how you work <em>today</em>, not where you aspire to be.</p>
      </div>
      <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 22px", marginBottom: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 10 }}>Tips for honest self-assessment</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#4B5563" }}>
          <li style={{ marginBottom: 4 }}>Pick the level where you <em>consistently</em> operate &mdash; not your best day, not your worst.</li>
          <li style={{ marginBottom: 4 }}>If torn between two levels, choose the lower one and note the higher as a growth area.</li>
          <li>There are no right or wrong answers.</li>
        </ul>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
        {THEMES.map((t) => (
          <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: t.lightColor, color: t.color, fontSize: 11.5, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.color }} />
            {t.name}
          </span>
        ))}
      </div>
      <button onClick={onStart} style={{ width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 600, color: "#fff", background: "#2D6A4F", border: "none", borderRadius: 12, cursor: "pointer", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1B4332")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#2D6A4F")}>
        Begin self-assessment
      </button>
    </div>
  );
}

function ProgressBar({ current, total, themeColor }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E5E7EB", padding: "10px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 620, margin: "0 auto 6px" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Question {current + 1} of {total}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: themeColor }}>{pct}% complete</span>
      </div>
      <div style={{ maxWidth: 620, margin: "0 auto", height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: themeColor, borderRadius: 2, transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

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
      <h2 style={{ fontSize: 23, fontWeight: 700, color: "#111827", margin: "0 0 6px", fontFamily: "'Newsreader', Georgia, serif" }}>{subdimension.name}</h2>
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
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sel ? theme.color : "#B0B0B0", marginBottom: 3 }}>{level} &middot; {LEVEL_LABELS[level]}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: sel ? "#111827" : "#4B5563" }}>{subdimension.statements[level]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
        <button onClick={onPrev} disabled={isFirst} style={{ padding: "11px 22px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: isFirst ? "#D1D5DB" : "#374151", cursor: isFirst ? "default" : "pointer" }}>Back</button>
        <button onClick={onNext} disabled={!selectedLevel} style={{ padding: "11px 28px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "none", background: selectedLevel ? theme.color : "#D1D5DB", color: "#fff", cursor: selectedLevel ? "pointer" : "default", transition: "background 0.2s" }}>
          {isLast ? "View results" : "Next"}
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({ answers, onRestart }) {
  const lvlNum = { IC2: 2, IC3: 3, IC4: 4, IC5: 5 };
  const numLvl = { 2: "IC2", 3: "IC3", 4: "IC4", 5: "IC5" };
  const themeResults = THEMES.map((theme) => {
    const scores = theme.subdimensions.map((sd) => ({ name: sd.name, level: answers[sd.id], num: lvlNum[answers[sd.id]] || 0 }));
    const avg = scores.reduce((s, r) => s + r.num, 0) / scores.length;
    return { theme, scores, avg, dominant: numLvl[Math.round(avg)] || "IC3" };
  });
  const overallAvg = themeResults.reduce((s, t) => s + t.avg, 0) / themeResults.length;
  const overallLevel = numLvl[Math.round(overallAvg)] || "IC3";

  const copyResults = () => {
    const lines = ["CAREER FRAMEWORK \u2014 SELF-ASSESSMENT RESULTS", "", "Overall indicative level: " + overallLevel + " (" + LEVEL_LABELS[overallLevel] + ") \u2014 average " + overallAvg.toFixed(1), ""];
    themeResults.forEach(({ theme, scores, avg, dominant }) => {
      lines.push("\u25A0 " + theme.name + " \u2014 " + dominant + " (avg " + avg.toFixed(1) + ")");
      scores.forEach((s) => lines.push("  " + s.name + ": " + s.level));
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 48px" }}>
      <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D6A4F", background: "#D8F3DC", padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>Results</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 6px", fontFamily: "'Newsreader', Georgia, serif" }}>Your self-assessment profile</h1>
      <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.6 }}>Use this as a starting point for your alignment conversation. The overall level is indicative &mdash; the pattern across sub-dimensions matters most.</p>
      <div style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #F9FAFB 100%)", border: "1px solid #D1FAE5", borderRadius: 16, padding: "28px 24px", marginBottom: 36, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Overall indicative level</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#111827", lineHeight: 1, fontFamily: "'Newsreader', Georgia, serif" }}>{overallLevel}</div>
        <div style={{ fontSize: 16, color: "#374151", fontWeight: 500, marginTop: 4 }}>{LEVEL_LABELS[overallLevel]}</div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>Average score: {overallAvg.toFixed(1)} across 12 sub-dimensions</div>
      </div>
      {themeResults.map(({ theme, scores, avg, dominant }) => (
        <div key={theme.id} style={{ marginBottom: 20, border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", background: theme.color, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>{theme.name}</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>{dominant} &middot; avg {avg.toFixed(1)}</span>
          </div>
          <div style={{ padding: "14px 18px" }}>
            {scores.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < scores.length - 1 ? 10 : 0 }}>
                <div style={{ flex: "0 0 160px", fontSize: 12.5, color: "#374151", fontWeight: 500, lineHeight: 1.3 }}>{s.name}</div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 7, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: (s.num / 5) * 100 + "%", background: theme.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: theme.color, minWidth: 26, textAlign: "right" }}>{s.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", marginTop: 28, marginBottom: 32 }}>
        <div style={{ fontWeight: 600, color: "#92400E", fontSize: 13.5, marginBottom: 6 }}>Next steps</div>
        <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.65 }}>Share these results with your manager. Discuss where your self-assessment aligns with their perspective and where it diverges &mdash; those gaps are the richest areas for feedback and development planning. Use the &ldquo;Copy results&rdquo; button to paste into your feedback cycle notes.</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onRestart} style={{ flex: 1, padding: "13px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>Start over</button>
        <button onClick={copyResults} style={{ flex: 1, padding: "13px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "none", background: "#2D6A4F", color: "#fff", cursor: "pointer" }}>Copy results</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const allQ = THEMES.flatMap((theme) => theme.subdimensions.map((sd) => ({ theme, subdimension: sd })));
  const select = (level) => setAnswers((p) => ({ ...p, [allQ[qIdx].subdimension.id]: level }));
  const next = () => { if (qIdx < allQ.length - 1) setQIdx((i) => i + 1); else setScreen("results"); };
  const prev = () => { if (qIdx > 0) setQIdx((i) => i - 1); };
  const restart = () => { setScreen("intro"); setQIdx(0); setAnswers({}); };

  if (screen === "intro") return <IntroScreen onStart={() => setScreen("questions")} />;
  if (screen === "results") return <ResultsScreen answers={answers} onRestart={restart} />;

  const q = allQ[qIdx];
  return (
    <div>
      <ProgressBar current={qIdx} total={allQ.length} themeColor={q.theme.color} />
      <QuestionCard theme={q.theme} subdimension={q.subdimension} selectedLevel={answers[q.subdimension.id] || null} onSelect={select} onNext={next} onPrev={prev} isFirst={qIdx === 0} isLast={qIdx === allQ.length - 1} />
    </div>
  );
}
