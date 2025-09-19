import { tickets as mockTickets, articles as mockArticles, messages as mockMessages } from "../data/mockData";
import type { Article, Ticket, Message } from "../data/mockData";

const DEFAULT_DELAY = 500;

// Environment validation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Log Supabase configuration status on module load
if (SUPABASE_URL && SUPABASE_KEY) {
  console.log("Supabase configuration detected, will attempt to use live data");
} else {
  console.log("Supabase configuration missing, will use mock data");
}

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    console.log(`Attempting to fetch from: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Fetch failed with status: ${res.status} for ${url}`);
      return null;
    }
    const data = await res.json();
    console.log(`Successfully fetched data from: ${url}`);
    return data as T;
  } catch (e) {
    console.log(`Fetch error for ${url}:`, e instanceof Error ? e.message : e);
    return null;
  }
}

async function supabaseFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  // If config is missing, immediately return null to use fallback
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("Supabase configuration missing, skipping Supabase fetch");
    return null;
  }

  // Validate URL format (only on first call)
  try {
    new URL(SUPABASE_URL);
  } catch {
    console.warn("Invalid Supabase URL format, using fallback data");
    return null;
  }

  // Wrap everything in additional try-catch for maximum safety
  try {
    const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/${endpoint}`;
    console.log(`Attempting Supabase fetch: ${url}`);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`Supabase request timeout for ${endpoint}`);
      controller.abort();
    }, 8000); // Reduced to 8 second timeout

    let res;
    try {
      res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          ...options?.headers,
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn(`Fetch request failed for ${endpoint}:`, fetchError instanceof Error ? fetchError.message : fetchError);
      return null;
    }

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Supabase API error: ${res.status} ${res.statusText} for ${url}. Using fallback data.`);
      try {
        const errorText = await res.text();
        console.warn(`Error details:`, errorText);
      } catch (err) {
        console.warn(`Could not read error response`);
      }
      return null;
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.warn(`Failed to parse JSON response from ${endpoint}:`, jsonError instanceof Error ? jsonError.message : jsonError);
      return null;
    }

    console.log(`Supabase fetch successful for endpoint: ${endpoint}, received ${Array.isArray(data) ? data.length : 1} items`);
    return data as T;
  } catch (e) {
    // Handle different types of errors gracefully
    if (e instanceof Error) {
      if (e.name === 'AbortError') {
        console.warn(`Supabase request timed out for ${endpoint}, using fallback data`);
      } else if (e.message.includes('Failed to fetch')) {
        console.warn(`Network error connecting to Supabase for ${endpoint}, using fallback data. Check network connection and Supabase URL.`);
      } else if (e.message.includes('NetworkError')) {
        console.warn(`Network error for ${endpoint}:`, e.message);
      } else {
        console.warn(`Supabase fetch failed for ${endpoint}:`, e.message, "- using fallback data");
      }
    } else {
      console.warn(`Unknown error in Supabase fetch for ${endpoint}, using fallback data:`, e);
    }
    return null;
  }
}

// Transform Supabase data to match our TypeScript interface
function transformSupabaseTicket(dbTicket: any): Ticket {
  return {
    id: dbTicket.id,
    subject: dbTicket.subject,
    customer: dbTicket.customer,
    priority: dbTicket.priority,
    status: dbTicket.status,
    assignee: dbTicket.assignee,
    updatedAt: dbTicket.updated_at, // Transform snake_case to camelCase
    tags: dbTicket.tags || [],
    body: dbTicket.body || '',
  };
}

export async function fetchTickets() {
  console.log("Starting fetchTickets...");

  try {
    // Try Supabase first with additional error protection
    console.log("Attempting Supabase fetch...");
    let supabaseTickets;
    try {
      const rawTickets = await supabaseFetch<any[]>("tickets?order=updated_at.desc");
      if (rawTickets && Array.isArray(rawTickets)) {
        // Transform the data to match our interface
        supabaseTickets = rawTickets.map(transformSupabaseTicket);
      } else {
        supabaseTickets = null;
      }
    } catch (supabaseError) {
      console.warn("Supabase fetch failed:", supabaseError);
      supabaseTickets = null;
    }

    if (supabaseTickets && Array.isArray(supabaseTickets)) {
      console.log(`Successfully fetched ${supabaseTickets.length} tickets from Supabase`);
      return supabaseTickets;
    }

    // Try local API fallback with additional error protection
    console.log("Attempting local API fallback...");
    let remote;
    try {
      remote = await tryFetch<typeof mockTickets>("/api/tickets");
    } catch (localError) {
      console.warn("Local API fetch failed:", localError);
      remote = null;
    }

    if (remote) {
      console.log("Using tickets from local API");
      return remote;
    }

    // Use mock data as final fallback
    console.log("Using mock ticket data as final fallback");
    return new Promise<typeof mockTickets>((res) =>
      setTimeout(() => res(mockTickets), DEFAULT_DELAY)
    );
  } catch (error) {
    console.error("Unexpected error in fetchTickets:", error);
    // Always return mock data if everything fails
    console.log("Returning mock data due to unexpected error");
    return new Promise<typeof mockTickets>((res) =>
      setTimeout(() => res(mockTickets), DEFAULT_DELAY)
    );
  }
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    // Try Supabase first
    const supabaseArticles = await supabaseFetch<Article[]>("articles");
    if (supabaseArticles && Array.isArray(supabaseArticles)) {
      console.log(`Successfully fetched ${supabaseArticles.length} articles from Supabase`);
      return supabaseArticles;
    }

    // Try local API fallback
    const remote = await tryFetch<Article[]>("/api/articles");
    if (remote) {
      console.log("Using articles from local API");
      return remote;
    }

    // Use mock data as final fallback
    console.log("Using mock article data");
    return new Promise<Article[]>((res) =>
      setTimeout(() => res(mockArticles), DEFAULT_DELAY)
    );
  } catch (error) {
    console.error("Error in fetchArticles:", error);
    return new Promise<Article[]>((res) =>
      setTimeout(() => res(mockArticles), DEFAULT_DELAY)
    );
  }
}

/**
 * Create a ticket with Supabase persistence and fallback to mock data.
 */
export async function createTicket(ticket: Ticket): Promise<Ticket> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/tickets`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(ticket),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const created = Array.isArray(data) ? data[0] : data;
        console.log("Successfully created ticket in Supabase");
        return created || ticket;
      }
    } catch (err) {
      console.warn("Failed to create ticket in Supabase:", err);
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
  try {
    // Try Supabase first
    const supabaseTicket = await supabaseFetch<Ticket[]>(`tickets?id=eq.${encodeURIComponent(id)}`);
    if (supabaseTicket && Array.isArray(supabaseTicket) && supabaseTicket.length > 0) {
      console.log(`Successfully fetched ticket ${id} from Supabase`);
      return supabaseTicket[0];
    }

    // Try local API fallback
    const remote = await tryFetch<Ticket>(`/api/tickets/${id}`);
    if (remote) {
      console.log(`Using ticket ${id} from local API`);
      return remote;
    }

    // Mock data fallback
    const mockTicket = mockTickets.find((t) => t.id === id) || null;
    if (mockTicket) {
      console.log(`Using mock ticket data for ${id}`);
    } else {
      console.warn(`Ticket ${id} not found in any data source`);
    }
    return mockTicket;
  } catch (error) {
    console.error(`Error fetching ticket ${id}:`, error);
    return mockTickets.find((t) => t.id === id) || null;
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket | null> {

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
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
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: "PATCH",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ assignee, updated_at: new Date().toISOString() }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const updated = Array.isArray(data) ? data[0] : data;
        console.log(`Successfully assigned ticket ${id} to ${assignee}`);
        return updated || null;
      }
    } catch (err) {
      console.warn(`Error assigning ticket ${id}:`, err);
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
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/tickets?id=eq.${encodeURIComponent(id)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: "PATCH",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ priority, updated_at: new Date().toISOString() }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const updated = Array.isArray(data) ? data[0] : data;
        console.log(`Successfully updated ticket ${id} priority to ${priority}`);
        return updated || null;
      }
    } catch (err) {
      console.warn(`Error updating ticket ${id} priority:`, err);
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
  try {
    // Try Supabase first
    const supabaseMessages = await supabaseFetch<Message[]>(`messages?ticket_id=eq.${encodeURIComponent(ticketId)}&order=created_at.asc`);
    if (supabaseMessages && Array.isArray(supabaseMessages)) {
      console.log(`Successfully fetched ${supabaseMessages.length} messages from Supabase for ticket ${ticketId}`);
      return supabaseMessages;
    }

    // Try local API fallback
    const remote = await tryFetch<Message[]>(`/api/messages?ticket_id=${ticketId}`);
    if (remote) {
      console.log(`Using messages from local API for ticket ${ticketId}`);
      return remote;
    }

    // Return filtered mock messages
    const filteredMessages = mockMessages.filter(m => m.ticket_id === ticketId);
    console.log(`Using ${filteredMessages.length} mock messages for ticket ${ticketId}`);
    return new Promise<Message[]>((res) =>
      setTimeout(() => res(filteredMessages), DEFAULT_DELAY)
    );
  } catch (error) {
    console.error(`Error in fetchMessages for ticket ${ticketId}:`, error);
    const filteredMessages = mockMessages.filter(m => m.ticket_id === ticketId);
    return new Promise<Message[]>((res) =>
      setTimeout(() => res(filteredMessages), DEFAULT_DELAY)
    );
  }
}

/**
 * Create a new message
 */
export async function createMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> {

  // Build local message for fallback only (id/timestamps generated locally)
  const localMessage: Message = {
    // @ts-ignore - id will be provided by Supabase; this object is for fallback only
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ticket_id: message.ticket_id,
    author: message.author,
    content: message.content,
    is_agent: message.is_agent,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/messages`;

      // Add timeout for create operations too
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for writes

      const res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        // Send only the fields Supabase should set defaults for (no id or timestamps)
        body: JSON.stringify({
          ticket_id: message.ticket_id,
          author: message.author,
          content: message.content,
          is_agent: message.is_agent,
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const created = Array.isArray(data) ? data[0] : data;
        console.log("Successfully created message in Supabase");
        return created || localMessage;
      } else {
        console.warn(`Failed to create message in Supabase: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.warn("Message creation timed out, using local fallback");
        } else {
          console.warn("Failed to create message in Supabase:", err.message);
        }
      } else {
        console.warn("Unknown error creating message in Supabase:", err);
      }
    }
  }

  // Fallback to in-memory persistence
  mockMessages.push(localMessage);
  return localMessage;
}
