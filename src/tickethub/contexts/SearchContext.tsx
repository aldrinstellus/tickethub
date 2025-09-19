import * as React from "react";

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const openSearch = React.useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = React.useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = React.useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  // Global keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleSearch();
      }
      
      // Escape to close
      if (event.key === 'Escape' && isSearchOpen) {
        event.preventDefault();
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearch, closeSearch]);

  const value = React.useMemo(() => ({
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  }), [isSearchOpen, openSearch, closeSearch, toggleSearch]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
