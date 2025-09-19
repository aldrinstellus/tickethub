import { tickets as mockTickets, Article, Ticket } from "../data/mockData";

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

export async function fetchTickets() {
  const remote = await tryFetch<typeof mockTickets>("/api/tickets");
  if (remote) return remote;
  return new Promise<typeof mockTickets>((res) => setTimeout(() => res(mockTickets), DEFAULT_DELAY));
}

export async function fetchArticles(): Promise<Article[]> {
  const remote = await tryFetch<Article[]>("/api/articles");
  if (remote) return remote;
  return new Promise<Article[]>((res) => setTimeout(() => res(mockTickets as unknown as Article[]), DEFAULT_DELAY));
}

/**
 * Create a ticket with best-effort persistence to Supabase if environment is configured.
 * Falls back to in-memory mock data when Supabase is not available.
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
        // Supabase returns an array when using return=representation
        const created = Array.isArray(data) ? data[0] : data;
        const result: Ticket = {
          ...ticket,
          ...(created || {}),
        };
        return result;
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  // Fallback to in-memory persistence
  mockTickets.unshift(ticket);
  return ticket;
}
