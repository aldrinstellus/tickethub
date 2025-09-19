import * as React from "react";

interface TicketCreationContextType {
  isNewTicketModalOpen: boolean;
  openNewTicketModal: () => void;
  closeNewTicketModal: () => void;
}

const TicketCreationContext = React.createContext<TicketCreationContextType | undefined>(undefined);

export function TicketCreationProvider({ children }: { children: React.ReactNode }) {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = React.useState(false);

  const openNewTicketModal = React.useCallback(() => {
    setIsNewTicketModalOpen(true);
  }, []);

  const closeNewTicketModal = React.useCallback(() => {
    setIsNewTicketModalOpen(false);
  }, []);

  // Global event listener for the custom event
  React.useEffect(() => {
    const handler = () => {
      openNewTicketModal();
    };
    
    window.addEventListener("open-quick-create", handler as EventListener);
    return () => window.removeEventListener("open-quick-create", handler as EventListener);
  }, [openNewTicketModal]);

  const value = React.useMemo(() => ({
    isNewTicketModalOpen,
    openNewTicketModal,
    closeNewTicketModal,
  }), [isNewTicketModalOpen, openNewTicketModal, closeNewTicketModal]);

  return (
    <TicketCreationContext.Provider value={value}>
      {children}
    </TicketCreationContext.Provider>
  );
}

export function useTicketCreation() {
  const context = React.useContext(TicketCreationContext);
  if (context === undefined) {
    throw new Error('useTicketCreation must be used within a TicketCreationProvider');
  }
  return context;
}
