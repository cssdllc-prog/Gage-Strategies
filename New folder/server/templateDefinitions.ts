/**
 * Template definitions for all GAGE Solutions Hub products.
 * Each template defines the content structure that gets rendered into a branded PDF.
 * The logo can be swapped for white-labeling.
 */

export interface TemplateDefinition {
  productId: number;
  title: string;
  subtitle: string;
  storageKey: string;
  fileName: string;
  fileType: string;
  description: string;
  sections: Array<{
    heading: string;
    content?: string;
    items?: string[];
    type?: "text" | "checklist" | "numbered" | "table";
    tableData?: { headers: string[]; rows: string[][] };
  }>;
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  // === Product 4: AI Content Assistant Prompt Pack ===
  {
    productId: 4,
    title: "AI Content Assistant — Prompt Pack",
    subtitle: "50+ battle-tested prompts for marketing, sales, and operations content",
    storageKey: "templates/ai-content-prompt-pack.pdf",
    fileName: "AI Content Prompt Pack",
    fileType: "pdf",
    description: "Curated collection of AI prompts organized by business function",
    sections: [
      {
        heading: "How to Use This Prompt Pack",
        content: "Each prompt is designed as a fill-in-the-blank template. Replace the [bracketed] sections with your specific details. For best results, provide context about your industry, audience, and tone preferences.",
        type: "text",
      },
      {
        heading: "Marketing Content Prompts",
        type: "numbered",
        items: [
          "Blog Post Generator: Write a [word count] blog post about [topic] targeting [audience]. Use a [tone] voice and include [number] actionable tips.",
          "Social Media Series: Create a 5-post series for [platform] about [topic]. Each post should be under [character limit] and include a CTA.",
          "Email Subject Lines: Generate 10 subject lines for a [campaign type] email about [offer]. Target open rate: [goal]%.",
          "Landing Page Copy: Write hero section copy for a [product/service] targeting [audience]. Focus on [primary benefit].",
          "Case Study Outline: Create a case study framework for [client type] showing [result]. Include problem, solution, and metrics.",
        ],
      },
      {
        heading: "Sales Content Prompts",
        type: "numbered",
        items: [
          "Cold Outreach: Write a personalized cold email to [role] at [company type]. Reference [pain point] and offer [solution].",
          "Proposal Summary: Summarize a proposal for [service] in 3 paragraphs. Highlight ROI of [metric] and timeline of [duration].",
          "Follow-Up Sequence: Create a 3-email follow-up sequence after [event]. Space emails [days] apart with escalating urgency.",
          "Objection Handler: Provide 5 responses to the objection '[objection]' for [product/service]. Use empathy-first approach.",
          "Discovery Questions: Generate 10 discovery questions for a [industry] prospect evaluating [solution type].",
        ],
      },
      {
        heading: "Operations & Internal Prompts",
        type: "numbered",
        items: [
          "SOP Writer: Create a standard operating procedure for [process]. Include steps, responsible parties, and quality checks.",
          "Meeting Agenda: Generate a [duration]-minute meeting agenda for [meeting type]. Include time allocations and desired outcomes.",
          "Performance Review: Write a balanced performance review for [role] covering [period]. Include strengths, growth areas, and goals.",
          "Process Improvement: Analyze [process] and suggest 5 improvements. Consider efficiency, cost, and team satisfaction.",
          "Training Material: Create a training outline for [topic] aimed at [audience level]. Include exercises and assessments.",
        ],
      },
    ],
  },
  // === Product 6: Customer Onboarding Workflow ===
  {
    productId: 6,
    title: "Customer Onboarding Workflow",
    subtitle: "A structured 30-day onboarding system for new client success",
    storageKey: "templates/customer-onboarding-workflow.pdf",
    fileName: "Customer Onboarding Workflow",
    fileType: "pdf",
    description: "Complete 30-day onboarding framework with milestones, touchpoints, and success metrics",
    sections: [
      {
        heading: "Onboarding Overview",
        content: "This workflow guides you through a structured 30-day onboarding process designed to maximize client retention and satisfaction. Each phase builds on the previous one, ensuring no critical steps are missed.",
        type: "text",
      },
      {
        heading: "Week 1: Welcome & Setup",
        type: "checklist",
        items: [
          "Send personalized welcome email within 2 hours of purchase",
          "Schedule kickoff call (30 minutes)",
          "Share access credentials and login instructions",
          "Provide quick-start guide or video walkthrough",
          "Set up client in your project management system",
          "Assign dedicated account manager or point of contact",
        ],
      },
      {
        heading: "Week 2: Activation & Training",
        type: "checklist",
        items: [
          "Conduct first training session (live or recorded)",
          "Share relevant templates and resources",
          "Set up integrations with client's existing tools",
          "Establish communication cadence (weekly check-ins)",
          "Document client goals and success metrics",
          "Create shared project timeline with milestones",
        ],
      },
      {
        heading: "Week 3: Engagement & Optimization",
        type: "checklist",
        items: [
          "Review usage data and identify adoption gaps",
          "Provide personalized tips based on usage patterns",
          "Address any technical issues or questions",
          "Share advanced features or use cases",
          "Collect initial feedback (NPS or satisfaction survey)",
          "Adjust onboarding pace based on client needs",
        ],
      },
      {
        heading: "Week 4: Handoff & Growth",
        type: "checklist",
        items: [
          "Conduct 30-day review call",
          "Document wins and quick results achieved",
          "Transition from onboarding to ongoing support",
          "Introduce upsell/cross-sell opportunities naturally",
          "Request testimonial or case study participation",
          "Set 90-day check-in on calendar",
        ],
      },
      {
        heading: "Success Metrics to Track",
        type: "table",
        tableData: {
          headers: ["Metric", "Target", "Measurement"],
          rows: [
            ["Time to First Value", "< 7 days", "Days from signup to first meaningful action"],
            ["Activation Rate", "> 80%", "% completing core setup steps"],
            ["30-Day Retention", "> 90%", "% still active after 30 days"],
            ["NPS Score", "> 50", "Net Promoter Score at day 30"],
            ["Support Tickets", "< 3", "Average tickets per new client"],
          ],
        },
      },
    ],
  },
  // === Product 7: Strategic Planning Framework ===
  {
    productId: 7,
    title: "Strategic Planning Framework",
    subtitle: "A comprehensive quarterly and annual planning system for growing businesses",
    storageKey: "templates/strategic-planning-framework.pdf",
    fileName: "Strategic Planning Framework",
    fileType: "pdf",
    description: "Complete strategic planning toolkit with vision, goals, OKRs, and execution roadmap",
    sections: [
      {
        heading: "Vision & Mission Alignment",
        content: "Before diving into tactics, ensure your strategic plan connects to your company's core purpose. Use this section to articulate where you're headed and why it matters.",
        items: [
          "Company Vision (3-5 year aspirational statement)",
          "Mission Statement (what you do, for whom, and why)",
          "Core Values (3-5 non-negotiable principles)",
          "Strategic Positioning (how you differ from competitors)",
        ],
        type: "text",
      },
      {
        heading: "SWOT Analysis",
        type: "table",
        tableData: {
          headers: ["Category", "Internal", "External"],
          rows: [
            ["Positive", "STRENGTHS: List 3-5 internal advantages", "OPPORTUNITIES: List 3-5 market openings"],
            ["Negative", "WEAKNESSES: List 3-5 internal gaps", "THREATS: List 3-5 external risks"],
          ],
        },
      },
      {
        heading: "Annual Goals (3-5 Maximum)",
        type: "numbered",
        items: [
          "Revenue Goal: Grow revenue from $[current] to $[target] (X% increase)",
          "Customer Goal: Acquire [number] new customers while maintaining [%] retention",
          "Product Goal: Launch [number] new features/products by Q[quarter]",
          "Team Goal: Hire [number] key roles and achieve [score] employee satisfaction",
          "Operations Goal: Reduce [metric] by [%] through process improvement",
        ],
      },
      {
        heading: "Quarterly OKR Template",
        type: "table",
        tableData: {
          headers: ["Objective", "Key Result 1", "Key Result 2", "Key Result 3"],
          rows: [
            ["Accelerate growth", "Increase MRR by 25%", "Close 10 enterprise deals", "Reduce churn to < 3%"],
            ["Improve operations", "Automate 5 manual processes", "Reduce response time to < 2hrs", "Achieve 99.9% uptime"],
            ["Build team capacity", "Hire 3 senior engineers", "Complete leadership training", "Launch mentorship program"],
          ],
        },
      },
      {
        heading: "90-Day Execution Roadmap",
        type: "checklist",
        items: [
          "Month 1: Foundation — Set up tracking, assign owners, establish weekly cadence",
          "Month 2: Acceleration — Execute primary initiatives, measure early results, adjust",
          "Month 3: Optimization — Double down on what works, cut what doesn't, prepare next quarter",
          "Weekly: 15-min standup on OKR progress with leadership team",
          "Monthly: Full team review of metrics dashboard and course corrections",
          "End of Quarter: Retrospective + next quarter planning session",
        ],
      },
    ],
  },
  // === Product 9: Team Meeting Playbook ===
  {
    productId: 9,
    title: "Team Meeting Playbook",
    subtitle: "Templates and frameworks for running effective, outcome-driven meetings",
    storageKey: "templates/team-meeting-playbook.pdf",
    fileName: "Team Meeting Playbook",
    fileType: "pdf",
    description: "Complete meeting system with agendas, facilitation guides, and follow-up templates",
    sections: [
      {
        heading: "Meeting Types & When to Use Them",
        type: "table",
        tableData: {
          headers: ["Meeting Type", "Duration", "Frequency", "Purpose"],
          rows: [
            ["Daily Standup", "15 min", "Daily", "Blockers, priorities, alignment"],
            ["Weekly Team Sync", "45 min", "Weekly", "Progress, decisions, planning"],
            ["1-on-1", "30 min", "Bi-weekly", "Coaching, feedback, career growth"],
            ["Sprint Planning", "60 min", "Bi-weekly", "Scope, assign, estimate work"],
            ["Retrospective", "45 min", "Monthly", "Reflect, improve, celebrate"],
            ["Strategy Session", "90 min", "Quarterly", "Direction, goals, big decisions"],
          ],
        },
      },
      {
        heading: "Universal Meeting Agenda Template",
        type: "numbered",
        items: [
          "Check-in (2 min): Quick round — one word for how everyone is feeling",
          "Review Action Items (5 min): Status update on last meeting's commitments",
          "Main Topic (15-30 min): The core discussion or decision to be made",
          "Open Floor (5-10 min): Questions, concerns, or items not on the agenda",
          "Action Items & Owners (3 min): Who does what by when",
          "Check-out (1 min): Rate the meeting 1-5 and one improvement suggestion",
        ],
      },
      {
        heading: "Meeting Rules (Post These Visibly)",
        type: "checklist",
        items: [
          "Start and end on time — no exceptions",
          "No laptops unless presenting or note-taking",
          "One conversation at a time",
          "Decisions require a clear owner and deadline",
          "If it can be an email, cancel the meeting",
          "Send agenda 24 hours in advance",
          "Share notes within 2 hours of meeting end",
        ],
      },
      {
        heading: "Facilitation Tips",
        type: "numbered",
        items: [
          "Use timeboxing: Assign specific minutes to each agenda item and stick to it",
          "Parking lot: Capture off-topic items for later without derailing the discussion",
          "Round-robin: Ensure quieter team members have space to contribute",
          "Decision framework: Use 'Disagree and commit' when consensus isn't possible",
          "Energy check: If energy drops, take a 2-minute break or switch formats",
        ],
      },
    ],
  },
  // === Product 11: Sales Pipeline Dashboard ===
  {
    productId: 11,
    title: "Sales Pipeline Dashboard — Setup Guide",
    subtitle: "Build and manage a visual sales pipeline that drives consistent revenue",
    storageKey: "templates/sales-pipeline-dashboard.pdf",
    fileName: "Sales Pipeline Dashboard Guide",
    fileType: "pdf",
    description: "Complete guide to building a sales pipeline with stages, metrics, and forecasting",
    sections: [
      {
        heading: "Pipeline Stage Definitions",
        type: "table",
        tableData: {
          headers: ["Stage", "Criteria to Enter", "Actions Required", "Avg. Days"],
          rows: [
            ["Lead", "Expressed interest or matched ICP", "Qualify via BANT framework", "3-5"],
            ["Discovery", "Confirmed budget & timeline", "Complete discovery call, identify pain", "5-7"],
            ["Proposal", "Stakeholder identified, needs documented", "Send proposal, schedule review", "7-10"],
            ["Negotiation", "Proposal reviewed, terms discussed", "Handle objections, finalize scope", "5-14"],
            ["Closed Won", "Contract signed, payment received", "Trigger onboarding workflow", "1-3"],
            ["Closed Lost", "Deal disqualified or lost", "Log reason, schedule re-engage", "N/A"],
          ],
        },
      },
      {
        heading: "Key Pipeline Metrics",
        type: "numbered",
        items: [
          "Pipeline Value: Total dollar value of all active opportunities",
          "Win Rate: Percentage of proposals that convert to closed-won",
          "Average Deal Size: Mean revenue per closed deal",
          "Sales Cycle Length: Average days from lead to closed-won",
          "Pipeline Velocity: (Opportunities × Win Rate × Avg Deal) ÷ Cycle Length",
          "Stage Conversion Rates: % moving from each stage to the next",
        ],
      },
      {
        heading: "Weekly Pipeline Review Checklist",
        type: "checklist",
        items: [
          "Review all deals that haven't moved stages in 14+ days",
          "Update close dates and deal values based on latest conversations",
          "Identify deals at risk and create recovery action plans",
          "Calculate pipeline coverage ratio (target: 3x quota)",
          "Review new leads entering the pipeline this week",
          "Celebrate wins and share lessons from losses",
        ],
      },
      {
        heading: "Revenue Forecasting Formula",
        content: "Use weighted pipeline forecasting: Multiply each deal's value by its stage probability. Sum all weighted values for your forecast.\n\nExample: $50K deal at Proposal stage (40% probability) = $20K weighted forecast.\n\nTarget pipeline coverage: 3-4x your revenue goal to account for natural attrition.",
        type: "text",
      },
    ],
  },
  // === Product 14: Business Health Scorecard ===
  {
    productId: 14,
    title: "Business Health Scorecard",
    subtitle: "A monthly diagnostic tool to measure and improve business performance",
    storageKey: "templates/business-health-scorecard.pdf",
    fileName: "Business Health Scorecard",
    fileType: "pdf",
    description: "Comprehensive business health assessment with scoring framework and action triggers",
    sections: [
      {
        heading: "How to Use This Scorecard",
        content: "Complete this scorecard monthly. Rate each area 1-10, where 1 = critical issue and 10 = exceptional performance. Any area scoring below 6 requires an immediate action plan. Track trends over time to identify patterns.",
        type: "text",
      },
      {
        heading: "Scorecard Categories",
        type: "table",
        tableData: {
          headers: ["Category", "Score (1-10)", "Trend", "Action Needed?"],
          rows: [
            ["Revenue Growth", "___", "↑ ↓ →", "Y / N"],
            ["Profitability", "___", "↑ ↓ →", "Y / N"],
            ["Cash Flow", "___", "↑ ↓ →", "Y / N"],
            ["Customer Satisfaction", "___", "↑ ↓ →", "Y / N"],
            ["Employee Engagement", "___", "↑ ↓ →", "Y / N"],
            ["Operational Efficiency", "___", "↑ ↓ →", "Y / N"],
            ["Sales Pipeline Health", "___", "↑ ↓ →", "Y / N"],
            ["Marketing Effectiveness", "___", "↑ ↓ →", "Y / N"],
            ["Innovation & Growth", "___", "↑ ↓ →", "Y / N"],
            ["Leadership & Culture", "___", "↑ ↓ →", "Y / N"],
          ],
        },
      },
      {
        heading: "Scoring Guide",
        type: "numbered",
        items: [
          "9-10 (Exceptional): Industry-leading performance. Document and share best practices.",
          "7-8 (Strong): Performing well. Minor optimizations possible.",
          "5-6 (Adequate): Meeting minimum standards. Improvement plan needed within 30 days.",
          "3-4 (Concerning): Below expectations. Immediate intervention required.",
          "1-2 (Critical): Existential risk. Emergency action plan — all hands on deck.",
        ],
      },
      {
        heading: "Monthly Action Plan Template",
        type: "checklist",
        items: [
          "Identify the 2-3 lowest-scoring categories",
          "Root cause analysis: Why is this area underperforming?",
          "Define 1-2 specific, measurable actions per category",
          "Assign owners and deadlines for each action",
          "Schedule 2-week check-in to review progress",
          "Compare to previous month's scores — celebrate improvements",
        ],
      },
    ],
  },
  // === Product 16: Process Documentation Kit ===
  {
    productId: 16,
    title: "Process Documentation Kit",
    subtitle: "Templates for documenting, standardizing, and improving business processes",
    storageKey: "templates/process-documentation-kit.pdf",
    fileName: "Process Documentation Kit",
    fileType: "pdf",
    description: "Complete SOP framework with templates for documenting any business process",
    sections: [
      {
        heading: "SOP Template Structure",
        content: "Every Standard Operating Procedure should follow this structure to ensure consistency, clarity, and easy training of new team members.",
        type: "text",
      },
      {
        heading: "SOP Header Information",
        type: "table",
        tableData: {
          headers: ["Field", "Description", "Example"],
          rows: [
            ["Process Name", "Clear, descriptive title", "Client Invoice Processing"],
            ["Owner", "Person responsible for maintaining", "Finance Manager"],
            ["Version", "Current version number", "v2.1"],
            ["Last Updated", "Date of most recent revision", "2024-01-15"],
            ["Frequency", "How often this process runs", "Weekly / As needed"],
            ["Tools Required", "Software or equipment needed", "QuickBooks, Gmail, Slack"],
          ],
        },
      },
      {
        heading: "Step Documentation Template",
        type: "numbered",
        items: [
          "Step Title: [Clear action verb + object] — e.g., 'Generate monthly invoice in QuickBooks'",
          "Responsible Party: [Role, not person name] — e.g., 'Accounts Receivable Specialist'",
          "Inputs Needed: [What you need before starting] — e.g., 'Completed timesheet, client rate card'",
          "Detailed Instructions: [Numbered sub-steps with screenshots if applicable]",
          "Expected Output: [What success looks like] — e.g., 'PDF invoice sent to client email'",
          "Quality Check: [How to verify correctness] — e.g., 'Verify line items match timesheet hours'",
          "If/Then Scenarios: [Common exceptions and how to handle them]",
        ],
      },
      {
        heading: "Process Improvement Checklist",
        type: "checklist",
        items: [
          "Map the current process end-to-end (as-is state)",
          "Identify bottlenecks: Where do things slow down or get stuck?",
          "Find redundancies: Are any steps duplicated or unnecessary?",
          "Measure cycle time: How long does the full process take?",
          "Gather feedback from people who execute the process daily",
          "Design the improved process (to-be state)",
          "Test with a small group before full rollout",
          "Document the new process using this template",
          "Train all team members on the updated workflow",
          "Schedule quarterly review to keep documentation current",
        ],
      },
    ],
  },
  // === Product 1: Project Proposal Template ===
  {
    productId: 1,
    title: "Project Proposal Template",
    subtitle: "A professional, ready-to-use proposal framework for winning new business",
    storageKey: "templates/project-proposal-template.pdf",
    fileName: "Project Proposal Template",
    fileType: "pdf",
    description: "Complete proposal framework with executive summary, scope, timeline, and pricing sections",
    sections: [
      {
        heading: "Executive Summary",
        content: "Use this section to provide a high-level overview of the project. Summarize the client's challenge, your proposed solution, and the expected outcomes. Keep it concise — 2-3 paragraphs maximum.",
        items: [
          "Client challenge / pain point",
          "Proposed solution overview",
          "Key deliverables",
          "Expected timeline",
          "Investment summary",
        ],
        type: "text",
      },
      {
        heading: "Scope of Work",
        type: "checklist",
        items: [
          "Discovery & Requirements Gathering (Week 1-2)",
          "Strategy Development & Planning (Week 2-3)",
          "Design & Prototyping (Week 3-5)",
          "Development & Implementation (Week 5-8)",
          "Testing & Quality Assurance (Week 8-9)",
          "Launch & Deployment (Week 9-10)",
          "Post-Launch Support & Optimization (Week 10-12)",
          "Training & Documentation Delivery",
          "Monthly Performance Review Meetings",
          "Quarterly Strategy Adjustment Sessions",
        ],
      },
      {
        heading: "Project Timeline",
        type: "table",
        tableData: {
          headers: ["Phase", "Duration", "Deliverables", "Status"],
          rows: [
            ["Discovery", "2 weeks", "Requirements doc, stakeholder interviews", "☐"],
            ["Strategy", "1 week", "Project plan, resource allocation", "☐"],
            ["Design", "2 weeks", "Wireframes, mockups, prototype", "☐"],
            ["Development", "3 weeks", "Working solution, integrations", "☐"],
            ["Testing", "1 week", "QA report, bug fixes", "☐"],
            ["Launch", "1 week", "Deployment, monitoring setup", "☐"],
            ["Support", "2 weeks", "Training, documentation, handoff", "☐"],
          ],
        },
      },
      {
        heading: "Investment & Pricing",
        type: "table",
        tableData: {
          headers: ["Service", "Description", "Investment"],
          rows: [
            ["Discovery & Strategy", "Requirements, planning, roadmap", "$____"],
            ["Design & Development", "Full implementation", "$____"],
            ["Testing & QA", "Quality assurance and fixes", "$____"],
            ["Training & Support", "Team onboarding and documentation", "$____"],
            ["Monthly Retainer (Optional)", "Ongoing optimization", "$____/mo"],
          ],
        },
      },
      {
        heading: "Terms & Conditions",
        type: "numbered",
        items: [
          "Payment terms: 50% upfront, 25% at midpoint, 25% upon completion",
          "Project scope changes require written change order approval",
          "Client responsible for providing content and feedback within 5 business days",
          "Intellectual property transfers to client upon final payment",
          "Confidentiality maintained throughout and after project completion",
          "30-day warranty period for bug fixes after launch",
        ],
      },
    ],
  },

  // === Product 2: AI Customer Service Bot - Configuration Guide ===
  {
    productId: 2,
    title: "AI Customer Service Bot — Setup Guide",
    subtitle: "Complete configuration manual for deploying your AI-powered customer support system",
    storageKey: "templates/ai-bot-setup-guide.pdf",
    fileName: "AI Bot Setup Guide",
    fileType: "pdf",
    description: "Step-by-step guide to configuring and deploying your AI customer service bot",
    sections: [
      {
        heading: "Getting Started",
        content: "This guide walks you through the complete setup process for your AI Customer Service Bot. Follow each section in order to ensure a smooth deployment.",
        items: [
          "System requirements and prerequisites",
          "Account setup and API key generation",
          "Integration with your existing support channels",
          "Training the bot on your knowledge base",
          "Testing and quality assurance",
          "Go-live checklist",
        ],
        type: "text",
      },
      {
        heading: "Configuration Checklist",
        type: "checklist",
        items: [
          "Create bot account and generate API credentials",
          "Configure greeting message and brand voice",
          "Upload FAQ database (minimum 50 Q&A pairs)",
          "Set up escalation rules (when to transfer to human)",
          "Configure business hours and after-hours responses",
          "Set up email notification for unresolved queries",
          "Test with 20+ sample customer queries",
          "Configure analytics and reporting dashboard",
          "Set up A/B testing for response variations",
          "Enable customer satisfaction survey after interactions",
          "Configure multi-language support (if needed)",
          "Set up integration with CRM for customer context",
        ],
      },
      {
        heading: "Response Template Library",
        type: "numbered",
        items: [
          "Welcome greeting: 'Hi! I'm [Bot Name], your AI assistant. How can I help you today?'",
          "Clarification: 'I want to make sure I understand correctly. Are you asking about [topic]?'",
          "Escalation: 'This is a great question that deserves personal attention. Let me connect you with a specialist.'",
          "Resolution: 'I'm glad I could help! Is there anything else I can assist you with?'",
          "After hours: 'Thanks for reaching out! Our team is currently offline. I'll make sure someone follows up within [X] hours.'",
          "Feedback request: 'How would you rate your experience today? Your feedback helps us improve.'",
        ],
      },
      {
        heading: "Performance Metrics to Track",
        type: "table",
        tableData: {
          headers: ["Metric", "Target", "How to Measure"],
          rows: [
            ["Resolution Rate", ">70%", "Queries resolved without human escalation"],
            ["Response Time", "<3 seconds", "Average time to first response"],
            ["Customer Satisfaction", ">4.0/5.0", "Post-interaction survey scores"],
            ["Escalation Rate", "<30%", "Percentage transferred to humans"],
            ["Containment Rate", ">80%", "Conversations completed by bot"],
            ["Knowledge Gap Rate", "<10%", "Questions bot cannot answer"],
          ],
        },
      },
    ],
  },

  // === Product 3: Sales Pipeline Manager ===
  {
    productId: 3,
    title: "Sales Pipeline Manager — Playbook",
    subtitle: "A complete system for managing your sales pipeline from lead to close",
    storageKey: "templates/sales-pipeline-playbook.pdf",
    fileName: "Sales Pipeline Playbook",
    fileType: "pdf",
    description: "Complete sales pipeline management system with stages, scripts, and tracking",
    sections: [
      {
        heading: "Pipeline Stage Definitions",
        type: "table",
        tableData: {
          headers: ["Stage", "Criteria", "Actions Required", "Target Duration"],
          rows: [
            ["Lead Captured", "Contact info obtained", "Qualify within 24hrs", "1 day"],
            ["Qualified", "Budget, authority, need confirmed", "Schedule discovery call", "3 days"],
            ["Discovery", "Pain points identified", "Send proposal", "5 days"],
            ["Proposal Sent", "Proposal delivered", "Follow up in 48hrs", "7 days"],
            ["Negotiation", "Active discussion on terms", "Address objections", "10 days"],
            ["Closed Won", "Contract signed", "Onboard client", "—"],
            ["Closed Lost", "Deal declined", "Document reason, nurture", "—"],
          ],
        },
      },
      {
        heading: "Daily Pipeline Review Checklist",
        type: "checklist",
        items: [
          "Review all deals moving today — any blockers?",
          "Follow up on proposals sent 48+ hours ago",
          "Qualify new leads within 24-hour window",
          "Update deal values and close dates",
          "Log all customer interactions and notes",
          "Identify stalled deals (no activity 7+ days)",
          "Review and update forecast for the week",
          "Check for upsell/cross-sell opportunities in active deals",
        ],
      },
      {
        heading: "Objection Handling Scripts",
        type: "numbered",
        items: [
          "'Too expensive' → 'I understand budget is important. Let me show you the ROI calculation — most clients see [X]% return within [timeframe]. What would that mean for your business?'",
          "'Need to think about it' → 'Absolutely, this is an important decision. What specific concerns can I address to help you evaluate? I'm happy to provide case studies from similar companies.'",
          "'Already have a solution' → 'That's great that you're already addressing this. Many of our clients switched from [competitor] because [specific advantage]. Would you be open to a quick comparison?'",
          "'Not the right time' → 'I completely understand. When would be a better time to revisit? In the meantime, I'll send you some resources that show how [company type] benefited from starting sooner.'",
          "'Need to check with my team' → 'Of course! Would it be helpful if I prepared a brief summary document your team can review? I can also join a quick call to answer their questions directly.'",
        ],
      },
      {
        heading: "Weekly Pipeline Metrics",
        type: "table",
        tableData: {
          headers: ["Metric", "This Week", "Last Week", "Target"],
          rows: [
            ["New Leads Added", "____", "____", "15+"],
            ["Deals Advanced", "____", "____", "5+"],
            ["Proposals Sent", "____", "____", "3+"],
            ["Deals Closed", "____", "____", "2+"],
            ["Pipeline Value", "$____", "$____", "$____"],
            ["Win Rate", "____%", "____%", "25%+"],
            ["Avg Deal Size", "$____", "$____", "$____"],
            ["Sales Cycle (days)", "____", "____", "30"],
          ],
        },
      },
    ],
  },

  // === Product 5: Time Tracking & Productivity Dashboard ===
  {
    productId: 5,
    title: "Time Tracking & Productivity System",
    subtitle: "Identify where your time goes and optimize for maximum output",
    storageKey: "templates/time-tracking-system.pdf",
    fileName: "Time Tracking System",
    fileType: "pdf",
    description: "Complete time audit and productivity optimization framework",
    sections: [
      {
        heading: "Time Audit Framework",
        content: "Before you can optimize your time, you need to understand where it currently goes. Use this framework to conduct a thorough time audit over one full work week.",
        type: "text",
      },
      {
        heading: "Weekly Time Audit Template",
        type: "table",
        tableData: {
          headers: ["Time Block", "Activity", "Category", "Value (H/M/L)", "Delegate?"],
          rows: [
            ["6:00 - 8:00 AM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
            ["8:00 - 10:00 AM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
            ["10:00 - 12:00 PM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
            ["12:00 - 2:00 PM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
            ["2:00 - 4:00 PM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
            ["4:00 - 6:00 PM", "________________", "☐ Deep ☐ Admin ☐ Meeting", "☐H ☐M ☐L", "☐"],
          ],
        },
      },
      {
        heading: "Productivity Optimization Checklist",
        type: "checklist",
        items: [
          "Identify your top 3 high-value activities (revenue-generating)",
          "Block 2-hour 'deep work' sessions for high-value tasks",
          "Batch similar low-value tasks into single time blocks",
          "Eliminate or delegate tasks scoring 'Low' value consistently",
          "Set up 'Do Not Disturb' protocols during focus time",
          "Create standard operating procedures for repetitive tasks",
          "Implement the 2-minute rule: if it takes <2 min, do it now",
          "Schedule email/Slack checks at specific times (not constantly)",
          "Review and cancel unnecessary recurring meetings",
          "Set up automation for routine administrative tasks",
        ],
      },
      {
        heading: "ROI Calculator for Time Savings",
        type: "table",
        tableData: {
          headers: ["Metric", "Current", "After Optimization", "Savings"],
          rows: [
            ["Hours in meetings/week", "____", "____", "____"],
            ["Hours on admin/week", "____", "____", "____"],
            ["Hours on deep work/week", "____", "____", "____"],
            ["Hourly rate value", "$____", "$____", "—"],
            ["Weekly time recovered", "—", "—", "____ hrs"],
            ["Monthly value recovered", "—", "—", "$____"],
            ["Annual value recovered", "—", "—", "$____"],
          ],
        },
      },
    ],
  },

  // === Product 10: Email Marketing Automation ===
  {
    productId: 10,
    title: "Email Marketing Automation — Sequence Playbook",
    subtitle: "12 proven email sequences to nurture leads, onboard customers, and drive revenue",
    storageKey: "templates/email-marketing-playbook.pdf",
    fileName: "Email Marketing Playbook",
    fileType: "pdf",
    description: "Complete email automation playbook with sequences, subject lines, and A/B testing framework",
    sections: [
      {
        heading: "Welcome Sequence (5 Emails)",
        type: "numbered",
        items: [
          "Day 0: Welcome + Quick Win — Deliver immediate value, set expectations. Subject: 'Welcome! Here's your quick win...'",
          "Day 2: Story + Problem — Share your origin story, relate to their pain. Subject: 'I used to struggle with [problem] too'",
          "Day 4: Solution Framework — Introduce your methodology. Subject: 'The 3-step framework that changed everything'",
          "Day 7: Social Proof — Case study or testimonial. Subject: 'How [Client] achieved [Result] in [Time]'",
          "Day 10: Soft CTA — Invite to next step. Subject: 'Ready to [desired outcome]?'",
        ],
      },
      {
        heading: "Abandoned Cart Recovery (3 Emails)",
        type: "numbered",
        items: [
          "Hour 1: Reminder — 'You left something behind...' (show product, no discount)",
          "Hour 24: Objection Handler — 'Still thinking it over?' (address common concerns, add social proof)",
          "Hour 72: Final Urgency — 'Last chance: your cart expires soon' (optional: small incentive)",
        ],
      },
      {
        heading: "High-Converting Subject Line Formulas",
        type: "text",
        items: [
          "The [Number] [Noun] That [Desirable Outcome] → 'The 5 emails that doubled our revenue'",
          "How [Person/Company] [Achieved Result] Without [Common Objection] → 'How Sarah grew to $10K/mo without ads'",
          "[Number]% of [Group] Don't Know This About [Topic] → '73% of founders don't know this about pricing'",
          "I [Did Something Unexpected] and Here's What Happened → 'I fired my biggest client and here's what happened'",
          "The [Adjective] Guide to [Desired Outcome] → 'The lazy guide to consistent content creation'",
          "Stop [Common Mistake] — Do This Instead → 'Stop discounting — do this instead'",
        ],
      },
      {
        heading: "A/B Testing Tracker",
        type: "table",
        tableData: {
          headers: ["Test", "Variant A", "Variant B", "Winner", "Lift"],
          rows: [
            ["Subject line", "________________", "________________", "☐A ☐B", "____%"],
            ["Send time", "________________", "________________", "☐A ☐B", "____%"],
            ["CTA button", "________________", "________________", "☐A ☐B", "____%"],
            ["Email length", "________________", "________________", "☐A ☐B", "____%"],
            ["Personalization", "________________", "________________", "☐A ☐B", "____%"],
          ],
        },
      },
      {
        heading: "Email Performance Metrics",
        type: "table",
        tableData: {
          headers: ["Metric", "Industry Avg", "Your Goal", "Actual"],
          rows: [
            ["Open Rate", "20-25%", "____%", "____%"],
            ["Click Rate", "2-5%", "____%", "____%"],
            ["Conversion Rate", "1-3%", "____%", "____%"],
            ["Unsubscribe Rate", "<0.5%", "____%", "____%"],
            ["Revenue/Email", "$0.10-$1.00", "$____", "$____"],
            ["List Growth Rate", "2-5%/mo", "____%", "____%"],
          ],
        },
      },
    ],
  },

  // === Product 15: Business Operations SOP ===
  {
    productId: 15,
    title: "Business Operations — Standard Operating Procedures",
    subtitle: "Document and systematize your core business processes for consistency and scale",
    storageKey: "templates/business-ops-sop.pdf",
    fileName: "Business Operations SOP",
    fileType: "pdf",
    description: "SOP template pack for documenting and standardizing business processes",
    sections: [
      {
        heading: "SOP Template Structure",
        content: "Every Standard Operating Procedure should follow this structure to ensure clarity and consistency across your organization.",
        type: "text",
        items: [
          "Purpose: Why does this process exist?",
          "Scope: Who does this apply to?",
          "Responsibilities: Who owns each step?",
          "Procedure: Step-by-step instructions",
          "Quality Checks: How to verify correctness",
          "Exceptions: What to do when things go wrong",
          "Version History: Track changes over time",
        ],
      },
      {
        heading: "Client Onboarding SOP",
        type: "checklist",
        items: [
          "Send welcome email within 1 hour of contract signing",
          "Create client folder in project management system",
          "Schedule kickoff call within 48 hours",
          "Send onboarding questionnaire (due before kickoff)",
          "Set up client communication channel (Slack/Teams)",
          "Assign project manager and introduce to client",
          "Create project timeline and share with client",
          "Set up billing and payment schedule",
          "Send 'What to Expect' guide to client",
          "Schedule first progress review (2 weeks out)",
        ],
      },
      {
        heading: "Content Publishing SOP",
        type: "numbered",
        items: [
          "Content brief approved by marketing lead (minimum 3 days before publish)",
          "First draft completed and submitted for review",
          "Editorial review: grammar, tone, brand voice check",
          "SEO review: keywords, meta description, internal links",
          "Visual assets created and approved (images, graphics)",
          "Final proofread by second team member",
          "Schedule in CMS with correct categories and tags",
          "Prepare social media promotion posts (3 platforms minimum)",
          "Publish and verify all links, images, formatting",
          "Share to social channels and email list",
          "Monitor engagement for first 48 hours",
          "Respond to comments within 4 hours",
        ],
      },
      {
        heading: "Process Documentation Tracker",
        type: "table",
        tableData: {
          headers: ["Process", "Owner", "Last Updated", "Status"],
          rows: [
            ["Client Onboarding", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
            ["Content Publishing", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
            ["Invoice & Billing", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
            ["Employee Onboarding", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
            ["Customer Support", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
            ["Quality Assurance", "________________", "____/____/____", "☐ Draft ☐ Active ☐ Review"],
          ],
        },
      },
    ],
  },

  // === Product 20: Employee Onboarding System ===
  {
    productId: 20,
    title: "Employee Onboarding System",
    subtitle: "A comprehensive framework for onboarding new hires from offer acceptance to 90-day review",
    storageKey: "templates/employee-onboarding-system.pdf",
    fileName: "Employee Onboarding System",
    fileType: "pdf",
    description: "Complete onboarding framework with checklists, timelines, and training materials",
    sections: [
      {
        heading: "Pre-Start Checklist (Before Day 1)",
        type: "checklist",
        items: [
          "Send offer letter and employment agreement",
          "Collect signed documents and tax forms",
          "Order equipment (laptop, phone, accessories)",
          "Set up email account and software access",
          "Create accounts in all required tools (Slack, PM tool, etc.)",
          "Assign onboarding buddy/mentor",
          "Prepare welcome package and company swag",
          "Schedule Day 1 orientation meetings",
          "Notify team of new hire start date",
          "Prepare workspace/desk (if in-office)",
        ],
      },
      {
        heading: "First Week Schedule",
        type: "table",
        tableData: {
          headers: ["Day", "Morning", "Afternoon"],
          rows: [
            ["Monday", "Welcome orientation, company overview", "IT setup, tool walkthroughs"],
            ["Tuesday", "Team introductions, role overview", "Shadow senior team member"],
            ["Wednesday", "Process training, SOPs review", "First small task assignment"],
            ["Thursday", "Department deep-dive sessions", "1:1 with manager — questions & feedback"],
            ["Friday", "Independent work time", "Week 1 check-in, plan Week 2"],
          ],
        },
      },
      {
        heading: "30-60-90 Day Goals Framework",
        type: "numbered",
        items: [
          "Day 30 — LEARN: Understand company culture, master core tools, complete all training modules, build relationships with key team members, deliver first small project",
          "Day 60 — CONTRIBUTE: Take ownership of assigned responsibilities, identify one process improvement, participate actively in team meetings, begin working independently on standard tasks",
          "Day 90 — OWN: Fully independent in role, measurable contribution to team goals, propose and lead one initiative, mentor newer team members if applicable, formal performance review",
        ],
      },
      {
        heading: "Onboarding Feedback Survey",
        type: "table",
        tableData: {
          headers: ["Question", "Rating (1-5)", "Comments"],
          rows: [
            ["How clear were your role expectations?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
            ["How supported did you feel in Week 1?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
            ["How useful was the training provided?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
            ["How welcoming was the team?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
            ["How well-equipped are you to do your job?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
            ["Overall onboarding experience?", "☐1 ☐2 ☐3 ☐4 ☐5", "________________"],
          ],
        },
      },
    ],
  },
];
