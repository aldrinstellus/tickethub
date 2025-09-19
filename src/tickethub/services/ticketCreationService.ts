export interface NewTicketData {
  customerEmail: string;
  customerName?: string;
  customerCompany?: string;
  customerPhone?: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  category?: string;
  assignedTo?: string;
  tags?: string[];
  attachments?: File[];
}

export interface CreatedTicket {
  id: string;
  customerEmail: string;
  customerName: string;
  customerCompany: string;
  customerPhone?: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'New' | 'Open' | 'Pending' | 'Resolved' | 'Closed';
  category: string;
  assignedTo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock function to generate ticket ID
function generateTicketId(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TH-${year}${month}-${random}`;
}

// Mock function to simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout resolve, ms);
}

export async function createTicket(ticketData: NewTicketData): Promise<CreatedTicket> {
  try {
    console.log('Creating ticket with data:', ticketData);
    
    // Simulate API call delay
    await delay(1000);
    
    // In a real implementation, this would be a Supabase call:
    // const { data, error } = await supabase
    //   .from('tickets')
    //   .insert([{
    //     customer_email: ticketData.customerEmail,
    //     customer_name: ticketData.customerName || 'Unknown Customer',
    //     customer_company: ticketData.customerCompany || '',
    //     customer_phone: ticketData.customerPhone || '',
    //     subject: ticketData.subject,
    //     description: ticketData.description,
    //     priority: ticketData.priority,
    //     status: 'New',
    //     category: ticketData.category || 'General',
    //     assigned_to: ticketData.assignedTo || 'Unassigned',
    //     tags: ticketData.tags || [],
    //   }])
    //   .select()
    //   .single();
    
    // For now, return mock data
    const newTicket: CreatedTicket = {
      id: generateTicketId(),
      customerEmail: ticketData.customerEmail,
      customerName: ticketData.customerName || 'Unknown Customer',
      customerCompany: ticketData.customerCompany || '',
      customerPhone: ticketData.customerPhone,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority,
      status: 'New',
      category: ticketData.category || 'General',
      assignedTo: ticketData.assignedTo || 'Unassigned',
      tags: ticketData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newTicket;
  } catch (error) {
    console.error('Failed to create ticket:', error);
    throw new Error('Failed to create ticket. Please try again.');
  }
}

// Validate customer email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if customer exists (mock implementation)
export async function checkCustomerExists(email: string): Promise<{
  exists: boolean;
  customerData?: {
    name: string;
    company: string;
    phone?: string;
  };
}> {
  await delay(300); // Simulate API delay
  
  // Mock customer database
  const mockCustomers: Record<string, { name: string; company: string; phone?: string }> = {
    'john.doe@acme.com': { name: 'John Doe', company: 'Acme Corp', phone: '+1-555-0123' },
    'jane.smith@techco.com': { name: 'Jane Smith', company: 'TechCo Inc', phone: '+1-555-0456' },
    'bob.wilson@startup.io': { name: 'Bob Wilson', company: 'Startup.io' },
  };

  const customerData = mockCustomers[email.toLowerCase()];
  
  return {
    exists: !!customerData,
    customerData,
  };
}

// Get team members for assignment dropdown
export async function getTeamMembers(): Promise<{ id: string; name: string; email: string; available: boolean }[]> {
  await delay(200);
  
  return [
    { id: '1', name: 'Alex Thompson', email: 'alex@company.com', available: true },
    { id: '2', name: 'Priya Patel', email: 'priya@company.com', available: true },
    { id: '3', name: 'Marcus Johnson', email: 'marcus@company.com', available: false },
    { id: '4', name: 'Sarah Chen', email: 'sarah@company.com', available: true },
  ];
}

// Get ticket categories
export function getTicketCategories(): string[] {
  return [
    'General',
    'Technical Support',
    'Billing & Account',
    'Feature Request',
    'Bug Report',
    'Account Access',
    'Integration Support',
    'Training & Onboarding',
  ];
}