import * as React from 'react';

interface RealTimeNotification {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_assigned' | 'escalation' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  ticketId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  read?: boolean;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
}

interface LiveMetrics {
  activeTickets: number;
  pendingTickets: number;
  avgResponseTime: string;
  onlineAgents: number;
  lastUpdated: Date;
}

interface RealTimeContextValue {
  // Notifications
  notifications: RealTimeNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  // Online presence
  onlineUsers: OnlineUser[];
  currentUserStatus: OnlineUser['status'];
  updateUserStatus: (status: OnlineUser['status']) => void;

  // Live metrics
  liveMetrics: LiveMetrics;

  // Connection status
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';

  // Real-time ticket updates
  subscribeToTicket: (ticketId: string) => void;
  unsubscribeFromTicket: (ticketId: string) => void;
  
  // Event handlers
  onTicketUpdate?: (ticketId: string, update: any) => void;
}

const RealTimeContext = React.createContext<RealTimeContextValue | undefined>(undefined);

export function useRealTime() {
  const context = React.useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
}

interface RealTimeProviderProps {
  children: React.ReactNode;
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  const initialNotifications: RealTimeNotification[] = [
    {
      id: 'n1',
      type: 'ticket_created',
      title: 'New ticket TH-1045',
      message: 'Password reset failing for user Alice',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      ticketId: 'TH-1045',
      priority: 'medium',
      read: false,
    },
    {
      id: 'n2',
      type: 'message',
      title: 'New message on TH-1042',
      message: 'Customer replied: I still cannot login',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      ticketId: 'TH-1042',
      priority: 'high',
      read: false,
    },
    {
      id: 'n3',
      type: 'ticket_assigned',
      title: 'Ticket TH-1038 assigned',
      message: 'Assigned to Priya Patel',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      ticketId: 'TH-1038',
      priority: 'low',
      read: true,
    },
    {
      id: 'n4',
      type: 'escalation',
      title: 'SLA breach on TH-1022',
      message: 'Escalated due to overdue SLA',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      ticketId: 'TH-1022',
      priority: 'urgent',
      read: false,
    },
    {
      id: 'n5',
      type: 'ticket_updated',
      title: 'Ticket TH-1043 updated',
      message: 'Status changed to Pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 200),
      ticketId: 'TH-1043',
      priority: 'medium',
      read: true,
    },
    {
      id: 'n6',
      type: 'ticket_created',
      title: 'New ticket TH-1046',
      message: 'Billing issue reported by Acme Corp',
      timestamp: new Date(Date.now() - 1000 * 60 * 250),
      ticketId: 'TH-1046',
      priority: 'high',
      read: false,
    },
    {
      id: 'n7',
      type: 'message',
      title: 'Message received on TH-1044',
      message: 'Devify: We are seeing intermittent 429s',
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      ticketId: 'TH-1044',
      priority: 'medium',
      read: true,
    },
    {
      id: 'n8',
      type: 'ticket_assigned',
      title: 'Ticket TH-1040 assigned',
      message: 'Assigned to Alex Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 360),
      ticketId: 'TH-1040',
      priority: 'low',
      read: true,
    },
    {
      id: 'n9',
      type: 'escalation',
      title: 'Potential escalation TH-1019',
      message: 'Suggested to escalate due to recurring failures',
      timestamp: new Date(Date.now() - 1000 * 60 * 420),
      ticketId: 'TH-1019',
      priority: 'high',
      read: false,
    },
    {
      id: 'n10',
      type: 'ticket_updated',
      title: 'Ticket TH-1001 updated',
      message: 'Notes added by Marcus',
      timestamp: new Date(Date.now() - 1000 * 60 * 480),
      ticketId: 'TH-1001',
      priority: 'low',
      read: true,
    },
  ];

  const [notifications, setNotifications] = React.useState<RealTimeNotification[]>(initialNotifications);
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUser[]>([
    { id: '1', name: 'Alex Thompson', status: 'online' },
    { id: '2', name: 'Priya Patel', status: 'away' },
    { id: '3', name: 'Marcus Johnson', status: 'online' },
    { id: '4', name: 'Sarah Chen', status: 'busy' },
  ]);
  const [currentUserStatus, setCurrentUserStatus] = React.useState<OnlineUser['status']>('online');
  const [isConnected, setIsConnected] = React.useState(true);
  const [connectionState, setConnectionState] = React.useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connected');
  const [subscribedTickets] = React.useState<Set<string>>(new Set());
  const [liveMetrics, setLiveMetrics] = React.useState<LiveMetrics>({
    activeTickets: 24,
    pendingTickets: 8,
    avgResponseTime: '2.3h',
    onlineAgents: 3,
    lastUpdated: new Date(),
  });

  // Simulate connection
  React.useEffect(() => {
    setConnectionState('connecting');
    
    const timer = setTimeout(() => {
      setIsConnected(true);
      setConnectionState('connected');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time notifications
  React.useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Randomly generate notifications
      if (Math.random() > 0.85) {
        const notificationTypes = [
          {
            type: 'ticket_created' as const,
            title: 'New Ticket Created',
            message: 'Ticket #1234 has been created by John Doe',
            priority: 'medium' as const,
            ticketId: '1234'
          },
          {
            type: 'ticket_updated' as const,
            title: 'Ticket Updated',
            message: 'Ticket #5678 status changed to Resolved',
            priority: 'low' as const,
            ticketId: '5678'
          },
          {
            type: 'escalation' as const,
            title: 'Ticket Escalated',
            message: 'Ticket #9999 has been escalated due to SLA breach',
            priority: 'urgent' as const,
            ticketId: '9999'
          },
          {
            type: 'ticket_assigned' as const,
            title: 'Ticket Assigned',
            message: 'Ticket #1111 has been assigned to you',
            priority: 'medium' as const,
            ticketId: '1111'
          }
        ];

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        addNotification(randomNotification);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  // Simulate live metrics updates
  React.useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeTickets: prev.activeTickets + Math.floor(Math.random() * 3) - 1,
        pendingTickets: Math.max(0, prev.pendingTickets + Math.floor(Math.random() * 3) - 1),
        avgResponseTime: (parseFloat(prev.avgResponseTime) + (Math.random() - 0.5) * 0.2).toFixed(1) + 'h',
        onlineAgents: Math.max(1, Math.min(5, prev.onlineAgents + Math.floor(Math.random() * 3) - 1)),
        lastUpdated: new Date(),
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  // Simulate user status changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev.map(user => {
        if (Math.random() > 0.9) {
          const statuses: OnlineUser['status'][] = ['online', 'away', 'busy'];
          const currentIndex = statuses.indexOf(user.status);
          const newStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...user, status: newStatus, lastSeen: new Date() };
        }
        return user;
      }));
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = React.useCallback((notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50 notifications

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg',
        tag: newNotification.id,
      });
    }
  }, []);

  const markAsRead = React.useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const updateUserStatus = React.useCallback((status: OnlineUser['status']) => {
    setCurrentUserStatus(status);
    // In a real app, this would send to the server
  }, []);

  const subscribeToTicket = React.useCallback((ticketId: string) => {
    subscribedTickets.add(ticketId);
    console.log(`Subscribed to ticket ${ticketId} for real-time updates`);
  }, [subscribedTickets]);

  const unsubscribeFromTicket = React.useCallback((ticketId: string) => {
    subscribedTickets.delete(ticketId);
    console.log(`Unsubscribed from ticket ${ticketId}`);
  }, [subscribedTickets]);

  const unreadCount = React.useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  const value: RealTimeContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    onlineUsers,
    currentUserStatus,
    updateUserStatus,
    liveMetrics,
    isConnected,
    connectionState,
    subscribeToTicket,
    unsubscribeFromTicket,
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
}

// Hook for requesting notification permission
export function useNotificationPermission() {
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}
