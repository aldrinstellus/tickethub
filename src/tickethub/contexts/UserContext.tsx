import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'agent' | 'admin' | 'customer';
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Aldrin Stellus',
    email: 'aldrin@tickethub.ai',
    avatar: '/static/images/avatar/1.jpg',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'Alex Thompson',
    email: 'alex@tickethub.ai',
    avatar: '/static/images/avatar/2.jpg',
    role: 'agent',
  },
  {
    id: 'user-3',
    name: 'Priya Patel',
    email: 'priya@tickethub.ai',
    avatar: '/static/images/avatar/3.jpg',
    role: 'agent',
  },
  {
    id: 'user-4',
    name: 'Marcus Johnson',
    email: 'marcus@tickethub.ai',
    avatar: '/static/images/avatar/4.jpg',
    role: 'agent',
  },
  {
    id: 'user-5',
    name: 'Sarah Chen',
    email: 'sarah@tickethub.ai',
    avatar: '/static/images/avatar/5.jpg',
    role: 'agent',
  },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('tickethub_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('tickethub_user');
      }
    } else {
      // Auto-login as Aldrin for demo purposes
      const defaultUser = mockUsers[0];
      setUser(defaultUser);
      localStorage.setItem('tickethub_user', JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('tickethub_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tickethub_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
