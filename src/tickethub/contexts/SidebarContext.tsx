import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarState = 'expanded' | 'collapsed' | 'hidden';

interface SidebarContextType {
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  isExpanded: boolean;
  isCollapsed: boolean;
  isHidden: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>('expanded');

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('tickethub_sidebar_state') as SidebarState;
    if (savedState && ['expanded', 'collapsed', 'hidden'].includes(savedState)) {
      setSidebarState(savedState);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tickethub_sidebar_state', sidebarState);
  }, [sidebarState]);

  const toggleSidebar = () => {
    setSidebarState(prev => {
      switch (prev) {
        case 'expanded':
          return 'collapsed';
        case 'collapsed':
          return 'expanded';
        case 'hidden':
          return 'expanded';
        default:
          return 'expanded';
      }
    });
  };

  const value = {
    sidebarState,
    setSidebarState,
    toggleSidebar,
    isExpanded: sidebarState === 'expanded',
    isCollapsed: sidebarState === 'collapsed',
    isHidden: sidebarState === 'hidden',
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
