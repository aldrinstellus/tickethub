import { Article } from "../data/mockData";

export interface AIProvider {
  name: string;
  generateResponse: (prompt: string, context: Article[]) => Promise<string>;
}

// OpenAI Provider
class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, context: Article[]): Promise<string> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful customer support agent. Use the following knowledge base articles to help answer questions: ${context.map(a => `${a.title}: ${a.content}`).join('\n')}`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  }
}

// Anthropic Provider
class AnthropicProvider implements AIProvider {
  name = "Anthropic";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, context: Article[]): Promise<string> {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `As a customer support agent, please help with this request: "${prompt}"\n\nAvailable knowledge base articles:\n${context.map(a => `${a.title}: ${a.content}`).join('\n')}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0]?.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Anthropic API error:", error);
      throw error;
    }
  }
}

// OpenRouter Provider
class OpenRouterProvider implements AIProvider {
  name = "OpenRouter";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, context: Article[] = []): Promise<string> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "TicketHub AI Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku", // Fast, cost-effective model
          messages: [
            {
              role: "system",
              content: "You are an AI assistant for TicketHub, a customer support platform. Help users with ticket management, knowledge base queries, and general support tasks. Be concise, helpful, and professional."
            },
            {
              role: "user",
              content: `${prompt}\n\n${context.length > 0 ? `Available knowledge: ${context.map(a => `${a.title}: ${a.content}`).join('\n')}` : ''}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenRouter API error:", error);
      throw error;
    }
  }
}

// Enhanced Mock Provider (fallback)
class EnhancedMockProvider implements AIProvider {
  name = "Enhanced Mock";

  async generateResponse(prompt: string, context: Article[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    const lower = prompt.toLowerCase();
    const parts: string[] = [];

    // More sophisticated pattern matching
    if (lower.includes("password") || lower.includes("login") || lower.includes("sign in")) {
      const kb = context.find((a) => a.tags.includes("password") || a.tags.includes("account"));
      parts.push(
        "I understand you're having trouble with account access. Let me help you with that. Please try using the 'Forgot password' link on the sign-in page and check your email (including spam folder). If you still don't receive the reset email, I can manually trigger a reset for you."
      );
      if (kb) parts.push(`Reference: ${kb.title}.`);
    }

    else if (lower.includes("billing") || lower.includes("invoice") || lower.includes("charge") || lower.includes("payment")) {
      const kb = context.find((a) => a.tags.includes("billing") || a.tags.includes("invoice"));
      parts.push(
        "I've reviewed your billing inquiry. Let me check your account details. Billing discrepancies often occur due to seat changes or prorated charges. I can review your invoice line by line and make any necessary adjustments if there's an error."
      );
      if (kb) parts.push(`Reference: ${kb.title}.`);
    }

    else if (lower.includes("api") || lower.includes("rate limit") || lower.includes("429") || lower.includes("error")) {
      const kb = context.find((a) => a.tags.includes("api") || a.tags.includes("rate limit"));
      parts.push(
        "I see you're experiencing API issues. Rate limiting is typically caused by exceeding your plan's request quota. Let me check your current usage and suggest optimization strategies like request batching or upgrading your plan if needed."
      );
      if (kb) parts.push(`Reference: ${kb.title}.`);
    }

    else if (lower.includes("bug") || lower.includes("error") || lower.includes("not working") || lower.includes("broken")) {
      parts.push(
        "Thank you for reporting this issue. I'd like to gather some additional information to help resolve this quickly. Could you please share: 1) The exact steps you took when the issue occurred, 2) Any error messages you saw, 3) Your browser and device type? I'll investigate this right away."
      );
    }

    else if (lower.includes("feature") || lower.includes("request") || lower.includes("enhancement") || lower.includes("suggest")) {
      parts.push(
        "Thank you for your feature suggestion! I've documented your request and will share it with our product team for consideration. Feature requests help us prioritize our development roadmap. I'll keep you updated on any progress."
      );
    }

    else if (lower.includes("refund") || lower.includes("cancel") || lower.includes("downgrade")) {
      parts.push(
        "I understand you'd like to make changes to your account. Let me review your current plan and usage to ensure we find the best solution for your needs. I can help with plan adjustments, pausing your account, or processing any applicable refunds."
      );
    }

    else {
      // Generic helpful response
      parts.push(
        "Thank you for reaching out to our support team. I'm here to help resolve your inquiry. To provide the most accurate assistance, could you please share a bit more detail about what you're experiencing? Any specific error messages, screenshots, or steps you've already tried would be very helpful."
      );
    }

    // Add knowledge base suggestions
    if (context.length > 0) {
      const relevantArticles = context.filter(article => 
        article.tags.some(tag => lower.includes(tag.toLowerCase()))
      );
      
      if (relevantArticles.length > 0) {
        parts.push(`\n\nYou might also find these helpful:\n${relevantArticles.slice(0, 2).map(a => `• ${a.title}`).join('\n')}`);
      }
    }

    parts.push("\n\nIs there anything specific I can help clarify or investigate further?");

    return parts.join(" ");
  }
}

// AI Service Manager
class AIService {
  private provider: AIProvider;

  constructor() {
    // Try to initialize real providers if API keys are available
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (openRouterKey) {
      this.provider = new OpenRouterProvider(openRouterKey);
      console.log("AI Service: Using OpenRouter provider");
    } else if (openaiKey) {
      this.provider = new OpenAIProvider(openaiKey);
      console.log("AI Service: Using OpenAI provider");
    } else if (anthropicKey) {
      this.provider = new AnthropicProvider(anthropicKey);
      console.log("AI Service: Using Anthropic provider");
    } else {
      this.provider = new EnhancedMockProvider();
      console.log("AI Service: Using enhanced mock provider (no API keys found)");
    }
  }

  async generateResponse(prompt: string, context: Article[] = []): Promise<string> {
    try {
      return await this.provider.generateResponse(prompt, context);
    } catch (error) {
      console.error(`AI Provider (${this.provider.name}) failed:`, error);
      // Fallback to mock if real provider fails
      if (!(this.provider instanceof EnhancedMockProvider)) {
        console.log("Falling back to mock provider");
        const fallback = new EnhancedMockProvider();
        return await fallback.generateResponse(prompt, context);
      }
      throw error;
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Legacy export for backward compatibility
export function generateAiResponse(input: string, related: Article[]): Promise<string> {
  return aiService.generateResponse(input, related);
}
