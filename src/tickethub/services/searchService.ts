import { fetchTickets, fetchArticles } from "./api";
import { Ticket, Article } from "../data/mockData";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'ticket' | 'article' | 'user' | 'page';
  url: string;
  priority?: string;
  status?: string;
}

export interface SearchResults {
  tickets: SearchResult[];
  articles: SearchResult[];
  pages: SearchResult[];
  users: SearchResult[];
}

// Mock users for search
const mockUsers = [
  { id: '1', name: 'Alex Thompson', email: 'alex@company.com', role: 'Support Agent' },
  { id: '2', name: 'Priya Patel', email: 'priya@company.com', role: 'Senior Agent' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@company.com', role: 'Support Manager' },
  { id: '4', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Support Agent' },
];

// App pages for search
const appPages = [
  { id: 'dashboard', title: 'Dashboard', url: '/', description: 'Main dashboard with overview' },
  { id: 'tickets', title: 'All Tickets', url: '/tickets', description: 'View and manage all tickets' },
  { id: 'analytics', title: 'Analytics', url: '/analytics', description: 'Performance and analytics dashboard' },
  { id: 'knowledge-base', title: 'Knowledge Base', url: '/knowledge-base', description: 'Browse help articles and documentation' },
  { id: 'surveys', title: 'Surveys', url: '/surveys', description: 'Customer satisfaction surveys' },
  { id: 'reports', title: 'Reports', url: '/reports', description: 'Generate and schedule reports' },
  { id: 'settings', title: 'Settings', url: '/settings', description: 'Workspace settings and configuration' },
  { id: 'playground', title: 'Playground', url: '/playground', description: 'Charts and components playground' },
];

export class SearchService {
  private static instance: SearchService;
  private ticketsCache: Ticket[] = [];
  private articlesCache: Article[] = [];
  private lastCacheUpdate = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  private async updateCacheIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.cacheTimeout) {
      try {
        const [tickets, articles] = await Promise.all([
          fetchTickets(),
          fetchArticles()
        ]);
        
        this.ticketsCache = Array.isArray(tickets) ? tickets : [];
        this.articlesCache = Array.isArray(articles) ? articles : [];
        this.lastCacheUpdate = now;
      } catch (error) {
        console.error('Failed to update search cache:', error);
        // Use existing cache if available
      }
    }
  }

  private normalizeString(str: string): string {
    return str.toLowerCase().trim();
  }

  private searchInString(searchTerm: string, content: string): boolean {
    const normalizedSearch = this.normalizeString(searchTerm);
    const normalizedContent = this.normalizeString(content);
    
    // Split search term into words for better matching
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
    
    return searchWords.every(word => normalizedContent.includes(word));
  }

  private searchTickets(query: string, limit: number = 5): SearchResult[] {
    if (!query.trim() || this.ticketsCache.length === 0) return [];

    return this.ticketsCache
      .filter(ticket =>
        this.searchInString(query, ticket.subject) ||
        this.searchInString(query, ticket.body || '') ||
        this.searchInString(query, ticket.customer || '') ||
        this.searchInString(query, ticket.id)
      )
      .slice(0, limit)
      .map(ticket => ({
        id: ticket.id,
        title: ticket.subject,
        subtitle: `${ticket.customer} • ${ticket.status} • ${ticket.priority}`,
        type: 'ticket' as const,
        url: `/tickets/${ticket.id}`,
        priority: ticket.priority,
        status: ticket.status,
      }));
  }

  private searchArticles(query: string, limit: number = 5): SearchResult[] {
    if (!query.trim() || this.articlesCache.length === 0) return [];

    return this.articlesCache
      .filter(article =>
        this.searchInString(query, article.title) ||
        this.searchInString(query, article.content) ||
        article.tags.some(tag => this.searchInString(query, tag))
      )
      .slice(0, limit)
      .map(article => ({
        id: article.id.toString(),
        title: article.title,
        subtitle: article.content.substring(0, 100) + (article.content.length > 100 ? '...' : ''),
        type: 'article' as const,
        url: '/knowledge-base',
      }));
  }

  private searchUsers(query: string, limit: number = 3): SearchResult[] {
    if (!query.trim()) return [];

    return mockUsers
      .filter(user =>
        this.searchInString(query, user.name) ||
        this.searchInString(query, user.email) ||
        this.searchInString(query, user.role)
      )
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        title: user.name,
        subtitle: `${user.email} • ${user.role}`,
        type: 'user' as const,
        url: '#', // Could link to user profile in future
      }));
  }

  private searchPages(query: string, limit: number = 4): SearchResult[] {
    if (!query.trim()) return [];

    return appPages
      .filter(page =>
        this.searchInString(query, page.title) ||
        this.searchInString(query, page.description)
      )
      .slice(0, limit)
      .map(page => ({
        id: page.id,
        title: page.title,
        subtitle: page.description,
        type: 'page' as const,
        url: page.url,
      }));
  }

  async search(query: string): Promise<SearchResults> {
    if (!query.trim()) {
      return {
        tickets: [],
        articles: [],
        pages: [],
        users: [],
      };
    }

    await this.updateCacheIfNeeded();

    // Perform searches with higher limits for federated search
    const tickets = this.searchTickets(query, 8);
    const articles = this.searchArticles(query, 6);
    const pages = this.searchPages(query, 6);
    const users = this.searchUsers(query, 4);

    return {
      tickets,
      articles,
      pages,
      users,
    };
  }

  // Quick search for instant results (without full cache update)
  quickSearch(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const allResults: SearchResult[] = [
      ...this.searchTickets(query),
      ...this.searchArticles(query),
      ...this.searchPages(query),
      ...this.searchUsers(query),
    ];

    // Sort by relevance (exact matches first, then partial matches)
    return allResults
      .sort((a, b) => {
        const aExact = this.normalizeString(a.title).includes(this.normalizeString(query));
        const bExact = this.normalizeString(b.title).includes(this.normalizeString(query));
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      })
      .slice(0, 8); // Limit total results for quick search
  }
}

export const searchService = SearchService.getInstance();
