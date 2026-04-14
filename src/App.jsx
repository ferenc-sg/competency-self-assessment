import { useState, useEffect, useRef } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

// ─── Google Inter font injected once ─────────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
if (typeof document !== "undefined" && !document.getElementById("sg-inter-font")) {
  const l = document.createElement("link");
  l.id = "sg-inter-font"; l.rel = "stylesheet"; l.href = FONT_LINK;
  document.head.appendChild(l);
}
const F = "'Inter', system-ui, sans-serif";

// ─── saas.group BRAND PALETTE ─────────────────────────────────────────────────
const BRAND = {
  black: "#2E2B27", cinnabar: "#F04E23", bitter: "#D95B6F",
  magenta: "#B57DC8", indigo: "#7B6FCC",
  cinnabarTint: "#FDE8E3", bitterTint: "#FAEAED",
  magentaTint: "#F3EAF8", indigoTint: "#EDEAFC",
  cinnabarDark: "#C44220",
};

// ─── GENERAL THEMES ───────────────────────────────────────────────────────────
const GENERAL_THEMES = [
  {
    id: "influence", name: "Influence", fullName: "Scope of influence",
    color: BRAND.cinnabar, lightColor: BRAND.cinnabarTint,
    subdimensions: [
      { id: "cross_functional", name: "Cross-functional impact", statements: {
        IC2: { text: "I work closely with my own team.", example: "Most of my Slack conversations are with people on my own team. If someone from another department needs something, it usually goes through my manager." },
        IC3: { text: "I work primarily in my own function but sometimes collaborate across teams.", example: "I\u2019ve been pulled into a shared channel or meeting with another team to help deliver something \u2014 like joining a call with Support to explain a technical change, or reviewing copy with Marketing." },
        IC4: { text: "I collaborate across seniorities and departments; I may oversee freelancers or manage less senior staff.", example: "My calendar regularly has meetings with people from other departments. I\u2019ve briefed a freelancer or contractor directly, or been the main contact for a cross-team initiative without my manager being involved." },
        IC5: { text: "I regularly partner with senior leadership to align on and advance goals.", example: "I\u2019m in recurring syncs with department heads or brand leads. When a cross-group decision needs input from my area, I\u2019m the person in the room \u2014 not my manager." },
      }},
      { id: "strategy", name: "Strategy", statements: {
        IC2: { text: "I understand my team\u2019s strategy and direction.", example: "If someone asked me \u2018what\u2019s your team focused on this quarter and why?\u2019, I could give a clear answer and explain where my own tasks fit in." },
        IC3: { text: "I apply strategy in my daily work while contributing to team/brand strategy; I influence functional decisions with key insights.", example: "In a planning meeting, I\u2019ve raised something like \u2018our support tickets show users struggle with X \u2014 we should prioritise fixing that\u2019 and it actually influenced what we decided to do." },
        IC4: { text: "I actively contribute to strategic decisions; I advocate for business decisions to wider teams.", example: "I\u2019ve presented a case to people outside my team for why we should change direction \u2014 like arguing we should sunset a feature, enter a new segment, or restructure a workflow \u2014 and it moved the conversation." },
        IC5: { text: "I set functional area strategy (short/medium-term); I lead discussions around team direction and priorities.", example: "I\u2019m the one who writes or owns the strategy doc for my area. When quarterly planning happens, I\u2019m defining the priorities, not just contributing to someone else\u2019s list." },
      }},
      { id: "business_impact", name: "Business / Product impact", statements: {
        IC2: { text: "My direct impact focuses on myself and my immediate peers.", example: "If I disappeared for a week, my team would notice the gap in my tasks \u2014 but teams outside mine probably wouldn\u2019t be affected." },
        IC3: { text: "I lead projects and coordinate cross-functional work.", example: "I\u2019ve owned a project from kickoff to delivery that required getting input or sign-off from people outside my team \u2014 like coordinating a product update that touched engineering, docs, and customer comms." },
        IC4: { text: "I lead high-risk & high-impact projects and process improvements, identify growth opportunities, and own KPIs/roadmap.", example: "There\u2019s a dashboard or OKR with my name next to it. I\u2019ve run a project where failure would have been visible to leadership \u2014 like a migration, a major campaign, or a process overhaul affecting multiple teams." },
        IC5: { text: "I drive strategic impact through projects and initiatives within and beyond my direct brand/team; I act as a multiplier.", example: "Something I built, defined, or initiated is now used by teams beyond my own \u2014 like a playbook another brand adopted, a tool that became the standard, or a process that was rolled out group-wide." },
      }},
    ],
  },
  {
    id: "autonomy", name: "Autonomy", fullName: "Level of autonomy",
    color: BRAND.indigo, lightColor: BRAND.indigoTint,
    subdimensions: [
      { id: "decision_making", name: "Autonomy & decision-making", statements: {
        IC2: { text: "I have limited autonomy and am supported by the team.", example: "Before I send an important message to a stakeholder or merge a significant change, I usually run it by someone more experienced first." },
        IC3: { text: "I am mostly self-reliant and need only occasional supervision. I seek guidance on critical or complex decisions.", example: "I handle my daily work without check-ins, but when something feels risky \u2014 like a choice that\u2019s hard to reverse, or a commitment to a tight deadline \u2014 I flag it to my lead before proceeding." },
        IC4: { text: "I operate autonomously within my scope, with little supervision. I lead projects without formal authority, making well-reasoned decisions and managing trade-offs independently.", example: "I\u2019ve made calls like \u2018we\u2019re cutting this scope to hit the deadline\u2019 or \u2018I\u2019m changing our approach because of Y\u2019 \u2014 and communicated the reasoning afterwards, rather than asking permission upfront." },
        IC5: { text: "I am recognized as a key decision-maker in my scope of expertise and can influence the company\u2019s direction and performance.", example: "When a big decision needs to be made in my domain, people wait for my input before moving forward. My Slack DMs include messages from other teams asking \u2018what do you think we should do about X?\u2019" },
      }},
      { id: "independence", name: "Independence & Guidance", statements: {
        IC2: { text: "I receive clear directions on tasks and priorities. I follow established rules and guidelines and get help from more experienced colleagues.", example: "My tasks usually come from a backlog, a brief, or my manager\u2019s direction. I follow the team\u2019s existing templates, checklists, or workflows to get them done." },
        IC3: { text: "I work with general instructions, defining the path to project completion. I am skilled at task prioritization and self-sufficient in my field.", example: "My manager says \u2018we need to solve X by end of month\u2019 and I figure out the steps, timeline, and who to involve. I don\u2019t need a task list broken down for me." },
        IC4: { text: "I proactively influence team and organizational processes. I support others in prioritizing tasks and improving efficiency.", example: "I\u2019ve changed how the team works \u2014 like replacing a manual reporting step with an automated one, restructuring our standup format, or creating a prioritisation framework colleagues now use to plan their sprints." },
        IC5: { text: "I shape and refine organizational guidelines and frameworks. I define priorities according to the business strategy.", example: "I\u2019ve written guidelines that live in our Notion or wiki and that people across the group reference \u2014 like an evaluation framework, a hiring rubric, or a decision-making policy for my area." },
      }},
    ],
  },
  {
    id: "complexity", name: "Complexity", fullName: "Complexity & problem solving",
    color: BRAND.bitter, lightColor: BRAND.bitterTint,
    subdimensions: [
      { id: "tasks_complexity", name: "Tasks complexity", statements: {
        IC2: { text: "I tackle straightforward, small to medium tasks confidently.", example: "My typical week involves clearly scoped work \u2014 like closing tickets, writing a blog post from a brief, fixing a known bug, or updating a spreadsheet. I deliver these reliably without hand-holding." },
        IC3: { text: "I deliver high-quality work, lead smaller projects, and contribute to larger ones.", example: "I\u2019ve owned something with a beginning, middle, and end \u2014 like running a campaign, shipping a feature, or setting up a new vendor \u2014 while also contributing meaningfully to a bigger initiative led by someone else." },
        IC4: { text: "I manage complex, large-scale projects across teams and departments.", example: "I\u2019ve run a project with a shared Slack channel, a project tracker, multiple workstreams, and dependencies on other teams\u2019 timelines \u2014 like a platform migration, a rebrand, or a multi-market launch." },
        IC5: { text: "I own and lead large, complex projects across the organization.", example: "I get handed the problems where the scope is unclear, the stakeholders are many, and there\u2019s no existing playbook \u2014 like designing a new operating model, building a function from scratch, or leading a group-wide transformation." },
      }},
      { id: "process", name: "Process ownership & Innovation", statements: {
        IC2: { text: "I use familiar tools and methods to solve problems.", example: "I work with the tools the team already uses \u2014 Jira, Notion, Google Sheets, our CMS \u2014 and I follow the workflows that are already in place. I\u2019m getting good at them." },
        IC3: { text: "I identify opportunities for improvement with new tools and methods.", example: "I noticed we were doing something manually that could be automated, or that a step in our process was creating a bottleneck \u2014 and I proposed a fix, like setting up a Zapier flow or suggesting a better template." },
        IC4: { text: "I develop complex processes and set high work standards.", example: "There\u2019s a process the team now follows that I designed \u2014 like a QA checklist, a content review pipeline, an incident response workflow, or a candidate evaluation rubric. It raised the bar for how we work." },
        IC5: { text: "I develop systems and processes that enhance team effectiveness.", example: "I\u2019ve built something that teams beyond mine adopted as their standard \u2014 like defining the group-wide retrospective format, creating a shared reporting framework, or authoring the SOP for a critical function." },
      }},
      { id: "expertise", name: "Expertise & team contribution", statements: {
        IC2: { text: "I learn and progress quickly, am eager to ask questions, and actively seek out feedback.", example: "I regularly ask colleagues to review my work, I take notes in 1:1s about what to improve, and my manager has commented that I\u2019m picking things up faster than expected." },
        IC3: { text: "I assist in training new team members and provide feedback.", example: "When a new person joined, I walked them through our tools and processes during their first week. I\u2019ve also given a colleague feedback on a deliverable that helped them improve it before sharing it wider." },
        IC4: { text: "I possess deep expertise, mentor juniors, share market insights, and provide proactive feedback.", example: "Teammates DM me with questions like \u2018how should I approach this?\u2019 because they know I have deep knowledge in my area. I don\u2019t wait to be asked \u2014 I flag issues when I see them." },
        IC5: { text: "I act as a subject matter expert and thought leader, providing mentoring and feedback across teams.", example: "People from other brands or teams reach out to me for advice. I\u2019ve given an internal talk, published a reference doc that became widely used, or been asked to weigh in on decisions outside my immediate scope." },
      }},
      { id: "problem_solving", name: "Problem-solving", statements: {
        IC2: { text: "I identify simple problems and seek assistance from colleagues to resolve them.", example: "I noticed the numbers in a report didn\u2019t add up and flagged it to my lead, or I spotted a broken link on our site and raised it in Slack so someone with access could fix it." },
        IC3: { text: "I solve complex problems using data to make decisions, both in my role and across the team.", example: "I pulled data from our analytics to figure out why a metric was dropping, built a hypothesis, and proposed a specific fix \u2014 rather than just reporting that something looked off." },
        IC4: { text: "I resolve complex issues independently and contribute to innovative solutions.", example: "I\u2019ve solved a problem that didn\u2019t have an obvious answer \u2014 like finding a workaround for a platform limitation, redesigning a workflow under time pressure, or untangling a data mess that had been confusing the team for weeks." },
        IC5: { text: "I solve the most challenging problems faced by my team.", example: "When the team hits a wall \u2014 a system nobody fully understands, a strategic question with no clear answer, a conflict between competing priorities \u2014 I\u2019m the one they turn to, and I usually find a path forward." },
      }},
    ],
  },
  {
    id: "ai", name: "AI Fluency", fullName: "AI fluency",
    color: BRAND.magenta, lightColor: BRAND.magentaTint,
    subdimensions: [
      { id: "ai_application", name: "AI application & effectiveness", statements: {
        IC2: { text: "I use 1\u20132 AI tools regularly for simple tasks (e.g., drafting, summarizing). I tend to accept outputs at face value and have limited instinct for iteration or refinement.", example: "I open ChatGPT a few times a week for things like \u2018rewrite this email\u2019 or \u2018summarise these notes\u2019. If the output isn\u2019t great, I usually just edit it manually rather than trying a different prompt." },
        IC3: { text: "I use multiple AI tools as a genuine part of my workflow with tangible impact \u2014 time saved, quality improved, scope expanded. I actively adjust prompts, context, and constraints to get quality output.", example: "I could show you a before/after of how AI changed a specific workflow \u2014 like cutting my weekly reporting time in half, or using Claude to draft and iterate on customer-facing copy that used to take me a full afternoon." },
        IC4: { text: "AI is embedded in how I work, with agentic tools or custom workflows tailored to my role. I use structured prompting techniques and critically evaluate outputs.", example: "I\u2019ve set up custom instructions or saved prompt chains for recurring tasks. When a new AI tool gets hyped, I don\u2019t just try it \u2014 I check what data it accesses, how it integrates with our stack, and whether it actually solves a problem we have." },
        IC5: { text: "AI is deeply embedded across all aspects of my work. I master advanced prompting and orchestration patterns and develop reusable prompt libraries for my function.", example: "I maintain a shared prompt library or tool evaluation doc that my function references. When leadership asks \u2018should we adopt X?\u2019 I\u2019m the one who writes the recommendation \u2014 with evidence, not enthusiasm." },
      }},
      { id: "ai_enablement", name: "AI enablement & advocacy",
        note: "This sub-dimension describes valued enabling behaviours \u2014 not hard requirements. How you enable AI adoption will look different depending on your role, team size, and individual style.",
        statements: {
          IC2: { text: "I share occasional AI tips or resources with colleagues. I am open to learning from others\u2019 AI use cases.", example: "I forwarded an interesting AI article in Slack, or asked a colleague \u2018how did you make that?\u2019 when they showed something they\u2019d built with an AI tool." },
          IC3: { text: "I contribute to team AI knowledge by sharing use cases or workflows that worked. I may introduce tools or approaches to peers.", example: "I screen-shared my AI workflow in a team meeting and a couple of people started doing it the same way. Or I posted a \u2018this worked well for me\u2019 message in our team channel with a prompt I found effective." },
          IC4: { text: "I actively support AI adoption in my team: I share best practices, help colleagues get started, or identify AI opportunities in others\u2019 workflows.", example: "I sat with a teammate who wasn\u2019t using AI and helped them set up a workflow for their specific tasks. Or I created a shared doc with prompts and tips that the team now references, or ran a 15-minute demo in our team meeting." },
          IC5: { text: "I champion AI as a multiplier for team effectiveness. I build internal guides, define best practices, and create adoption roadmaps.", example: "I\u2019ve created something that lives beyond my team \u2014 like an internal AI playbook, a quarterly adoption review, or a cross-functional working group on how we integrate AI responsibly across the organisation." },
        },
      },
    ],
  },
  {
    id: "collaboration", name: "Collaboration", fullName: "Communication & Collaboration",
    color: BRAND.cinnabar, lightColor: BRAND.cinnabarTint,
    subdimensions: [
      { id: "communication", name: "Communication", statements: {
        IC2: { text: "I communicate effectively in English; I express my thoughts clearly, succinctly, and constructively.", example: "My Slack messages and emails are clear enough that people don\u2019t need follow-up questions to understand what I mean. In meetings, I can share my point without going in circles." },
        IC3: { text: "I explain complex concepts clearly. I effectively advocate for ideas and push back when necessary.", example: "I\u2019ve explained something technical to a non-technical stakeholder and they got it. I\u2019ve also said \u2018I don\u2019t think that\u2019s the right approach, here\u2019s why\u2019 in a meeting \u2014 and it landed well." },
        IC4: { text: "I ensure open and effective communication across all levels of the organization.", example: "I write updates that work for both my team and senior leadership without needing two versions. People at different levels feel equally comfortable asking me questions or giving me feedback." },
        IC5: { text: "I communicate the most complex ideas simply and clearly.", example: "I\u2019ve taken something genuinely hard to explain \u2014 like a technical architecture decision, a nuanced market analysis, or a sensitive org change \u2014 and communicated it so clearly that it unlocked a decision that had been stuck." },
      }},
      { id: "collab_stakeholder", name: "Collaboration & stakeholder management", statements: {
        IC2: { text: "I keep everyone updated on task progress. I provide timely, constructive feedback, seek help when blocked, and align with team values.", example: "My team doesn\u2019t have to chase me for updates \u2014 I post progress in our standup or channel. When I\u2019m stuck, I say so within hours, not days." },
        IC3: { text: "I share knowledge and motivate teammates; I live team values and set a positive example.", example: "I\u2019ve shared a useful article, paired with someone on a tough problem, or jumped in to help a teammate hit a deadline \u2014 not because I was asked, but because I noticed they needed it." },
        IC4: { text: "I independently manage stakeholder relationships; I am able to mediate and resolve conflicts. I embody and promote team values as a role model.", example: "I\u2019ve handled a tense situation between colleagues or teams without escalating to my manager \u2014 like realigning expectations when a deliverable was at risk, or mediating when two people disagreed on an approach." },
        IC5: { text: "I facilitate collaboration, foster open communication and a culture of shared success. I proactively surface and address team-wide concerns.", example: "I\u2019ve noticed a brewing issue \u2014 like growing friction between teams, or a process quietly frustrating everyone \u2014 and I brought it up, facilitated a conversation, and helped resolve it before it became a real problem." },
      }},
    ],
  },
];

// ─── ACCOUNTING FUNCTIONAL THEMES ────────────────────────────────────────────
const FUNCTIONAL_THEMES = [
  {
    id: "acc_standards", name: "Standards", fullName: "Accounting Standards & Compliance",
    color: "#C44220", lightColor: "#FCDDD6",
    subdimensions: [
      { id: "standards_knowledge", name: "Standards knowledge & application", statements: {
        IC2: { text: "I have foundational awareness of the company\u2019s primary accounting standard and apply it to routine transactions under guidance.", example: "I know which standard we follow and can apply basic entries correctly, but I check with a senior colleague when something looks unusual." },
        IC3: { text: "I apply our primary accounting standard confidently to day-to-day transactions; I understand key GAAP vs. IFRS differences and flag compliance issues proactively.", example: "I handle the month-end without guidance on most entries. I\u2019ve flagged a treatment to my manager before it became an issue \u2014 like questioning whether an item should be capitalised or expensed." },
        IC4: { text: "I interpret and apply accounting standards to complex or non-routine transactions and act as the internal go-to for standards questions.", example: "Colleagues come to me when a new deal structure or transaction type comes up and they\u2019re unsure how to account for it. I\u2019ve researched and documented the treatment for something like a lease modification or an acquisition." },
        IC5: { text: "I am the recognised authority on US GAAP, IFRS, and local GAAPs; I own the company\u2019s accounting policy framework and advise senior leadership on strategic implications.", example: "When we considered entering a new market or acquired a company, I was involved in the due diligence to assess accounting implications. I\u2019ve written or updated the group\u2019s accounting policy manual." },
      }},
    ],
  },
  {
    id: "acc_operations", name: "Operations", fullName: "Core Accounting Operations",
    color: "#B8495F", lightColor: "#F7E0E4",
    subdimensions: [
      { id: "accounting_cycle", name: "Accounting cycle & period-end close", statements: {
        IC2: { text: "I process routine transactions accurately and complete assigned month-end tasks from a checklist with guidance.", example: "I post invoices, reconcile assigned accounts, and clear items from the close checklist reliably. I flag anything I\u2019m not sure about rather than guessing." },
        IC3: { text: "I independently manage an AR, AP, or Payroll sub-function end-to-end and own a set of GL accounts through period-end close.", example: "I run the AP process without supervision \u2014 from invoice approval to payment run \u2014 and complete the close for my accounts on time each month without being chased." },
        IC4: { text: "I oversee the full month/quarter/year-end close across multiple entities, review journal entries, and lead tax compliance across jurisdictions.", example: "I manage the close calendar for multiple entities and review the team\u2019s entries before sign-off. I coordinate with external advisors for VAT or WHT filings and resolve any issues before the deadline." },
        IC5: { text: "I set the standard for accounting operations quality across the organisation; I design and own the global close process and drive the tax strategy.", example: "I\u2019ve redesigned the close process to reduce cycle time, or led the consolidation across entities during a period of rapid growth. I own the relationship with tax advisors and sign off on the group\u2019s tax position." },
      }},
    ],
  },
  {
    id: "acc_revenue", name: "Revenue", fullName: "Revenue Recognition & Billing",
    color: "#5E51A3", lightColor: "#E8E5F8",
    subdimensions: [
      { id: "rev_rec", name: "Revenue recognition (ASC 606 / IFRS 15)", statements: {
        IC2: { text: "I understand the basic 5-step model of ASC 606 / IFRS 15 and assist with processing subscription invoices and reconciling billing data.", example: "I can explain the 5 steps and apply them to a straightforward subscription. I reconcile the deferred revenue schedule each month with help from a senior colleague when something doesn\u2019t tie." },
        IC3: { text: "I apply revenue recognition principles to standard SaaS contracts and independently maintain deferred and accrued revenue schedules.", example: "I close the revenue subledger each month without oversight, including deferred revenue roll-forwards. I flag when a new contract type looks different and investigate the right treatment." },
        IC4: { text: "I analyse complex contract structures, own the revenue close, and partner with Sales and Legal on deal structuring.", example: "I\u2019ve reviewed a multi-element arrangement or variable consideration clause and documented the accounting treatment. I\u2019m involved in deal review calls to catch revenue recognition issues before a contract is signed." },
        IC5: { text: "I define the revenue recognition framework for the organisation and am the ultimate authority on complex revenue scenarios.", example: "I\u2019ve written or owned the revenue recognition policy. When a novel deal structure comes up \u2014 like a usage-based model, a reseller arrangement, or a bundled offering \u2014 I\u2019m the decision-maker on how to account for it." },
      }},
    ],
  },
  {
    id: "acc_reporting", name: "Reporting", fullName: "Financial Reporting & Group Consolidation",
    color: "#9A5CA8", lightColor: "#F0E4F7",
    subdimensions: [
      { id: "reporting", name: "Reporting & consolidation", statements: {
        IC2: { text: "I prepare standard recurring reports using templates and gather data for management reporting packs; I am learning intercompany eliminations under guidance.", example: "I produce the weekly or monthly P&L from a template and pull the numbers into the management pack. My manager reviews my intercompany entries before they go in." },
        IC3: { text: "I produce management reporting packs with commentary, perform intercompany reconciliations, and deliver meaningful variance analysis.", example: "I write the commentary for the management pack \u2014 including \u2018revenue was up 12% driven by X, offset by Y\u2019 \u2014 and I resolve intercompany mismatches before the close without being asked." },
        IC4: { text: "I lead consolidated group financial statement preparation across multiple entities and partner with FP&A on budget and forecast inputs.", example: "I run the consolidation across entities including FX translation and intercompany eliminations. FP&A comes to me to align on what the actuals mean before they update the forecast." },
        IC5: { text: "I define the group reporting framework; I am accountable for all external and internal financial reporting and drive narrative at Board and investor level.", example: "I own the Board pack and the investor reporting. When there\u2019s a question about what a number means or how it\u2019s presented, I\u2019m the person who decides \u2014 not someone who escalates." },
      }},
    ],
  },
  {
    id: "acc_audit", name: "Audit & Controls", fullName: "Audit & Internal Controls",
    color: "#A83B50", lightColor: "#F5D9DE",
    subdimensions: [
      { id: "audit_controls", name: "Audit readiness & control environment", statements: {
        IC2: { text: "I prepare assigned audit schedules accurately and on time and follow internal controls in day-to-day work.", example: "I provide my audit samples on time and in the format the auditors requested. I follow the approval workflow for every payment \u2014 even when it would be faster not to." },
        IC3: { text: "I independently prepare audit files, respond to auditor queries, maintain control documentation, and track findings through remediation.", example: "I handle my own audit areas from start to finish \u2014 preparing evidence, responding to queries, and following up on any points raised. I keep the control matrix updated without being reminded." },
        IC4: { text: "I lead the annual audit process end-to-end, design and monitor the internal control framework, and manage the external auditor relationship year-round.", example: "I run the audit kick-off, coordinate fieldwork across the team, and manage the auditor relationship throughout the year \u2014 not just during fieldwork. I\u2019ve redesigned a control after a gap was identified." },
        IC5: { text: "I own the organisation\u2019s audit and controls strategy; I design the control environment for new entities or geographies and champion a culture of continuous improvement.", example: "When we set up a new entity or entered a new market, I defined the control framework from scratch. I\u2019ve turned an audit finding into a group-wide policy change." },
      }},
    ],
  },
  {
    id: "acc_systems", name: "Systems & Tools", fullName: "Systems, Tools & Process Improvement",
    color: "#7360C0", lightColor: "#EAE7FA",
    subdimensions: [
      { id: "systems_process", name: "Systems proficiency & process optimisation", statements: {
        IC2: { text: "I use the primary accounting system for routine tasks, adhere to data-entry standards, and flag manual or repetitive tasks as improvement opportunities.", example: "I\u2019m comfortable in our ERP for day-to-day work. I\u2019ve mentioned to my manager that a step we do manually every month could probably be automated." },
        IC3: { text: "I use advanced system features, implement small-scale process improvements, and use AI tools to boost personal productivity.", example: "I\u2019ve set up a recurring journal template, built a report in the ERP that saves the team time, or used AI to speed up a reconciliation that used to take me half a day." },
        IC4: { text: "I lead system configuration changes and new module rollouts, drive meaningful process improvement projects, and evaluate new tooling.", example: "I led the implementation of a new AP automation module, or redesigned the month-end close process to cut two days off the cycle. I\u2019ve assessed two or three tools before recommending one to leadership." },
        IC5: { text: "I define the accounting systems and technology roadmap; I lead ERP upgrades or migrations and pioneer a culture of continuous improvement.", example: "I\u2019ve led or project-managed a full ERP implementation or migration. I present a systems roadmap to leadership annually and I\u2019m the person who spots where automation could transform how finance operates." },
      }},
    ],
  },
];

const LEVELS = ["IC2", "IC3", "IC4", "IC5"];
const LEVEL_LABELS = { IC2: "Beginner", IC3: "Proficient", IC4: "Fully proficient", IC5: "Domain expert" };
const STORAGE_KEY = "sg_cf_accounting_v1";

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  const [name, setName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const totalQ = GENERAL_THEMES.flatMap(t => t.subdimensions).length + FUNCTIONAL_THEMES.flatMap(t => t.subdimensions).length;
  const canStart = name.trim().length > 1 && memberEmail.includes("@");
  const inp = { width:"100%", padding:"11px 14px", fontSize:14, borderRadius:10, boxSizing:"border-box", border:"1.5px solid #E5E7EB", outline:"none", fontFamily:F, color:BRAND.black, background:"#fff" };
  return (
    <div style={{ maxWidth:620, margin:"0 auto", padding:"48px 20px 48px", fontFamily:F }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:BRAND.cinnabar, background:BRAND.cinnabarTint, padding:"4px 10px", borderRadius:4, marginBottom:16, fontFamily:F }}>Career Framework \u00b7 Accounting</div>
        <h1 style={{ fontSize:34, fontWeight:800, color:BRAND.black, lineHeight:1.15, margin:"0 0 10px", fontFamily:F }}>Self-assessment<br/>levelling exercise</h1>
        <p style={{ fontSize:15, color:"#6B7280", margin:0, fontFamily:F }}>{totalQ} questions \u00b7 ~12 minutes</p>
      </div>
      <div style={{ fontSize:14, lineHeight:1.75, color:"#374151", marginBottom:24, fontFamily:F }}>
        <p style={{ margin:"0 0 10px" }}>This exercise helps you reflect on where you currently stand across both the <strong>general</strong> competencies shared across all roles and the <strong>functional</strong> competencies specific to the Accounting job family.</p>
        <p style={{ margin:0, fontSize:13.5, color:"#6B7280" }}>Each statement includes a real-life example in italics to help you picture what that level looks like in practice. Choose the one that best describes how you work <em>today</em>.</p>
      </div>
      <div style={{ background:"#FAFAFA", border:"1px solid #E5E7EB", borderRadius:14, padding:"20px 22px", marginBottom:24, fontFamily:F }}>
        <div style={{ fontWeight:600, fontSize:13, color:BRAND.black, marginBottom:16 }}>Before you begin</div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12.5, fontWeight:600, color:"#374151", marginBottom:6, fontFamily:F }}>Your full name <span style={{ color:BRAND.cinnabar }}>*</span></label>
          <input type="text" placeholder="e.g. Maria Santos" value={name} onChange={e => setName(e.target.value)} style={inp}
            onFocus={e => (e.target.style.borderColor=BRAND.cinnabar)} onBlur={e => (e.target.style.borderColor="#E5E7EB")} />
          <p style={{ fontSize:11.5, color:"#9CA3AF", margin:"5px 0 0", fontFamily:F }}>Appears on your results so your manager can identify the submission.</p>
        </div>
        <div>
          <label style={{ display:"block", fontSize:12.5, fontWeight:600, color:"#374151", marginBottom:6, fontFamily:F }}>Your email address <span style={{ color:BRAND.cinnabar }}>*</span></label>
          <input type="email" placeholder="e.g. maria@saas.group" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} style={inp}
            onFocus={e => (e.target.style.borderColor=BRAND.cinnabar)} onBlur={e => (e.target.style.borderColor="#E5E7EB")} />
          <p style={{ fontSize:11.5, color:"#9CA3AF", margin:"5px 0 0", fontFamily:F }}>You\u2019ll be reminded to CC yourself when sharing results.</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:24 }}>
        <div style={{ flex:1, background:BRAND.cinnabarTint, border:"1px solid "+BRAND.cinnabar+"40", borderRadius:12, padding:"14px 16px", fontFamily:F }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:BRAND.cinnabar, marginBottom:5 }}>Part 1</div>
          <div style={{ fontSize:14, fontWeight:700, color:BRAND.black, marginBottom:3 }}>General competencies</div>
          <div style={{ fontSize:12, color:"#6B7280" }}>{GENERAL_THEMES.flatMap(t=>t.subdimensions).length} questions \u00b7 5 themes</div>
        </div>
        <div style={{ flex:1, background:BRAND.indigoTint, border:"1px solid "+BRAND.indigo+"40", borderRadius:12, padding:"14px 16px", fontFamily:F }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:BRAND.indigo, marginBottom:5 }}>Part 2</div>
          <div style={{ fontSize:14, fontWeight:700, color:BRAND.black, marginBottom:3 }}>Accounting competencies</div>
          <div style={{ fontSize:12, color:"#6B7280" }}>{FUNCTIONAL_THEMES.flatMap(t=>t.subdimensions).length} questions \u00b7 6 competencies</div>
        </div>
      </div>
      <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:"16px 20px", marginBottom:32, fontFamily:F }}>
        <div style={{ fontWeight:600, fontSize:13, color:BRAND.black, marginBottom:8 }}>Tips for honest self-assessment</div>
        <ul style={{ margin:0, paddingLeft:18, fontSize:13, lineHeight:1.8, color:"#4B5563" }}>
          <li style={{ marginBottom:2 }}>Choose the level where you <em>consistently</em> operate \u2014 not your best day or a one-off achievement.</li>
          <li style={{ marginBottom:2 }}>It\u2019s normal to be at different levels across different sub-dimensions.</li>
          <li style={{ marginBottom:2 }}>If you\u2019re between two levels, pick the one that feels like your everyday reality.</li>
          <li>Your manager will complete a parallel assessment \u2014 differences are healthy starting points for discussion.</li>
        </ul>
      </div>
      <button onClick={() => canStart && onStart(name.trim(), memberEmail.trim())} disabled={!canStart}
        style={{ width:"100%", padding:"15px 24px", fontSize:15, fontWeight:600, color:"#fff", background:canStart?BRAND.cinnabar:"#D1D5DB", border:"none", borderRadius:12, cursor:canStart?"pointer":"default", transition:"background 0.2s", fontFamily:F }}
        onMouseEnter={e => { if(canStart) e.currentTarget.style.background=BRAND.cinnabarDark; }}
        onMouseLeave={e => { if(canStart) e.currentTarget.style.background=canStart?BRAND.cinnabar:"#D1D5DB"; }}>
        Begin self-assessment
      </button>
      {!canStart && <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", margin:"8px 0 0", fontFamily:F }}>Please enter your name and email to continue.</p>}
    </div>
  );
}

// ─── PHASE TRANSITION ─────────────────────────────────────────────────────────
function PhaseTransitionScreen({ onContinue }) {
  return (
    <div style={{ maxWidth:620, margin:"0 auto", padding:"64px 20px 48px", textAlign:"center", fontFamily:F }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,"+BRAND.cinnabarTint+",#FBD0C6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", fontSize:28 }}>&#10003;</div>
      <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:BRAND.cinnabar, background:BRAND.cinnabarTint, padding:"4px 10px", borderRadius:4, marginBottom:16 }}>Part 1 complete</div>
      <h2 style={{ fontSize:28, fontWeight:700, color:BRAND.black, margin:"0 0 14px", fontFamily:F }}>General competencies done</h2>
      <p style={{ fontSize:14.5, color:"#6B7280", lineHeight:1.7, margin:"0 0 36px", maxWidth:460, marginLeft:"auto", marginRight:"auto" }}>
        Great work. You\u2019re now moving into <strong style={{ color:BRAND.black }}>Part 2 \u2014 Accounting-specific competencies</strong>. These 6 questions focus on the technical skills specific to your role.
      </p>
      <div style={{ background:BRAND.indigoTint, border:"1px solid "+BRAND.indigo+"30", borderRadius:14, padding:"20px 24px", marginBottom:36, textAlign:"left" }}>
        <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:BRAND.indigo, marginBottom:12 }}>Accounting competencies covered</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {FUNCTIONAL_THEMES.map((t,i) => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:"50%", background:t.color, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
              <span style={{ fontSize:13, color:"#374151", fontWeight:500 }}>{t.fullName}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onContinue} style={{ width:"100%", padding:"15px 24px", fontSize:15, fontWeight:600, color:"#fff", background:BRAND.indigo, border:"none", borderRadius:12, cursor:"pointer", fontFamily:F }}
        onMouseEnter={e => (e.currentTarget.style.background="#5E51A3")}
        onMouseLeave={e => (e.currentTarget.style.background=BRAND.indigo)}>
        Continue to Part 2
      </button>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, themeColor, phase }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ position:"sticky", top:0, zIndex:10, background:"rgba(255,255,255,0.94)", backdropFilter:"blur(8px)", borderBottom:"1px solid #E5E7EB", padding:"10px 20px", fontFamily:F }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:620, margin:"0 auto 6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:themeColor, background:themeColor+"18", padding:"2px 8px", borderRadius:4 }}>
            {phase==="general"?"Part 1 \u00b7 General":"Part 2 \u00b7 Accounting"}
          </span>
          <span style={{ fontSize:12, fontWeight:600, color:"#9CA3AF" }}>Q {current+1} of {total}</span>
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:themeColor }}>{pct}%</span>
      </div>
      <div style={{ maxWidth:620, margin:"0 auto", height:4, background:"#E5E7EB", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:pct+"%", background:themeColor, borderRadius:2, transition:"width 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
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
    el.style.opacity = "0"; el.style.transform = "translateY(16px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.32s ease, transform 0.32s ease";
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [subdimension.id]);
  return (
    <div ref={wrapRef} style={{ maxWidth:620, margin:"0 auto", padding:"28px 20px 40px", fontFamily:F }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 13px", borderRadius:20, background:theme.lightColor, marginBottom:14 }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:theme.color }} />
        <span style={{ fontSize:11.5, fontWeight:600, color:theme.color, fontFamily:F }}>{theme.name}</span>
      </div>
      <h2 style={{ fontSize:22, fontWeight:700, color:BRAND.black, margin:"0 0 4px", fontFamily:F }}>{subdimension.name}</h2>
      {subdimension.note && (
        <div style={{ fontSize:12.5, lineHeight:1.6, color:"#92400E", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8, padding:"10px 14px", margin:"10px 0 16px", fontFamily:F }}>{subdimension.note}</div>
      )}
      <p style={{ fontSize:13.5, color:"#9CA3AF", margin:"0 0 20px", lineHeight:1.5, fontFamily:F }}>Which statement best describes how you consistently operate?</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {LEVELS.map(level => {
          const item = subdimension.statements[level];
          const sel = selectedLevel === level;
          const text = typeof item === "object" ? item.text : item;
          const example = typeof item === "object" ? item.example : null;
          return (
            <button key={level} onClick={() => onSelect(level)}
              style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"14px 16px", borderRadius:10, cursor:"pointer", border:sel?"2px solid "+theme.color:"1.5px solid #E5E7EB", background:sel?theme.lightColor:"#fff", textAlign:"left", transition:"all 0.15s ease", fontFamily:F }}
              onMouseEnter={e => { if(!sel) e.currentTarget.style.borderColor="#CBD5E1"; }}
              onMouseLeave={e => { if(!sel) e.currentTarget.style.borderColor="#E5E7EB"; }}>
              <div style={{ minWidth:20, height:20, borderRadius:"50%", marginTop:2, border:sel?"6px solid "+theme.color:"2px solid #D1D5DB", background:"#fff", boxSizing:"border-box", transition:"all 0.15s ease", flexShrink:0 }} />
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13.5, lineHeight:1.6, color:sel?BRAND.black:"#4B5563", fontFamily:F }}>{text}</div>
                {example && <div style={{ fontSize:12, lineHeight:1.55, color:sel?"#6B7280":"#9CA3AF", fontStyle:"italic", marginTop:5, fontFamily:F }}>{example}</div>}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, gap:12 }}>
        <button onClick={onPrev} disabled={isFirst}
          style={{ padding:"11px 22px", fontSize:13.5, fontWeight:600, borderRadius:10, border:"1px solid #E5E7EB", background:"#fff", color:isFirst?"#D1D5DB":BRAND.black, cursor:isFirst?"default":"pointer", fontFamily:F }}>Back</button>
        <button onClick={onNext} disabled={!selectedLevel}
          style={{ padding:"11px 28px", fontSize:13.5, fontWeight:600, borderRadius:10, border:"none", background:selectedLevel?theme.color:"#D1D5DB", color:"#fff", cursor:selectedLevel?"pointer":"default", transition:"background 0.2s", fontFamily:F }}>
          {isLast?"View results":"Next"}
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ answers, memberName, memberEmail, onRestart }) {
  const [copied, setCopied] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const topRef = useRef(null);
  useEffect(() => { topRef.current?.scrollIntoView({ behavior:"smooth" }); }, []);

  const lvlNum = { IC2:2, IC3:3, IC4:4, IC5:5 };
  const numLvl = { 2:"IC2", 3:"IC3", 4:"IC4", 5:"IC5" };
  const completedDate = new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });

  const calcResults = themes => themes.map(theme => {
    const scores = theme.subdimensions.map(sd => ({ name:sd.name, level:answers[sd.id], num:lvlNum[answers[sd.id]]||0 }));
    const avg = scores.reduce((s,r) => s+r.num,0) / scores.length;
    return { theme, scores, avg, dominant:numLvl[Math.round(avg)]||"IC3" };
  });

  const generalResults = calcResults(GENERAL_THEMES);
  const functionalResults = calcResults(FUNCTIONAL_THEMES);
  const allResults = [...generalResults, ...functionalResults];
  const generalAvg = generalResults.reduce((s,t)=>s+t.avg,0)/generalResults.length;
  const functionalAvg = functionalResults.reduce((s,t)=>s+t.avg,0)/functionalResults.length;
  const overallAvg = (generalAvg+functionalAvg)/2;
  const overallLevel = numLvl[Math.round(overallAvg)]||"IC3";
  const generalLevel = numLvl[Math.round(generalAvg)]||"IC3";
  const functionalLevel = numLvl[Math.round(functionalAvg)]||"IC3";

  // ── Radar data — both general + functional themes ──────────────────────────
  const radarData = allResults.map(({ theme, avg }) => ({
    area: theme.name,
    score: parseFloat(avg.toFixed(2)),
    fullMark: 5,
  }));

  // ── PDF with full colours ──────────────────────────────────────────────────
  const downloadPdf = () => {
    const sections = [
      { label:"Part 1 \u00b7 General Competencies", results:generalResults },
      { label:"Part 2 \u00b7 Accounting Functional Competencies", results:functionalResults },
    ];
    const rows = sections.map(({ label, results }) =>
      `<tr><td colspan="3" style="-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:14px 16px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;background:#F9FAFB;border-top:2px solid #E5E7EB;">${label}</td></tr>` +
      results.flatMap(({ theme, scores, avg, dominant }) =>
        scores.map((s,i) =>
          `<tr>` +
          (i===0 ? `<td rowspan="${scores.length}" style="-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:10px 12px;vertical-align:top;font-weight:700;font-size:11px;color:#fff;background:${theme.color};border-radius:4px;white-space:nowrap;line-height:1.4;">${theme.fullName||theme.name}${scores.length>1?`<div style="font-size:9px;font-weight:500;margin-top:4px;opacity:0.85;">${dominant} \u00b7 avg ${avg.toFixed(1)}</div>`:" "}</td>` : "") +
          `<td style="padding:9px 14px;font-size:12.5px;color:#374151;border-bottom:1px solid #F3F4F6;">${s.name}</td>` +
          `<td style="-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:9px 14px;text-align:center;border-bottom:1px solid #F3F4F6;"><span style="display:inline-block;padding:3px 10px;border-radius:20px;background:${theme.color};color:#fff;font-size:11px;font-weight:700;">${s.level||"\u2014"}</span><div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${LEVEL_LABELS[s.level]||""}</div></td>` +
          `</tr>`
        )
      ).join("")
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${memberName} \u2014 Self-Assessment</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:#F3F4F6;padding:28px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.wrap{max-width:700px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:${BRAND.cinnabar};padding:24px 32px}
.hdr .tag{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:6px}
.hdr h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}
.hdr .sub{font-size:12px;color:rgba(255,255,255,0.8)}
.sum{display:flex;margin:22px 32px 16px;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:linear-gradient(135deg,${BRAND.cinnabarTint},${BRAND.indigoTint})}
.sum .ov{flex:0 0 36%;text-align:center;padding:18px;border-right:1px solid #E5E7EB}
.sum .ov .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px}
.sum .ov .lvl{font-size:38px;font-weight:800;color:${BRAND.black};line-height:1}
.sum .ov .nm{font-size:12px;color:#374151;font-weight:500;margin-top:3px}
.sum .ov .av{font-size:10px;color:#9CA3AF;margin-top:3px}
.sum .pts{flex:1;padding:12px;display:flex;flex-direction:column;gap:7px}
.sum .pt{background:#fff;border-radius:7px;padding:9px 12px;border:1px solid #E5E7EB}
.sum .pt .ptg{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px}
.sum .pt .pl{font-size:15px;font-weight:800;color:${BRAND.black}}
.sum .pt .pn{font-size:10px;color:#6B7280;margin-left:4px}
.tip{margin:0 32px 14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:9px 12px;font-size:11.5px;color:#92400E}
table{width:calc(100% - 64px);margin:0 32px 24px;border-collapse:collapse;font-size:13px}
.ftr{background:#F9FAFB;padding:12px 32px;border-top:1px solid #E5E7EB;font-size:10px;color:#9CA3AF}
@media print{body{background:#fff;padding:0}.wrap{box-shadow:none;border-radius:0}.tip{display:none}}
</style></head><body>
<div class="wrap">
<div class="hdr"><div class="tag">Career Framework \u00b7 Accounting</div><h1>Self-Assessment Results \u2014 ${memberName}</h1><div class="sub">Completed ${completedDate}</div></div>
<div class="sum">
  <div class="ov"><div class="lbl">Overall indicative level</div><div class="lvl">${overallLevel}</div><div class="nm">${LEVEL_LABELS[overallLevel]}</div><div class="av">avg ${overallAvg.toFixed(1)}</div></div>
  <div class="pts">
    <div class="pt"><div class="ptg" style="-webkit-print-color-adjust:exact;print-color-adjust:exact;color:${BRAND.cinnabar};">Part 1 \u00b7 General</div><span class="pl">${generalLevel}</span><span class="pn">${LEVEL_LABELS[generalLevel]} \u00b7 avg ${generalAvg.toFixed(1)}</span></div>
    <div class="pt"><div class="ptg" style="-webkit-print-color-adjust:exact;print-color-adjust:exact;color:${BRAND.indigo};">Part 2 \u00b7 Accounting</div><span class="pl">${functionalLevel}</span><span class="pn">${LEVEL_LABELS[functionalLevel]} \u00b7 avg ${functionalAvg.toFixed(1)}</span></div>
  </div>
</div>
<div class="tip">\ud83d\udca1 To save as PDF: <strong>File \u2192 Print \u2192 Save as PDF</strong> &nbsp;\u00b7&nbsp; Make sure <strong>"Background graphics"</strong> is checked in print settings to preserve colours.</div>
<table><tbody>${rows}</tbody></table>
<div class="ftr">saas.group \u00b7 Career Framework \u00b7 Accounting \u00b7 ${completedDate} \u00b7 This is a starting point for your alignment conversation. Differences between self and manager assessment are expected and valuable.</div>
</div></body></html>`;

    const w = window.open("","_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 700);
  };

  // ── HTML email ─────────────────────────────────────────────────────────────
  const buildEmailHtml = () => {
    const themeRows = results => results.map(({ theme, scores, avg, dominant }) =>
      `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;border-radius:10px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr><td style="background:${theme.color};padding:10px 16px;"><span style="color:#fff;font-weight:700;font-size:13px;">${theme.fullName||theme.name}</span><span style="color:rgba(255,255,255,0.8);font-size:11px;float:right;padding-top:1px;">${dominant} \u00b7 avg ${avg.toFixed(1)}</span></td></tr>
        ${scores.map(s=>`<tr><td style="background:#F9FAFB;padding:8px 16px;border-top:1px solid #E5E7EB;"><span style="font-size:12px;color:#374151;">${s.name}</span><span style="float:right;font-size:11px;font-weight:700;color:${theme.color};">${s.level||"\u2014"} \u00b7 ${LEVEL_LABELS[s.level]||""}</span></td></tr>`).join("")}
      </table>`).join("");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
<tr><td style="background:${BRAND.cinnabar};padding:28px 32px;"><div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:6px;">Career Framework \u00b7 Accounting</div><div style="font-size:22px;font-weight:700;color:#fff;margin-bottom:4px;">Self-Assessment Results</div><div style="font-size:13px;color:rgba(255,255,255,0.8);">${memberName} \u00b7 Completed ${completedDate}</div></td></tr>
<tr><td style="padding:24px 32px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${BRAND.cinnabarTint},${BRAND.indigoTint});border-radius:12px;border:1px solid #E5E7EB;"><tr>
<td width="38%" style="padding:18px;text-align:center;border-right:1px solid #E5E7EB;"><div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Overall indicative level</div><div style="font-size:42px;font-weight:800;color:${BRAND.black};line-height:1;">${overallLevel}</div><div style="font-size:13px;color:#374151;font-weight:500;margin-top:3px;">${LEVEL_LABELS[overallLevel]}</div><div style="font-size:11px;color:#9CA3AF;margin-top:3px;">avg ${overallAvg.toFixed(1)}</div></td>
<td style="padding:14px 16px;"><div style="background:#fff;border-radius:8px;padding:9px 13px;margin-bottom:7px;border:1px solid #E5E7EB;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:${BRAND.cinnabar};margin-bottom:2px;">Part 1 \u00b7 General</div><span style="font-size:16px;font-weight:800;color:${BRAND.black};">${generalLevel}</span><span style="font-size:11px;color:#6B7280;margin-left:5px;">${LEVEL_LABELS[generalLevel]} \u00b7 avg ${generalAvg.toFixed(1)}</span></div><div style="background:#fff;border-radius:8px;padding:9px 13px;border:1px solid #E5E7EB;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:${BRAND.indigo};margin-bottom:2px;">Part 2 \u00b7 Accounting</div><span style="font-size:16px;font-weight:800;color:${BRAND.black};">${functionalLevel}</span><span style="font-size:11px;color:#6B7280;margin-left:5px;">${LEVEL_LABELS[functionalLevel]} \u00b7 avg ${functionalAvg.toFixed(1)}</span></div></td>
</tr></table></td></tr>
<tr><td style="padding:0 32px 12px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9CA3AF;border-top:1px solid #E5E7EB;padding-top:14px;margin-bottom:12px;">Part 1 \u00b7 General Competencies</div>${themeRows(generalResults)}</td></tr>
<tr><td style="padding:0 32px 12px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9CA3AF;border-top:1px solid #E5E7EB;padding-top:14px;margin-bottom:12px;">Part 2 \u00b7 Accounting Functional Competencies</div>${themeRows(functionalResults)}</td></tr>
<tr><td style="padding:0 32px 28px;"><div style="background:${BRAND.cinnabarTint};border-radius:10px;padding:14px 18px;"><div style="font-weight:700;color:${BRAND.cinnabar};font-size:13px;margin-bottom:4px;">Next steps</div><div style="font-size:13px;color:#5A2010;line-height:1.65;">Discuss these results in your next 1-to-1. Focus on where your self-assessment aligns with your manager\u2019s perspective \u2014 the gaps are the richest areas for feedback and development planning.</div></div></td></tr>
<tr><td style="background:#F9FAFB;padding:12px 32px;border-top:1px solid #E5E7EB;"><div style="font-size:11px;color:#9CA3AF;">saas.group \u00b7 Career Framework \u00b7 Accounting Job Family \u00b7 ${completedDate}</div></td></tr>
</table></td></tr></table></body></html>`;
  };

  const copyHtmlEmail = async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([buildEmailHtml()], { type:"text/html" }) })]);
      setCopied(true); setTimeout(()=>setCopied(false),4000);
    } catch {
      await navigator.clipboard.writeText(`Career Framework \u2013 Accounting Self-Assessment\n${memberName} \u00b7 ${completedDate}\n\nOverall: ${overallLevel} (${LEVEL_LABELS[overallLevel]}) \u00b7 avg ${overallAvg.toFixed(1)}\nGeneral: ${generalLevel} \u00b7 Accounting: ${functionalLevel}`).catch(()=>{});
      setCopied(true); setTimeout(()=>setCopied(false),4000);
    }
  };

  // ── Theme result block ─────────────────────────────────────────────────────
  const ThemeBlock = ({ theme, scores, avg, dominant }) => (
    <div style={{ marginBottom:14, border:"1px solid #E5E7EB", borderRadius:12, overflow:"hidden", fontFamily:F }}>
      <div style={{ padding:"11px 16px", background:theme.color, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{theme.fullName||theme.name}</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <span style={{ color:"rgba(255,255,255,0.95)", fontSize:12, fontWeight:700 }}>{dominant}</span>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginLeft:5 }}>avg {avg.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ padding:"12px 16px" }}>
        {scores.map((s,i) => (
          <div key={s.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:i<scores.length-1?9:0 }}>
            <div style={{ flex:"0 0 155px", fontSize:12, color:"#374151", fontWeight:500, lineHeight:1.3 }}>{s.name}</div>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, height:6, background:"#F3F4F6", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:((lvlNum[s.level]||0)/5)*100+"%", background:theme.color, borderRadius:3, transition:"width 0.7s ease" }} />
              </div>
              <div style={{ textAlign:"right", minWidth:100 }}>
                <span style={{ fontSize:11, fontWeight:700, color:theme.color }}>{s.level||"\u2014"}</span>
                {s.level && <span style={{ fontSize:10, color:"#9CA3AF", marginLeft:4 }}>\u00b7 {LEVEL_LABELS[s.level]}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Divider = ({ label }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 14px", fontFamily:F }}>
      <div style={{ flex:1, height:1, background:"#E5E7EB" }} />
      <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9CA3AF", whiteSpace:"nowrap" }}>{label}</span>
      <div style={{ flex:1, height:1, background:"#E5E7EB" }} />
    </div>
  );

  return (
    <div ref={topRef} style={{ maxWidth:620, margin:"0 auto", padding:"40px 20px 56px", fontFamily:F }}>
      <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:BRAND.cinnabar, background:BRAND.cinnabarTint, padding:"4px 10px", borderRadius:4, marginBottom:14 }}>Results</div>
      <h1 style={{ fontSize:27, fontWeight:800, color:BRAND.black, margin:"0 0 4px", fontFamily:F }}>{memberName}\u2019s self-assessment</h1>
      <p style={{ fontSize:13, color:"#9CA3AF", margin:"0 0 24px", fontFamily:F }}>Completed {completedDate} \u00b7 Use this as a starting point for your alignment conversation.</p>

      {/* Overall banner */}
      <div style={{ background:"linear-gradient(135deg,"+BRAND.cinnabarTint+" 0%,"+BRAND.indigoTint+" 100%)", border:"1px solid "+BRAND.cinnabar+"30", borderRadius:16, padding:"22px", marginBottom:24 }}>
        <div style={{ display:"flex", gap:14, alignItems:"stretch" }}>
          <div style={{ flex:"0 0 130px", textAlign:"center", borderRight:"1px solid #E5E7EB", paddingRight:14 }}>
            <div style={{ fontSize:10.5, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Overall</div>
            <div style={{ fontSize:40, fontWeight:800, color:BRAND.black, lineHeight:1, fontFamily:F }}>{overallLevel}</div>
            <div style={{ fontSize:12.5, color:"#374151", fontWeight:500, marginTop:2 }}>{LEVEL_LABELS[overallLevel]}</div>
            <div style={{ fontSize:11, color:"#9CA3AF", marginTop:4 }}>avg {overallAvg.toFixed(1)}</div>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ flex:1, background:"#fff", borderRadius:9, padding:"9px 13px", border:"1px solid #E5E7EB" }}>
              <div style={{ fontSize:9.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:BRAND.cinnabar, marginBottom:2 }}>General</div>
              <span style={{ fontSize:17, fontWeight:800, color:BRAND.black }}>{generalLevel}</span>
              <span style={{ fontSize:11, color:"#6B7280", marginLeft:6 }}>{LEVEL_LABELS[generalLevel]} \u00b7 avg {generalAvg.toFixed(1)}</span>
            </div>
            <div style={{ flex:1, background:"#fff", borderRadius:9, padding:"9px 13px", border:"1px solid #E5E7EB" }}>
              <div style={{ fontSize:9.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:BRAND.indigo, marginBottom:2 }}>Accounting functional</div>
              <span style={{ fontSize:17, fontWeight:800, color:BRAND.black }}>{functionalLevel}</span>
              <span style={{ fontSize:11, color:"#6B7280", marginLeft:6 }}>{LEVEL_LABELS[functionalLevel]} \u00b7 avg {functionalAvg.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:"18px 8px 8px", marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#374151", textAlign:"center", marginBottom:2, fontFamily:F }}>Competency profile</div>
        <div style={{ fontSize:11, color:"#9CA3AF", textAlign:"center", marginBottom:8, fontFamily:F }}>IC2 = inner ring \u00b7 IC5 = outer ring</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize:10.5, fill:"#374151", fontWeight:500, fontFamily:"Inter, system-ui, sans-serif" }} />
            <PolarRadiusAxis angle={90} domain={[1,5]} tickCount={5} tick={{ fontSize:9, fill:"#9CA3AF" }} axisLine={false} />
            <Radar dataKey="score" stroke={BRAND.cinnabar} fill={BRAND.cinnabar} fillOpacity={0.12} strokeWidth={2} dot={{ r:4, fill:BRAND.cinnabar, strokeWidth:0 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <Divider label="Part 1 \u00b7 General competencies" />
      {generalResults.map(r => <ThemeBlock key={r.theme.id} {...r} />)}
      <Divider label="Part 2 \u00b7 Accounting functional competencies" />
      {functionalResults.map(r => <ThemeBlock key={r.theme.id} {...r} />)}

      {/* Share section */}
      <div style={{ background:BRAND.cinnabarTint, border:"1px solid "+BRAND.cinnabar+"35", borderRadius:14, padding:"20px 22px", marginTop:24, marginBottom:8, fontFamily:F }}>
        <div style={{ fontWeight:700, color:BRAND.cinnabar, fontSize:14, marginBottom:6 }}>Share with your manager</div>
        <div style={{ fontSize:13, color:"#5A2010", lineHeight:1.6, marginBottom:14 }}>Choose how you\u2019d like to share your results:</div>
        {/* Option A */}
        <div style={{ background:"#fff", border:"1px solid "+BRAND.cinnabar+"30", borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
          <div style={{ fontWeight:600, fontSize:13, color:BRAND.black, marginBottom:4 }}>Option A \u2014 Download as PDF</div>
          <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.6, marginBottom:12 }}>Opens a print-ready page. Use <strong>File \u2192 Print \u2192 Save as PDF</strong> (Cmd+P / Ctrl+P). Enable <strong>\u201cBackground graphics\u201d</strong> in print settings to keep the colours.</div>
          <button onClick={downloadPdf}
            style={{ width:"100%", padding:"11px 16px", fontSize:13.5, fontWeight:600, borderRadius:9, border:"none", background:BRAND.cinnabar, color:"#fff", cursor:"pointer", fontFamily:F }}
            onMouseEnter={e=>(e.currentTarget.style.background=BRAND.cinnabarDark)}
            onMouseLeave={e=>(e.currentTarget.style.background=BRAND.cinnabar)}>
            Download PDF
          </button>
        </div>
        {/* Option B */}
        <div style={{ background:"#fff", border:"1px solid "+BRAND.cinnabar+"30", borderRadius:10, padding:"14px 16px" }}>
          <div style={{ fontWeight:600, fontSize:13, color:BRAND.black, marginBottom:4 }}>Option B \u2014 Copy formatted email</div>
          <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.6, marginBottom:8 }}>Copies a fully formatted HTML email to your clipboard. Then:</div>
          <ol style={{ margin:"0 0 12px", paddingLeft:18, fontSize:12.5, color:"#5A2010", lineHeight:1.9 }}>
            <li>Open a <strong>new email</strong> in Gmail or Outlook</li>
            <li>Paste with <strong>Cmd+V</strong> (Mac) or <strong>Ctrl+V</strong> (Windows)</li>
            <li>Address it to your manager and CC yourself at <strong>{memberEmail}</strong></li>
            <li>Hit Send</li>
          </ol>
          <button onClick={copyHtmlEmail}
            style={{ width:"100%", padding:"11px 16px", fontSize:13.5, fontWeight:600, borderRadius:9, border:"none", background:copied?"#16A34A":BRAND.indigo, color:"#fff", cursor:"pointer", transition:"background 0.25s", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:F }}
            onMouseEnter={e=>{ if(!copied) e.currentTarget.style.background="#5E51A3"; }}
            onMouseLeave={e=>{ if(!copied) e.currentTarget.style.background=copied?"#16A34A":BRAND.indigo; }}>
            <span style={{ fontSize:15 }}>{copied?"\u2713":"\ud83d\udccb"}</span>
            {copied?"Copied! Open a new email and paste":"Copy email"}
          </button>
        </div>
      </div>

      {/* Restart */}
      {!showRestartConfirm ? (
        <button onClick={()=>setShowRestartConfirm(true)} style={{ width:"100%", marginTop:2, padding:"12px 20px", fontSize:13, fontWeight:600, borderRadius:10, border:"1px solid #E5E7EB", background:"#fff", color:"#9CA3AF", cursor:"pointer", fontFamily:F }}>Start over</button>
      ) : (
        <div style={{ marginTop:2, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"16px 18px", fontFamily:F }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:"#991B1B", marginBottom:10 }}>Are you sure? All your answers will be lost.</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowRestartConfirm(false)} style={{ flex:1, padding:"10px", fontSize:13, fontWeight:600, borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:F }}>Cancel</button>
            <button onClick={onRestart} style={{ flex:1, padding:"10px", fontSize:13, fontWeight:600, borderRadius:8, border:"none", background:"#DC2626", color:"#fff", cursor:"pointer", fontFamily:F }}>Yes, start over</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const generalQ = GENERAL_THEMES.flatMap(t => t.subdimensions.map(sd => ({ theme:t, subdimension:sd, phase:"general" })));
  const functionalQ = FUNCTIONAL_THEMES.flatMap(t => t.subdimensions.map(sd => ({ theme:t, subdimension:sd, phase:"functional" })));
  const allQ = [...generalQ, ...functionalQ];

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
      if (s.screen && s.screen !== "intro") { setScreen(s.screen); setQIdx(s.qIdx||0); setAnswers(s.answers||{}); setMemberName(s.memberName||""); setMemberEmail(s.memberEmail||""); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, qIdx, answers, memberName, memberEmail })); } catch {}
  }, [screen, qIdx, answers, memberName, memberEmail]);

  const select = lv => setAnswers(p => ({ ...p, [allQ[qIdx].subdimension.id]:lv }));
  const next = () => {
    if (qIdx === generalQ.length-1) { setScreen("transition"); return; }
    if (qIdx === allQ.length-1) { setScreen("results"); return; }
    setQIdx(i => i+1);
  };
  const prev = () => { if(qIdx>0) setQIdx(i=>i-1); };
  const continueToFunctional = () => { setQIdx(generalQ.length); setScreen("questions"); };
  const restart = () => {
    setScreen("intro"); setQIdx(0); setAnswers({}); setMemberName(""); setMemberEmail("");
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };
  const handleStart = (name, email) => { setMemberName(name); setMemberEmail(email); setScreen("questions"); };

  if (screen==="intro") return <IntroScreen onStart={handleStart} />;
  if (screen==="transition") return <PhaseTransitionScreen onContinue={continueToFunctional} />;
  if (screen==="results") return <ResultsScreen answers={answers} memberName={memberName} memberEmail={memberEmail} onRestart={restart} />;

  const q = allQ[qIdx];
  const isGeneral = q.phase === "general";
  const phaseTotal = isGeneral ? generalQ.length : functionalQ.length;
  const phaseIdx = isGeneral ? qIdx : qIdx - generalQ.length;
  const isLastQ = qIdx === allQ.length-1;

  return (
    <div style={{ fontFamily:F }}>
      <ProgressBar current={phaseIdx} total={phaseTotal} themeColor={q.theme.color} phase={q.phase} />
      <QuestionCard theme={q.theme} subdimension={q.subdimension} selectedLevel={answers[q.subdimension.id]||null}
        onSelect={select} onNext={next} onPrev={prev} isFirst={qIdx===0} isLast={isLastQ} />
    </div>
  );
}
