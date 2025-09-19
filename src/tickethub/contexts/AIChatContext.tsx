import React from 'react';
import { useLocation } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { fetchArticles } from '../services/api';
import { Article, Ticket } from '../data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    page?: string;
    ticket?: string;
    action?: string;
  };
}

export interface ChatContext {
  currentPage: string;
  currentTicket?: Ticket;
  userRole: string;
  availableActions: string[];
}

interface AIChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  context: ChatContext;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

const AIChatContext = React.createContext<AIChatContextType | undefined>(undefined);

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [knowledgeBase, setKnowledgeBase] = React.useState<Article[]>([]);
  const location = useLocation();

  // Load knowledge base on mount
  React.useEffect(() => {
    fetchArticles().then(setKnowledgeBase).catch(console.error);
  }, []);

  // Build current context
  const context = React.useMemo((): ChatContext => {
    const path = location.pathname;
    let currentPage = 'Dashboard';
    let availableActions: string[] = [];

    if (path.startsWith('/tickets/')) {
      currentPage = 'Ticket Detail';
      availableActions = ['update status', 'assign ticket', 'add comment', 'escalate', 'close ticket'];
    } else if (path === '/tickets') {
      currentPage = 'Tickets List';
      availableActions = ['create ticket', 'search tickets', 'bulk actions', 'filter tickets'];
    } else if (path === '/knowledge-base') {
      currentPage = 'Knowledge Base';
      availableActions = ['search articles', 'create article', 'browse categories'];
    } else if (path === '/analytics') {
      currentPage = 'Analytics';
      availableActions = ['view metrics', 'generate report', 'export data'];
    } else if (path === '/surveys') {
      currentPage = 'Surveys';
      availableActions = ['create survey', 'view responses', 'analyze feedback'];
    } else if (path === '/settings') {
      currentPage = 'Settings';
      availableActions = ['update profile', 'manage team', 'configure workflows'];
    }

    return {
      currentPage,
      userRole: 'agent', // TODO: Get from user context
      availableActions,
    };
  }, [location.pathname]);

  const openChat = React.useCallback(() => {
    setIsOpen(true);
    
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm your AI assistant for TicketHub. I can help you with ticket management, knowledge base queries, and navigation. Currently viewing: **${context.currentPage}**\n\nWhat can I help you with?`,
        timestamp: new Date(),
        context: { page: context.currentPage }
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, context.currentPage]);

  const closeChat = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = React.useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
      context: { 
        page: context.currentPage,
        action: 'user_query'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Build context-aware prompt
      const contextPrompt = `
Context: User is on ${context.currentPage} page in TicketHub support system.
Available actions: ${context.availableActions.join(', ')}
User query: ${content}

Please provide a helpful response. If the user wants to perform an action, guide them through it step by step.
      `.trim();

      const response = await aiService.generateResponse(contextPrompt, knowledgeBase.slice(0, 5));

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        context: { 
          page: context.currentPage,
          action: 'ai_response'
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact your system administrator if the issue persists.",
        timestamp: new Date(),
        context: { 
          page: context.currentPage,
          action: 'error_response'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [context, knowledgeBase]);

  const clearHistory = React.useCallback(() => {
    setMessages([]);
  }, []);

  const value = React.useMemo(() => ({
    isOpen,
    messages,
    isTyping,
    context,
    openChat,
    closeChat,
    sendMessage,
    clearHistory,
  }), [isOpen, messages, isTyping, context, openChat, closeChat, sendMessage, clearHistory]);

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = React.useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}
