import React from 'react';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAIChat } from '../contexts/AIChatContext';

export default function AIChatFAB() {
  const { openChat, messages, isTyping } = useAIChat();

  // Count unread messages (messages after user's last message)
  const unreadCount = React.useMemo(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    const lastUserMessageIndex = messages.findLastIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex === -1) return 0;
    
    const messagesAfterLastUser = messages.slice(lastUserMessageIndex + 1);
    return messagesAfterLastUser.filter(m => m.role === 'assistant').length;
  }, [messages]);

  const handleClick = () => {
    openChat();
  };

  return (
    <Tooltip title="AI Assistant" placement="left" arrow>
      <Badge 
        badgeContent={unreadCount} 
        color="secondary"
        variant="dot"
        invisible={unreadCount === 0 && !isTyping}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: isTyping ? '#ff9800' : undefined,
            animation: isTyping ? 'pulse 1.5s infinite' : undefined,
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: 0.7,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      >
        <Fab
          color="primary"
          aria-label="AI Assistant"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 100, // Above the QuickCreate FAB
            right: 24,
            zIndex: 1401, // Above QuickCreate FAB (1400)
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: (theme) => theme.shadows[6],
          }}
        >
          <AutoAwesomeIcon 
            sx={{ 
              fontSize: 24,
              color: 'white',
              filter: isTyping ? 'brightness(1.3)' : undefined,
              animation: isTyping ? 'sparkle 2s infinite' : undefined,
              '@keyframes sparkle': {
                '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                '25%': { transform: 'rotate(90deg) scale(1.1)' },
                '50%': { transform: 'rotate(180deg) scale(1)' },
                '75%': { transform: 'rotate(270deg) scale(1.1)' },
              },
            }} 
          />
        </Fab>
      </Badge>
    </Tooltip>
  );
}
