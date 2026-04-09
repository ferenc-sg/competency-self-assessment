import { useState, useEffect, useRef } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

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
          IC2: { text: "I work closely with my own team.", example: "Most of my Slack conversations are with people on my own team. If someone from another department needs something, it usually goes through my manager." },
          IC3: { text: "I work primarily in my own function but sometimes collaborate across teams.", example: "I\u2019ve been pulled into a shared channel or meeting with another team to help deliver something \u2014 like joining a call with Support to explain a technical change, or reviewing copy with Marketing." },
          IC4: { text: "I collaborate across seniorities and departments; I may oversee freelancers or manage less senior staff.", example: "My calendar regularly has meetings with people from other departments. I\u2019ve briefed a freelancer or contractor directly, or been the main contact for a cross-team initiative without my manager being involved." },
          IC5: { text: "I regularly partner with senior leadership to align on and advance goals.", example: "I\u2019m in recurring syncs with department heads or brand leads. When a cross-group decision needs input from my area, I\u2019m the person in the room \u2014 not my manager." },
        },
      },
      {
        id: "strategy",
        name: "Strategy",
        statements: {
          IC2: { text: "I understand my team\u2019s strategy and direction.", example: "If someone asked me \u2018what\u2019s your team focused on this quarter and why?\u2019, I could give a clear answer and explain where my own tasks fit in." },
          IC3: { text: "I apply strategy in my daily work while contributing to team/brand strategy; I influence functional decisions with key insights.", example: "In a planning meeting, I\u2019ve raised something like \u2018our support tickets show users struggle with X \u2014 we should prioritise fixing that\u2019 and it actually influenced what we decided to do." },
          IC4: { text: "I actively contribute to strategic decisions; I advocate for business decisions to wider teams.", example: "I\u2019ve presented a case to people outside my team for why we should change direction \u2014 like arguing we should sunset a feature, enter a new segment, or restructure a workflow \u2014 and it moved the conversation." },
          IC5: { text: "I set functional area strategy (short/medium-term); I lead discussions around team direction and priorities.", example: "I\u2019m the one who writes or owns the strategy doc for my area. When quarterly planning happens, I\u2019m defining the priorities, not just contributing to someone else\u2019s list." },
        },
      },
      {
        id: "business_impact",
        name: "Business / Product impact",
        statements: {
          IC2: { text: "My direct impact focuses on myself and my immediate peers.", example: "If I disappeared for a week, my team would notice the gap in my tasks \u2014 but teams outside mine probably wouldn\u2019t be affected." },
          IC3: { text: "I lead projects and coordinate cross-functional work.", example: "I\u2019ve owned a project from kickoff to delivery that required getting input or sign-off from people outside my team \u2014 like coordinating a product update that touched engineering, docs, and customer comms." },
          IC4: { text: "I lead high-risk & high-impact projects and process improvements, identify growth opportunities, and own KPIs/roadmap.", example: "There\u2019s a dashboard or OKR with my name next to it. I\u2019ve run a project where failure would have been visible to leadership \u2014 like a migration, a major campaign, or a process overhaul affecting multiple teams." },
          IC5: { text: "I drive strategic impact through projects and initiatives within and beyond my direct brand/team; I act as a multiplier.", example: "Something I built, defined, or initiated is now used by teams beyond my own \u2014 like a playbook another brand adopted, a tool that became the standard, or a process that was rolled out group-wide." },
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
          IC2: { text: "I have limited autonomy and am supported by the team.", example: "Before I send an important message to a stakeholder or merge a significant change, I usually run it by someone more experienced first." },
          IC3: { text: "I am mostly self-reliant and need only occasional supervision. I seek guidance on critical or complex decisions.", example: "I handle my daily work without check-ins, but when something feels risky \u2014 like a choice that\u2019s hard to reverse, or a commitment to a tight deadline \u2014 I flag it to my lead before proceeding." },
          IC4: { text: "I operate autonomously within my scope, with little supervision. I lead projects without formal authority, making well-reasoned decisions and managing trade-offs independently.", example: "I\u2019ve made calls like \u2018we\u2019re cutting this scope to hit the deadline\u2019 or \u2018I\u2019m changing our approach because of Y\u2019 \u2014 and communicated the reasoning afterwards, rather than asking permission upfront." },
          IC5: { text: "I am recognized as a key decision-maker in my scope of expertise and can influence the company\u2019s direction and performance.", example: "When a big decision needs to be made in my domain, people wait for my input before moving forward. My Slack DMs include messages from other teams asking \u2018what do you think we should do about X?\u2019" },
        },
      },
      {
        id: "independence",
        name: "Independence & Guidance",
        statements: {
          IC2: { text: "I receive clear directions on tasks and priorities. I follow established rules and guidelines and get help from more experienced colleagues.", example: "My tasks usually come from a backlog, a brief, or my manager\u2019s direction. I follow the team\u2019s existing templates, checklists, or workflows to get them done." },
          IC3: { text: "I work with general instructions, defining the path to project completion. I am skilled at task prioritization and self-sufficient in my field.", example: "My manager says \u2018we need to solve X by end of month\u2019 and I figure out the steps, timeline, and who to involve. I don\u2019t need a task list broken down for me." },
          IC4: { text: "I proactively influence team and organizational processes. I support others in prioritizing tasks and improving efficiency.", example: "I\u2019ve changed how the team works \u2014 like replacing a manual reporting step with an automated one, restructuring our standup format, or creating a prioritisation framework colleagues now use to plan their sprints." },
          IC5: { text: "I shape and refine organizational guidelines and frameworks. I define priorities according to the business strategy.", example: "I\u2019ve written guidelines that live in our Notion or wiki and that people across the group reference \u2014 like an evaluation framework, a hiring rubric, or a decision-making policy for my area." },
        },
      },
    ],
  },
  {
    id: "complexity",
    name: "Complexity & problem solving",
    color: "#7B2D8E",
    lightColor: "#EDDBF4",
    subdimensions: [
      {
        id: "tasks_complexity",
        name: "Tasks complexity",
        statements: {
          IC2: { text: "I tackle straightforward, small to medium tasks confidently.", example: "My typical week involves clearly scoped work \u2014 like closing tickets, writing a blog post from a brief, fixing a known bug, or updating a spreadsheet. I deliver these reliably without hand-holding." },
          IC3: { text: "I deliver high-quality work, lead smaller projects, and contribute to larger ones.", example: "I\u2019ve owned something with a beginning, middle, and end \u2014 like running a campaign, shipping a feature, or setting up a new vendor \u2014 while also contributing meaningfully to a bigger initiative led by someone else." },
          IC4: { text: "I manage complex, large-scale projects across teams and departments.", example: "I\u2019ve run a project with a shared Slack channel, a project tracker, multiple workstreams, and dependencies on other teams\u2019 timelines \u2014 like a platform migration, a rebrand, or a multi-market launch." },
          IC5: { text: "I own and lead large, complex projects across the organization.", example: "I get handed the problems where the scope is unclear, the stakeholders are many, and there\u2019s no existing playbook \u2014 like designing a new operating model, building a function from scratch, or leading a group-wide transformation." },
        },
      },
      {
        id: "process",
        name: "Process ownership & Innovation",
        statements: {
          IC2: { text: "I use familiar tools and methods to solve problems.", example: "I work with the tools the team already uses \u2014 Jira, Notion, Google Sheets, our CMS \u2014 and I follow the workflows that are already in place. I\u2019m getting good at them." },
          IC3: { text: "I identify opportunities for improvement with new tools and methods.", example: "I noticed we were doing something manually that could be automated, or that a step in our process was creating a bottleneck \u2014 and I proposed a fix, like setting up a Zapier flow or suggesting a better template." },
          IC4: { text: "I develop complex processes and set high work standards.", example: "There\u2019s a process the team now follows that I designed \u2014 like a QA checklist, a content review pipeline, an incident response workflow, or a candidate evaluation rubric. It raised the bar for how we work." },
          IC5: { text: "I develop systems and processes that enhance team effectiveness.", example: "I\u2019ve built something that teams beyond mine adopted as their standard \u2014 like defining the group-wide retrospective format, creating a shared reporting framework, or authoring the SOP for a critical function." },
        },
      },
      {
        id: "expertise",
        name: "Expertise & team contribution",
        statements: {
          IC2: { text: "I learn and progress quickly, am eager to ask questions, and actively seek out feedback.", example: "I regularly ask colleagues to review my work, I take notes in 1:1s about what to improve, and my manager has commented that I\u2019m picking things up faster than expected." },
          IC3: { text: "I assist in training new team members and provide feedback.", example: "When a new person joined, I walked them through our tools and processes during their first week. I\u2019ve also given a colleague feedback on a deliverable that helped them improve it before sharing it wider." },
          IC4: { text: "I possess deep expertise, mentor juniors, share market insights, and provide proactive feedback.", example: "Teammates DM me with questions like \u2018how should I approach this?\u2019 or \u2018can you sanity-check my thinking?\u2019 because they know I have deep knowledge in my area. I don\u2019t wait to be asked \u2014 I flag issues when I see them." },
          IC5: { text: "I act as a subject matter expert and thought leader, providing mentoring and feedback across teams.", example: "People from other brands or teams reach out to me for advice. I\u2019ve given an internal talk, published a reference doc that became widely used, or been asked to weigh in on decisions outside my immediate scope because of my expertise." },
        },
      },
      {
        id: "problem_solving",
        name: "Problem-solving",
        statements: {
          IC2: { text: "I identify simple problems and seek assistance from colleagues to resolve them.", example: "I noticed the numbers in a report didn\u2019t add up and flagged it to my lead, or I spotted a broken link on our site and raised it in Slack so someone with access could fix it." },
          IC3: { text: "I solve complex problems using data to make decisions, both in my role and across the team.", example: "I pulled data from our analytics to figure out why a metric was dropping, built a hypothesis, and proposed a specific fix \u2014 rather than just reporting that something looked off." },
          IC4: { text: "I resolve complex issues independently and contribute to innovative solutions.", example: "I\u2019ve solved a problem that didn\u2019t have an obvious answer \u2014 like finding a workaround for a platform limitation, redesigning a workflow under time pressure, or untangling a data mess that had been confusing the team for weeks." },
          IC5: { text: "I solve the most challenging problems faced by my team.", example: "When the team hits a wall \u2014 a system nobody fully understands, a strategic question with no clear answer, a conflict between competing priorities \u2014 I\u2019m the one they turn to, and I usually find a path forward." },
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
        id: "ai_application",
        name: "AI application & effectiveness",
        statements: {
          IC2: { text: "I use 1\u20132 AI tools regularly for simple tasks (e.g., drafting, summarizing). I tend to accept outputs at face value and have limited instinct for iteration or refinement.", example: "I open ChatGPT a few times a week for things like \u2018rewrite this email\u2019 or \u2018summarise these notes\u2019. If the output isn\u2019t great, I usually just edit it manually rather than trying a different prompt." },
          IC3: { text: "I use multiple AI tools as a genuine part of my workflow with tangible impact \u2014 time saved, quality improved, scope expanded. I actively adjust prompts, context, and constraints to get quality output. I evaluate tools practically before committing.", example: "I could show you a before/after of how AI changed a specific workflow \u2014 like cutting my weekly reporting time in half, or using Claude to draft and iterate on customer-facing copy that used to take me a full afternoon." },
          IC4: { text: "AI is embedded in how I work, with agentic tools or custom workflows tailored to my role. I use structured prompting techniques and critically evaluate outputs. I evaluate new tools with rigour, considering integration, data privacy, and security.", example: "I\u2019ve set up custom instructions or saved prompt chains for recurring tasks. When a new AI tool gets hyped, I don\u2019t just try it \u2014 I check what data it accesses, how it integrates with our stack, and whether it actually solves a problem we have." },
          IC5: { text: "AI is deeply embedded across all aspects of my work. I master advanced prompting and orchestration patterns and develop reusable prompt libraries for my function. I define tooling strategy with an evidence-based evaluation framework, balancing innovation against risk.", example: "I maintain a shared prompt library or tool evaluation doc that my function references. When leadership asks \u2018should we adopt X?\u2019 I\u2019m the one who writes the recommendation \u2014 with evidence, not enthusiasm." },
        },
      },
      {
        id: "ai_enablement",
        name: "AI enablement & advocacy",
        note: "This sub-dimension describes valued enabling behaviours \u2014 not hard requirements. How you enable AI adoption will look different depending on your role, team size, and individual style.",
        statements: {
          IC2: { text: "I share occasional AI tips or resources with colleagues. I am open to learning from others\u2019 AI use cases.", example: "I forwarded an interesting AI article in Slack, or asked a colleague \u2018how did you make that?\u2019 when they showed something they\u2019d built with an AI tool." },
          IC3: { text: "I contribute to team AI knowledge by sharing use cases or workflows that worked. I may introduce tools or approaches to peers.", example: "I screen-shared my AI workflow in a team meeting and a couple of people started doing it the same way. Or I posted a \u2018this worked well for me\u2019 message in our team channel with a prompt I found effective." },
          IC4: { text: "I actively support AI adoption in my team: I share best practices, help colleagues get started, or identify AI opportunities in others\u2019 workflows. I may run demos, create guides, or embed AI into team processes.", example: "I sat with a teammate who wasn\u2019t using AI and helped them set up a workflow for their specific tasks. Or I created a shared doc with prompts and tips that the team now references, or ran a 15-minute demo in our team meeting." },
          IC5: { text: "I champion AI as a multiplier for team effectiveness. I build internal guides, define best practices, and create adoption roadmaps. I shape the broader AI culture across teams or functions.", example: "I\u2019ve created something that lives beyond my team \u2014 like an internal AI playbook, a quarterly adoption review, or a cross-functional working group on how we integrate AI responsibly across the organisation." },
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
          IC2: { text: "I communicate effectively in English; I express my thoughts clearly, succinctly, and constructively.", example: "My Slack messages and emails are clear enough that people don\u2019t need follow-up questions to understand what I mean. In meetings, I can share my point without going in circles." },
          IC3: { text: "I explain complex concepts clearly. I effectively advocate for ideas and push back when necessary.", example: "I\u2019ve explained something technical to a non-technical stakeholder and they got it. I\u2019ve also said \u2018I don\u2019t think that\u2019s the right approach, here\u2019s why\u2019 in a meeting \u2014 and it landed well." },
          IC4: { text: "I ensure open and effective communication across all levels of the organization.", example: "I write updates that work for both my team and senior leadership without needing two versions. People at different levels feel equally comfortable asking me questions or giving me feedback." },
          IC5: { text: "I communicate the most complex ideas simply and clearly.", example: "I\u2019ve taken something genuinely hard to explain \u2014 like a technical architecture decision, a nuanced market analysis, or a sensitive org change \u2014 and communicated it so clearly that it unlocked a decision that had been stuck." },
        },
      },
      {
        id: "collab_stakeholder",
        name: "Collaboration & stakeholder management",
        statements: {
          IC2: { text: "I keep everyone updated on task progress. I provide timely, constructive feedback, seek help when blocked, and align with team values.", example: "My team doesn\u2019t have to chase me for updates \u2014 I post progress in our standup or channel. When I\u2019m stuck, I say so within hours, not days." },
          IC3: { text: "I share knowledge and motivate teammates; I live team values and set a positive example.", example: "I\u2019ve shared a useful article, paired with someone on a tough problem, or jumped in to help a teammate hit a deadline \u2014 not because I was asked, but because I noticed they needed it." },
          IC4: { text: "I independently manage stakeholder relationships; I am able to mediate and resolve conflicts. I embody and promote team values as a role model.", example: "I\u2019ve handled a tense situation between colleagues or teams without escalating to my manager \u2014 like realigning expectations when a deliverable was at risk, or mediating when two people disagreed on an approach." },
          IC5: { text: "I facilitate collaboration, foster open communication and a culture of shared success. I proactively surface and address team-wide concerns.", example: "I\u2019ve noticed a brewing issue \u2014 like growing friction between teams, or a process quietly frustrating everyone \u2014 and I brought it up, facilitated a conversation, and helped resolve it before it became a real problem." },
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
        <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "#6B7280" }}>Each statement includes a real-life example in italics to help you picture what that level looks like in practice.</p>
      </div>
      <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 22px", marginBottom: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 10 }}>Tips for honest self-assessment</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#4B5563" }}>
          <li style={{ marginBottom: 5 }}>Choose the level where you <strong>consistently</strong> operate &mdash; not your best day or a one-off achievement.</li>
          <li style={{ marginBottom: 5 }}>It&rsquo;s normal to be at different levels across different sub-dimensions.</li>
          <li style={{ marginBottom: 5 }}>If you&rsquo;re between two levels, pick the one that feels like your everyday reality.</li>
          <li>Your manager will complete a parallel assessment &mdash; differences are healthy starting points for discussion.</li>
        </ul>
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
      {subdimension.note && (
        <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", margin: "10px 0 16px" }}>
          {subdimension.note}
        </div>
      )}
      <p style={{ fontSize: 13.5, color: "#9CA3AF", margin: "0 0 24px", lineHeight: 1.5 }}>Which statement best describes how you consistently operate?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEVELS.map((level) => {
          const item = subdimension.statements[level];
          const sel = selectedLevel === level;
          return (
            <button key={level} onClick={() => onSelect(level)}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: sel ? "2px solid " + theme.color : "1.5px solid #E5E7EB", background: sel ? theme.lightColor : "#fff", textAlign: "left", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.borderColor = "#CBD5E1"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.borderColor = sel ? theme.color : "#E5E7EB"; }}>
              <div style={{ minWidth: 20, height: 20, borderRadius: "50%", marginTop: 2, border: sel ? "6px solid " + theme.color : "2px solid #D1D5DB", background: "#fff", boxSizing: "border-box", transition: "all 0.15s ease", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: sel ? "#111827" : "#4B5563" }}>{item.text}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: sel ? "#6B7280" : "#9CA3AF", fontStyle: "italic", marginTop: 5 }}>{item.example}</div>
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
  const [showPrintView, setShowPrintView] = useState(false);
  const themeResults = THEMES.map((theme) => {
    const scores = theme.subdimensions.map((sd) => ({ name: sd.name, level: answers[sd.id], num: lvlNum[answers[sd.id]] || 0 }));
    const avg = scores.reduce((s, r) => s + r.num, 0) / scores.length;
    return { theme, scores, avg, dominant: numLvl[Math.round(avg)] || "IC3" };
  });
  const overallAvg = themeResults.reduce((s, t) => s + t.avg, 0) / themeResults.length;
  const overallLevel = numLvl[Math.round(overallAvg)] || "IC3";

  const copyResults = () => {
    const lines = ["\u2014 CAREER FRAMEWORK SELF-ASSESSMENT \u2014", "", "Overall indicative level: " + overallLevel + " (" + LEVEL_LABELS[overallLevel] + ") | average " + overallAvg.toFixed(1), ""];
    themeResults.forEach(({ theme, scores, avg, dominant }) => {
      lines.push("\u25A0 " + theme.name + " \u2014 " + dominant + " (avg " + avg.toFixed(1) + ")");
      scores.forEach((s) => lines.push("  " + s.name + ": " + s.level));
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  const printReport = () => {
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const rows = themeResults.flatMap(({ theme, scores }) =>
      scores.map((s) => "<tr><td style='padding:10px 14px;color:#2D6A4F;font-weight:600'>" + theme.name + "</td><td style='padding:10px 14px'>" + s.name + "</td><td style='padding:10px 14px;text-align:center;font-weight:700;color:#2D6A4F'>" + (s.level || "\u2014") + "</td><td style='padding:10px 14px;text-align:center'>" + (LEVEL_LABELS[s.level] || "\u2014") + "</td></tr>")
    );
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Self-Assessment Results</title><style>body{font-family:-apple-system,system-ui,'Segoe UI',sans-serif;max-width:720px;margin:0 auto;padding:40px 24px;color:#1a1a18;line-height:1.6}h1{font-size:24px;margin:0 0 4px;font-weight:700}.sub{font-size:14px;color:#6b7280;margin:0 0 28px}.summary{background:#f0fdf4;border:1px solid #d1fae5;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px}.summary .level{font-size:42px;font-weight:800;color:#2D6A4F;margin:4px 0}.summary .label{font-size:15px;color:#374151}.summary .avg{font-size:12px;color:#9ca3af;margin-top:4px}table{width:100%;border-collapse:collapse;font-size:13.5px;margin-bottom:32px}th{background:#2D6A4F;color:#fff;padding:10px 14px;text-align:left;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}td{border-bottom:1px solid #e5e7eb}tr:nth-child(even) td{background:#f9fafb}.tip{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:#92400E}.footer{font-size:12px;color:#9ca3af;margin-top:24px;text-align:center}@media print{.tip{display:none}}</style></head><body>" +
      "<div class='tip'>\u2139\uFE0F Use <strong>Ctrl+P</strong> (or <strong>Cmd+P</strong>) to save this as a PDF, or <strong>File \u2192 Save As</strong> to keep it as HTML.</div>" +
      "<h1>Career Framework \u2014 Self-Assessment Results</h1><p class='sub'>Completed on " + today + "</p>" +
      "<div class='summary'><div style='font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;font-weight:600'>Overall indicative level</div><div class='level'>" + overallLevel + "</div><div class='label'>" + LEVEL_LABELS[overallLevel] + "</div><div class='avg'>Average score: " + overallAvg.toFixed(1) + " across 12 sub-dimensions</div></div>" +
      "<table><thead><tr><th>Theme</th><th>Sub-dimension</th><th style='text-align:center'>Level</th><th style='text-align:center'>Description</th></tr></thead><tbody>" + rows.join("") + "</tbody></table>" +
      "<div class='footer'><p>This is a starting point for your alignment conversation with your manager. Differences in assessment are expected and valuable.</p></div></body></html>");
    w.document.close();
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 48px" }}>
      <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D6A4F", background: "#D8F3DC", padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>Results</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 6px", fontFamily: "'Newsreader', Georgia, serif" }}>Your self-assessment profile</h1>
      <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.6 }}>Use this as a starting point for your alignment conversation. The overall level is indicative &mdash; the pattern across sub-dimensions matters most.</p>
      <div style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #F9FAFB 100%)", border: "1px solid #D1FAE5", borderRadius: 16, padding: "28px 24px", marginBottom: 36, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280", marginBottom: 6 }}>Indicative overall level</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#2D6A4F", marginBottom: 4 }}>{overallLevel}</div>
        <div style={{ fontSize: 15, color: "#374151" }}>{LEVEL_LABELS[overallLevel]}</div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Average {overallAvg.toFixed(1)} across all dimensions</div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 8px 8px", marginBottom: 36 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", textAlign: "center", marginBottom: 4 }}>Competency profile</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 12 }}>IC2 = inner ring &middot; IC5 = outer ring</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={themeResults.map(({ theme, avg }) => ({
            area: theme.name.replace("Communication & ", "Comm. & ").replace("Complexity & problem solving", "Complexity & PS"),
            score: avg,
            fullMark: 5,
          }))}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "#374151", fontWeight: 500 }} />
            <PolarRadiusAxis angle={90} domain={[1, 5]} tickCount={5} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} />
            <Radar dataKey="score" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: "#2D6A4F", strokeWidth: 0 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {themeResults.map(({ theme, scores, avg, dominant }) => (
        <div key={theme.id} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.color }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.color }}>{theme.name}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>{dominant} (avg {avg.toFixed(1)})</span>
          </div>
          {scores.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: i % 2 === 0 ? "#FAFAFA" : "#fff", borderRadius: 8, marginBottom: 2 }}>
              <span style={{ flex: 1, fontSize: 13.5, color: "#374151" }}>{s.name}</span>
              <div style={{ display: "flex", gap: 3 }}>
                {LEVELS.map((l, li) => (
                  <div key={l} style={{
                    width: s.level === l ? "auto" : 10, height: 10, borderRadius: s.level === l ? 8 : 5,
                    padding: s.level === l ? "3px 10px" : 0,
                    background: lvlNum[l] <= lvlNum[s.level] ? theme.color : "#E5E7EB",
                    opacity: lvlNum[l] <= lvlNum[s.level] ? (0.35 + (li / 3) * 0.65) : 0.35,
                    fontSize: 10, fontWeight: 700, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.level === l ? l : ""}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 22px", marginTop: 32, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 8 }}>Next steps</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#4B5563", margin: 0 }}>
          Share this summary with your manager ahead of your alignment conversation. Together, you&rsquo;ll discuss areas of agreement, any gaps, and use this as a foundation for your development plan. It&rsquo;s normal for self-assessment and manager assessment to differ on some dimensions.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={printReport} style={{ flex: 1, padding: "12px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "none", background: "#2D6A4F", color: "#fff", cursor: "pointer" }}>Download results</button>
        <button onClick={copyResults} style={{ flex: 1, padding: "12px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>Copy to clipboard</button>
        <button onClick={onRestart} style={{ padding: "12px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#9CA3AF", cursor: "pointer" }}>Restart</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const allQ = THEMES.flatMap((t) => t.subdimensions.map((sd) => ({ theme: t, subdimension: sd })));
  const select = (level) => setAnswers((p) => ({ ...p, [allQ[currentIdx].subdimension.id]: level }));
  const next = () => { if (currentIdx < allQ.length - 1) setCurrentIdx((i) => i + 1); else setScreen("results"); };
  const prev = () => { if (currentIdx > 0) setCurrentIdx((i) => i - 1); };
  const restart = () => { setScreen("intro"); setCurrentIdx(0); setAnswers({}); };

  if (screen === "intro") return <IntroScreen onStart={() => setScreen("questions")} />;
  if (screen === "results") return <ResultsScreen answers={answers} onRestart={restart} />;

  const q = allQ[currentIdx];
  return (
    <div>
      <ProgressBar current={currentIdx} total={allQ.length} themeColor={q.theme.color} />
      <QuestionCard theme={q.theme} subdimension={q.subdimension} selectedLevel={answers[q.subdimension.id] || null} onSelect={select} onNext={next} onPrev={prev} isFirst={currentIdx === 0} isLast={currentIdx === allQ.length - 1} />
    </div>
  );
}
