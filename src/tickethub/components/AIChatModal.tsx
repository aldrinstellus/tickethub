import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  Avatar,
  Fade,
  Divider,
  Button,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import ClearIcon from '@mui/icons-material/Clear';
import { useAIChat } from '../contexts/AIChatContext';
import { enhancedBackdropStyles } from '../../shared-theme/modalStyles';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const MessagesArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.divider,
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser 
    ? theme.palette.primary.main 
    : theme.palette.background.paper,
  color: isUser 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  borderBottomRightRadius: isUser ? theme.spacing(0.5) : theme.spacing(2),
  borderBottomLeftRadius: isUser ? theme.spacing(2) : theme.spacing(0.5),
  wordBreak: 'break-word',
  '& pre': {
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
  },
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const ContextChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  maxWidth: '80%',
  alignSelf: 'flex-start',
  color: theme.palette.text.secondary,
}));

export default function AIChatModal() {
  const { 
    isOpen, 
    messages, 
    isTyping, 
    context, 
    closeChat, 
    sendMessage, 
    clearHistory 
  } = useAIChat();

  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const message = inputValue.trim();
    setInputValue('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting for **bold** text
    return content
      .split('**')
      .map((part, index) => 
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      );
  };

  const quickActions = [
    'Help me create a ticket',
    'Show me open tickets',
    'Find knowledge base articles',
    'How do I...?',
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={closeChat}
      maxWidth="md"
      fullWidth
      sx={{
        ...enhancedBackdropStyles,
        '& .MuiDialog-paper': {
          height: '80vh',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoAwesomeIcon />
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            AI Assistant
          </Typography>
          <ContextChip 
            label={context.currentPage} 
            size="small"
            icon={<PersonIcon fontSize="small" />}
          />
          <Tooltip title="Clear chat history">
            <IconButton 
              size="small" 
              onClick={clearHistory}
              sx={{ color: 'white' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={closeChat}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatContainer>
          <MessagesArea>
            {messages.length === 0 && (
              <Fade in timeout={500}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Welcome to AI Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    I can help you with tickets, knowledge base, and navigation
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                    {quickActions.map((action, index) => (
                      <Chip
                        key={index}
                        label={action}
                        variant="outlined"
                        size="small"
                        onClick={() => setInputValue(action)}
                        sx={{ cursor: 'pointer', mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Fade>
            )}

            {messages.map((message, index) => (
              <Fade in timeout={300} key={message.id}>
                <Box>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="flex-start"
                    justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    {message.role === 'assistant' && (
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                        <AutoAwesomeIcon fontSize="small" />
                      </Avatar>
                    )}
                    
                    <Box sx={{ maxWidth: '80%' }}>
                      <MessageBubble isUser={message.role === 'user'}>
                        <Typography variant="body2">
                          {formatMessageContent(message.content)}
                        </Typography>
                      </MessageBubble>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block', 
                          mt: 0.5,
                          textAlign: message.role === 'user' ? 'right' : 'left',
                          ml: message.role === 'assistant' ? 4.5 : 0,
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>

                    {message.role === 'user' && (
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.500' }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Stack>
                </Box>
              </Fade>
            ))}

            {isTyping && (
              <Fade in>
                <TypingIndicator>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                    <AutoAwesomeIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2">AI is typing</Typography>
                  <CircularProgress size={16} thickness={6} />
                </TypingIndicator>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </MessagesArea>

          <InputArea>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={3}
                placeholder="Ask me anything about TicketHub..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </InputArea>
        </ChatContainer>
      </DialogContent>
    </Dialog>
  );
}
