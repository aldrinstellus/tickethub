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
