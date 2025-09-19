import { Article, Ticket } from "../data/mockData";
import { aiService } from "./aiService";

export interface SentimentAnalysis {
  score: number; // -1 to 1 (-1 = very negative, 0 = neutral, 1 = very positive)
  label: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0 to 1
  keywords: string[];
}

export interface CategorySuggestion {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface EscalationPrediction {
  risk: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0 to 1
  factors: string[];
  suggestedActions: string[];
}

export interface PrioritySuggestion {
  suggestedPriority: 'Low' | 'Normal' | 'High' | 'Urgent';
  currentPriority: string;
  shouldChange: boolean;
  reasoning: string;
  confidence: number;
}

export interface AIInsights {
  sentiment: SentimentAnalysis;
  categoryData: CategorySuggestion[];
  escalationRisk: EscalationPrediction;
  prioritySuggestion: PrioritySuggestion;
  responseTemplates: string[];
  suggestedActions: string[];
}

export interface SmartResponse {
  text: string;
  confidence: number;
  type: 'template' | 'generated' | 'knowledge_base';
  sources?: string[];
}

class AIAssistanceService {
  // Sentiment Analysis
  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    // Handle undefined, null, or non-string inputs
    if (!text || typeof text !== 'string') {
      return {
        score: 0,
        label: 'neutral',
        confidence: 0.5,
        keywords: []
      };
    }

    // In a real implementation, this would call an AI service
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based sentiment analysis (mock)
    const positiveWords = ['thank', 'great', 'good', 'excellent', 'appreciate', 'love', 'perfect', 'amazing', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'broken', 'useless', 'frustrated', 'angry'];
    const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline'];
    
    let score = 0;
    const keywords: string[] = [];
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        score += 0.3;
        keywords.push(word);
      }
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        score -= 0.4;
        keywords.push(word);
      }
    });
    
    urgentWords.forEach(word => {
      if (lowerText.includes(word)) {
        score -= 0.2; // Urgency often correlates with negative sentiment
        keywords.push(word);
      }
    });
    
    // Normalize score
    score = Math.max(-1, Math.min(1, score));
    
    let label: 'positive' | 'neutral' | 'negative';
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';
    else label = 'neutral';
    
    return {
      score,
      label,
      confidence: Math.random() * 0.3 + 0.7, // Mock confidence between 0.7-1.0
      keywords
    };
  }

  // Auto-categorization
  async suggestCategory(ticket: Ticket): Promise<CategorySuggestion[]> {
    const text = `${ticket.subject} ${ticket.body}`.toLowerCase();
    
    const categories = [
      {
        name: 'Technical Support',
        keywords: ['error', 'bug', 'issue', 'not working', 'broken', 'api', 'code', 'integration']
      },
      {
        name: 'Billing',
        keywords: ['payment', 'invoice', 'billing', 'charge', 'refund', 'subscription', 'plan']
      },
      {
        name: 'Account',
        keywords: ['login', 'password', 'account', 'access', 'permission', 'user', 'profile']
      },
      {
        name: 'Feature Request',
        keywords: ['feature', 'enhancement', 'suggestion', 'improvement', 'add', 'new']
      },
      {
        name: 'General Inquiry',
        keywords: ['question', 'how to', 'help', 'information', 'guide', 'documentation']
      }
    ];
    
    const suggestions: CategorySuggestion[] = categories.map(category => {
      const matches = category.keywords.filter(keyword => text.includes(keyword));
      const confidence = matches.length / category.keywords.length;
      
      return {
        category: category.name,
        confidence,
        reasoning: matches.length > 0 
          ? `Detected keywords: ${matches.join(', ')}`
          : 'No strong indicators found'
      };
    }).sort((a, b) => b.confidence - a.confidence);
    
    return suggestions.slice(0, 3);
  }

  // Escalation Prediction
  async predictEscalation(ticket: Ticket, messages: any[] = []): Promise<EscalationPrediction> {
    const factors: string[] = [];
    let riskScore = 0;
    
    // Check priority
    if (ticket.priority === 'Urgent') {
      riskScore += 0.4;
      factors.push('Urgent priority');
    } else if (ticket.priority === 'High') {
      riskScore += 0.2;
      factors.push('High priority');
    }
    
    // Check ticket age
    const ageInHours = (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
    if (ageInHours > 24) {
      riskScore += 0.3;
      factors.push('Ticket older than 24 hours');
    }
    
    // Check message count (if no response)
    if (messages.length <= 1) {
      riskScore += 0.2;
      factors.push('No agent response yet');
    }
    
    // Check sentiment
    const sentiment = await this.analyzeSentiment(ticket.body);
    if (sentiment.label === 'negative') {
      riskScore += 0.3;
      factors.push('Negative customer sentiment');
    }
    
    // Check for escalation keywords
    const escalationKeywords = ['manager', 'supervisor', 'escalate', 'complaint', 'dissatisfied'];
    const text = `${ticket.subject} ${ticket.body}`.toLowerCase();
    if (escalationKeywords.some(keyword => text.includes(keyword))) {
      riskScore += 0.4;
      factors.push('Escalation keywords detected');
    }
    
    // Determine risk level
    let risk: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 0.8) risk = 'critical';
    else if (riskScore >= 0.6) risk = 'high';
    else if (riskScore >= 0.3) risk = 'medium';
    else risk = 'low';
    
    // Suggest actions
    const suggestedActions: string[] = [];
    if (risk === 'critical' || risk === 'high') {
      suggestedActions.push('Assign to senior agent immediately');
      suggestedActions.push('Notify team lead');
    }
    if (riskScore > 0.5) {
      suggestedActions.push('Provide immediate acknowledgment');
      suggestedActions.push('Set follow-up reminder');
    }
    if (factors.includes('Negative customer sentiment')) {
      suggestedActions.push('Use empathetic language');
      suggestedActions.push('Offer direct phone call');
    }
    
    return {
      risk,
      probability: Math.min(1, riskScore),
      factors,
      suggestedActions
    };
  }

  // Priority Suggestion
  async suggestPriority(ticket: Ticket): Promise<PrioritySuggestion> {
    const text = `${ticket.subject} ${ticket.body}`.toLowerCase();
    let score = 0;
    
    // Keywords that indicate urgency
    const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'outage'];
    const highKeywords = ['important', 'soon', 'deadline', 'blocking', 'cannot'];
    const lowKeywords = ['when possible', 'eventually', 'minor', 'suggestion'];
    
    urgentKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 3;
    });
    
    highKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 2;
    });
    
    lowKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 1;
    });
    
    // Check for business impact indicators
    if (text.includes('production') || text.includes('live') || text.includes('customers affected')) {
      score += 2;
    }
    
    let suggestedPriority: 'Low' | 'Normal' | 'High' | 'Urgent';
    if (score >= 5) suggestedPriority = 'Urgent';
    else if (score >= 3) suggestedPriority = 'High';
    else if (score >= 1) suggestedPriority = 'Normal';
    else suggestedPriority = 'Low';
    
    const shouldChange = suggestedPriority !== ticket.priority;
    const confidence = Math.min(0.95, Math.max(0.5, Math.abs(score) / 5));
    
    return {
      suggestedPriority,
      currentPriority: ticket.priority,
      shouldChange,
      reasoning: shouldChange 
        ? `AI analysis suggests ${suggestedPriority} priority based on content analysis`
        : 'Current priority appears appropriate',
      confidence
    };
  }

  // Generate comprehensive insights
  async generateInsights(ticket: Ticket, messages: any[] = [], articles: Article[] = []): Promise<AIInsights> {
    const [sentiment, categoryData, escalationRisk, prioritySuggestion] = await Promise.all([
      this.analyzeSentiment(ticket.body),
      this.suggestCategory(ticket),
      this.predictEscalation(ticket, messages),
      this.suggestPriority(ticket)
    ]);

    // Generate response templates based on analysis
    const responseTemplates = await this.generateResponseTemplates(ticket, sentiment, articles);
    
    // Suggest actions based on insights
    const suggestedActions = this.generateActionSuggestions(sentiment, escalationRisk, prioritySuggestion);

    return {
      sentiment,
      categoryData,
      escalationRisk,
      prioritySuggestion,
      responseTemplates,
      suggestedActions
    };
  }

  // Generate smart response suggestions
  async generateSmartResponse(
    ticket: Ticket, 
    messages: any[] = [], 
    articles: Article[] = []
  ): Promise<SmartResponse[]> {
    const responses: SmartResponse[] = [];
    
    // Get AI-generated response
    try {
      const aiResponse = await aiService.generateResponse(
        `Customer issue: ${ticket.subject}\n\nDetails: ${ticket.body}`,
        articles
      );
      
      responses.push({
        text: aiResponse,
        confidence: 0.85,
        type: 'generated',
        sources: articles.map(a => a.title)
      });
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
    
    // Add template-based responses
    const sentiment = await this.analyzeSentiment(ticket.body);
    const templates = await this.generateResponseTemplates(ticket, sentiment, articles);
    
    templates.forEach((template, index) => {
      responses.push({
        text: template,
        confidence: 0.7 - (index * 0.1),
        type: 'template'
      });
    });
    
    return responses.sort((a, b) => b.confidence - a.confidence);
  }

  // Helper: Generate response templates
  private async generateResponseTemplates(
    ticket: Ticket, 
    sentiment: SentimentAnalysis, 
    articles: Article[]
  ): Promise<string[]> {
    const templates: string[] = [];
    
    // Empathetic opening based on sentiment
    let opening = "Thank you for contacting our support team.";
    if (sentiment.label === 'negative') {
      opening = "I understand your frustration, and I'm here to help resolve this issue quickly.";
    } else if (sentiment.label === 'positive') {
      opening = "Thank you for reaching out! I'm happy to help with your request.";
    }
    
    // Category-specific templates
    const category = await this.suggestCategory(ticket);
    const topCategory = category[0]?.category || 'General';
    
    switch (topCategory) {
      case 'Technical Support':
        templates.push(
          `${opening} I've reviewed your technical issue and will investigate this right away. To help me provide the most accurate solution, could you please share any error messages or screenshots you're seeing?`
        );
        break;
      
      case 'Billing':
        templates.push(
          `${opening} I'll review your billing inquiry immediately. Let me check your account details and explain any charges you're questioning. I can make adjustments if needed.`
        );
        break;
      
      case 'Account':
        templates.push(
          `${opening} I can help you with your account access issue. For security purposes, I'll verify your identity and then provide the appropriate solution to restore your access.`
        );
        break;
      
      default:
        templates.push(
          `${opening} I'm here to help with your inquiry. Let me review the details you've provided and get back to you with a solution.`
        );
    }
    
    // Add knowledge base reference if relevant
    if (articles.length > 0) {
      templates.push(
        `${opening} I found some relevant resources that might help. Let me walk you through the solution and provide additional guidance if needed.`
      );
    }
    
    return templates;
  }

  // Helper: Generate action suggestions
  private generateActionSuggestions(
    sentiment: SentimentAnalysis,
    escalationRisk: EscalationPrediction,
    prioritySuggestion: PrioritySuggestion
  ): string[] {
    const actions: string[] = [];
    
    if (escalationRisk.risk === 'high' || escalationRisk.risk === 'critical') {
      actions.push('Priority response required');
      actions.push('Consider phone call follow-up');
    }
    
    if (sentiment.label === 'negative') {
      actions.push('Use empathetic language');
      actions.push('Offer additional support channels');
    }
    
    if (prioritySuggestion.shouldChange) {
      actions.push(`Consider changing priority to ${prioritySuggestion.suggestedPriority}`);
    }
    
    if (escalationRisk.probability > 0.5) {
      actions.push('Set follow-up reminder');
      actions.push('Notify team lead of potential escalation');
    }
    
    return actions;
  }

  // Get provider information
  getProviderInfo() {
    return {
      name: aiService.getProviderName(),
      capabilities: [
        'Sentiment Analysis',
        'Auto-categorization',
        'Escalation Prediction',
        'Priority Suggestions',
        'Smart Response Generation'
      ]
    };
  }
}

// Export singleton instance
export const aiAssistanceService = new AIAssistanceService();
