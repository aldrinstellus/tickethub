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
 * Create a ticket using seeded in-memory data only.
 * This intentionally ignores any Supabase configuration and always persists to the local mock dataset.
 */
export async function createTicket(ticket: Ticket): Promise<Ticket> {
  // Persist to seeded mock dataset
  mockTickets.unshift(ticket);
  return Promise.resolve(ticket);
}
