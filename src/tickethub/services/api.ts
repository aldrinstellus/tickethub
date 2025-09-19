import { tickets as mockTickets, articles as mockArticles, messages as mockMessages } from "../data/mockData";
import type { Article, Ticket, Message } from "../data/mockData";

const DEFAULT_DELAY = 500;

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data as T;
  } catch (e) {
    return null;
  }
}

async function supabaseFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!supabaseUrl || !supabaseKey) {
    console.log("Supabase config missing, using fallback data");
    return null;
  }

  try {
    const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      console.warn(`Supabase API error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data as T;
  } catch (e) {
    console.warn("Supabase fetch failed, using fallback:", e);
    return null;
  }
}

export async function fetchTickets() {
  // Try Supabase first
  const supabaseTickets = await supabaseFetch<Ticket[]>("tickets?order=updated_at.desc");
  if (supabaseTickets) return supabaseTickets;

  // Fallback to mock data
  const remote = await tryFetch<typeof mockTickets>("/api/tickets");
  if (remote) return remote;
  return new Promise<typeof mockTickets>((res) => setTimeout(() => res(mockTickets), DEFAULT_DELAY));
}

export async function fetchArticles(): Promise<Article[]> {
  // Try Supabase first
  const supabaseArticles = await supabaseFetch<Article[]>("articles");
  if (supabaseArticles) return supabaseArticles;

  // Fallback to mock data
  const remote = await tryFetch<Article[]>("/api/articles");
  if (remote) return remote;
  return new Promise<Article[]>((res) => setTimeout(() => res(mockArticles), DEFAULT_DELAY));
}

/**
 * Create a ticket with Supabase persistence and fallback to mock data.
 */
export async function createTicket(ticket: Ticket): Promise<Ticket> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/tickets`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(ticket),
      });

      if (res.ok) {
        const data = await res.json();
        const created = Array.isArray(data) ? data[0] : data;
        return created || ticket;
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  // Fallback to in-memory persistence
  mockTickets.unshift(ticket);
  return ticket;
}

/**
 * Fetch a single ticket by ID from Supabase or mock data.
 */
export async function fetchTicketById(id: string): Promise<Ticket | null> {
  // Try Supabase first
  const supabaseTicket = await supabaseFetch<Ticket[]>(`tickets?id=eq.${encodeURIComponent(id)}`);
  if (supabaseTicket && supabaseTicket.length > 0) return supabaseTicket[0];

  // Fallback to mock data
  return mockTickets.find(t => t.id === id) || null;
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = Array.isArray(data) ? data[0] : data;
        return updated || null;
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  // Fallback to mock data update
  const ticket = mockTickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
  return null;
}

/**
 * Assign ticket to agent
 */
export async function assignTicket(id: string, assignee: string): Promise<Ticket | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ assignee, updated_at: new Date().toISOString() }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = Array.isArray(data) ? data[0] : data;
        return updated || null;
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  // Fallback to mock data update
  const ticket = mockTickets.find(t => t.id === id);
  if (ticket) {
    ticket.assignee = assignee;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
  return null;
}

/**
 * Update ticket priority
 */
export async function updateTicketPriority(id: string, priority: Ticket['priority']): Promise<Ticket | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ priority, updated_at: new Date().toISOString() }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = Array.isArray(data) ? data[0] : data;
        return updated || null;
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  // Fallback to mock data update
  const ticket = mockTickets.find(t => t.id === id);
  if (ticket) {
    ticket.priority = priority;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
  return null;
}

/**
 * Fetch messages for a specific ticket
 */
export async function fetchMessages(ticketId: string): Promise<Message[]> {
  // Try Supabase first
  const supabaseMessages = await supabaseFetch<Message[]>(`messages?ticket_id=eq.${encodeURIComponent(ticketId)}&order=created_at.asc`);
  if (supabaseMessages) return supabaseMessages;

  // Fallback to mock data
  const remote = await tryFetch<Message[]>(`/api/messages?ticket_id=${ticketId}`);
  if (remote) return remote;

  // Return filtered mock messages
  return new Promise<Message[]>((res) =>
    setTimeout(() => res(mockMessages.filter(m => m.ticket_id === ticketId)), DEFAULT_DELAY)
  );
}

/**
 * Create a new message
 */
export async function createMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const fullMessage: Message = {
    ...message,
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/messages`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(fullMessage),
      });

      if (res.ok) {
        const data = await res.json();
        const created = Array.isArray(data) ? data[0] : data;
        return created || fullMessage;
      }
    } catch (err) {
      console.warn("Failed to create message in Supabase:", err);
    }
  }

  // Fallback to in-memory persistence
  mockMessages.push(fullMessage);
  return fullMessage;
}
