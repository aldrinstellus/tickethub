export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  status: "Open" | "Pending" | "Resolved" | "Closed";
  assignee: string;
  updatedAt: string;
  tags: string[];
  body: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  tags: string[];
};

export const tickets: Ticket[] = [
  {
    id: "TH-1042",
    subject: "Unable to reset password",
    customer: "Jane Doe",
    priority: "High",
    status: "Open",
    assignee: "Alex Thompson",
    updatedAt: "2025-09-18T10:24:00Z",
    tags: ["password", "account"],
    body: "I'm not receiving the password reset email. I've checked spam.",
  },
  {
    id: "TH-1043",
    subject: "Billing discrepancy for September",
    customer: "Acme Corp",
    priority: "Urgent",
    status: "Pending",
    assignee: "Priya Patel",
    updatedAt: "2025-09-19T08:02:00Z",
    tags: ["billing", "invoice"],
    body: "Our invoice shows extra seats we didn't use.",
  },
  {
    id: "TH-1044",
    subject: "API rate limit errors",
    customer: "Devify",
    priority: "Normal",
    status: "Open",
    assignee: "Unassigned",
    updatedAt: "2025-09-19T07:41:00Z",
    tags: ["api", "rate limit"],
    body: "Receiving 429 errors on the /events endpoint since yesterday.",
  },
];

export const articles: Article[] = [
  {
    id: "KB-001",
    title: "How to reset your password",
    content: "To reset your password, click 'Forgot password' on the sign-in page, then follow the email link.",
    tags: ["password", "account"],
  },
  {
    id: "KB-002",
    title: "Understanding your invoice",
    content: "Invoices include seat usage, add-ons, and taxes. Check the Admin > Billing page for seat assignments.",
    tags: ["billing", "invoice"],
  },
  {
    id: "KB-003",
    title: "API rate limits",
    content: "Standard plans are limited to 600 requests/minute per project. Consider batching requests and using exponential backoff.",
    tags: ["api", "rate limit"],
  },
  {
    id: "KB-010",
    title: "Ticket Management: Agent Workflow",
    content: "Ticket Management is the primary workflow for agents. Best practices: 1) Triage incoming tickets immediately and assign priority and assignee; 2) Use macros for common responses to improve consistency; 3) Update ticket status and add internal notes for handoffs; 4) Escalate to the appropriate team within SLA windows. Regular checks: review open/aging tickets daily and clear backlog weekly.",
    tags: ["ticketing", "workflow", "triage"],
  },
  {
    id: "KB-011",
    title: "AI Assistance: Using AI for Replies",
    content: "AI Assistance is integrated throughout ticket handling to speed responses and maintain quality. How to use safely: 1) Review AI-generated drafts before sending; 2) Attach KB references and verify facts; 3) Edit AI replies to match tone and account context; 4) Use AI suggestions for subject lines and next steps. Regular checks: monitor AI suggestion accuracy and adjust prompt templates monthly.",
    tags: ["ai", "automation", "responses"],
  },
  {
    id: "KB-012",
    title: "Knowledge Access: Quick Reference Best Practices",
    content: "Knowledge Access enables quick reference during conversations. Tips: 1) Tag articles clearly and keep summaries concise; 2) Use article snippets in reply drafts and link full KB entries; 3) Keep an FAQ section for fastest lookup; 4) Maintain article versioning and review dates. Regular checks: perform quarterly content audits and retire or update outdated articles.",
    tags: ["knowledge", "kb", "faq"],
  },
  {
    id: "KB-013",
    title: "Performance Tracking: Manager Dashboard",
    content: "Performance Tracking helps managers monitor team health and improve agents. Key metrics: First Response Time, Resolution Time, CSAT, Backlog, SLA breaches. Use dashboards to set baselines and run weekly reviews. Regular checks: validate dashboards weekly and follow up on anomalies with coaching sessions.",
    tags: ["analytics", "performance", "csat"],
  },
  {
    id: "KB-014",
    title: "Customer Satisfaction: Surveys and Follow-up",
    content: "Customer Satisfaction collects feedback and drives improvements. Implement in-ticket CSAT, follow-up surveys for major incidents, and NPS where appropriate. Process: 1) Send CSAT after resolution; 2) Tag and triage low scores for root-cause analysis; 3) Share trends with the team monthly. Regular checks: review CSAT and survey results weekly and track recovery actions.",
    tags: ["csat", "surveys", "feedback"],
  },
];

export function generateAiResponse(input: string, related: Article[]): string {
  const lower = input.toLowerCase();
  const parts: string[] = [];

  if (lower.includes("password")) {
    const kb = related.find((a) => a.tags.includes("password"));
    parts.push(
      "Thanks for reaching out. I understand you're unable to reset your password. Please try using the 'Forgot password' link on the sign-in page and ensure the email isn't filtered. If it still doesn't arrive, I can trigger a manual reset and whitelist our domain."
    );
    if (kb) parts.push(`Reference: ${kb.title}.`);
  }

  if (lower.includes("invoice") || lower.includes("billing")) {
    const kb = related.find((a) => a.tags.includes("billing"));
    parts.push(
      "I've reviewed your billing concern. Extra seats typically indicate pending seat assignments or invited users. Please check Admin > Billing > Seat usage. I'm happy to adjust if there's an error."
    );
    if (kb) parts.push(`Reference: ${kb.title}.`);
  }

  if (lower.includes("api") || lower.includes("rate")) {
    const kb = related.find((a) => a.tags.includes("api"));
    parts.push(
      "Sorry about the API rate limit errors. To mitigate 429 responses, batch requests and implement exponential backoff. I can also review your plan limits and recent traffic to suggest optimizations."
    );
    if (kb) parts.push(`Reference: ${kb.title}.`);
  }

  if (parts.length === 0) {
    parts.push(
      "Thanks for contacting support. I'm here to help. Could you share a bit more detail (steps taken, screenshots, and the time the issue occurred)? I'll investigate and follow up promptly."
    );
  }

  return parts.join(" \n\n");
}
