import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TemplateIcon from '@mui/icons-material/Description';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Ticket } from '../data/mockData';
import { aiAssistanceService, SmartResponse } from '../services/aiAssistanceService';

const ResponseCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const ConfidenceIndicator = styled(Box)(({ theme }) => ({
  width: 4,
  height: '100%',
  borderRadius: 2,
  transition: 'all 0.2s ease',
}));

interface AIResponseSuggestionsProps {
  ticket: Ticket;
  messages?: any[];
  articles?: any[];
  onResponseSelect?: (response: string) => void;
  onResponseEdit?: (response: string) => void;
}

export default function AIResponseSuggestions({
  ticket,
  messages = [],
  articles = [],
  onResponseSelect,
  onResponseEdit
}: AIResponseSuggestionsProps) {
  const [responses, setResponses] = React.useState<SmartResponse[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ [key: number]: 'up' | 'down' | null }>({});

  const generateResponses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const smartResponses = await aiAssistanceService.generateSmartResponse(
        ticket,
        messages,
        articles
      );
      setResponses(smartResponses);
    } catch (err) {
      console.error('Failed to generate response suggestions:', err);
      setError('Failed to generate response suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (ticket) {
      generateResponses();
    }
  }, [ticket, messages, articles]);

  const handleCopyResponse = async (response: string) => {
    try {
      await navigator.clipboard.writeText(response);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  const handleResponseClick = (response: SmartResponse) => {
    if (onResponseSelect) {
      onResponseSelect(response.text);
    }
  };

  const handleEditResponse = (response: SmartResponse) => {
    if (onResponseEdit) {
      onResponseEdit(response.text);
    }
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [index]: prev[index] === type ? null : type
    }));
    
    // In a real app, this would send feedback to improve the AI
    console.log('Response feedback:', { index, type, response: responses[index] });
  };

  const getTypeIcon = (type: SmartResponse['type']) => {
    switch (type) {
      case 'generated':
        return <SmartToyIcon fontSize="small" color="primary" />;
      case 'template':
        return <TemplateIcon fontSize="small" color="secondary" />;
      case 'knowledge_base':
        return <AutoFixHighIcon fontSize="small" color="success" />;
      default:
        return <AutoAwesomeIcon fontSize="small" />;
    }
  };

  const getTypeLabel = (type: SmartResponse['type']) => {
    switch (type) {
      case 'generated':
        return 'AI Generated';
      case 'template':
        return 'Template';
      case 'knowledge_base':
        return 'Knowledge Base';
      default:
        return 'Smart Reply';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4caf50'; // green
    if (confidence >= 0.6) return '#ff9800'; // orange
    return '#f44336'; // red
  };

  if (loading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6">AI Response Suggestions</Typography>
          </Stack>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            onClick={generateResponses} 
            startIcon={<RefreshIcon />}
            variant="outlined"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Response Suggestions
            </Typography>
            <Chip 
              label={`${responses.length} suggestions`} 
              size="small" 
              variant="outlined" 
            />
          </Stack>
          
          <Button
            size="small"
            onClick={generateResponses}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {responses.length === 0 ? (
          <Alert severity="info">
            No response suggestions available. Try providing more context or check your AI service configuration.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {responses.map((response, index) => (
              <ResponseCard
                key={index}
                variant="outlined"
                onClick={() => handleResponseClick(response)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <ConfidenceIndicator
                      sx={{ 
                        backgroundColor: getConfidenceColor(response.confidence),
                        opacity: 0.8 
                      }}
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                      {/* Header */}
                      <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        sx={{ mb: 1 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {getTypeIcon(response.type)}
                          <Typography variant="caption" color="text.secondary">
                            {getTypeLabel(response.type)}
                          </Typography>
                          <Chip
                            label={`${Math.round(response.confidence * 100)}% confidence`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              color: getConfidenceColor(response.confidence),
                              borderColor: getConfidenceColor(response.confidence)
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Copy response">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyResponse(response.text);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit response">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditResponse(response);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>

                      {/* Response Text */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1, 
                          lineHeight: 1.5,
                          color: 'text.primary'
                        }}
                      >
                        {response.text}
                      </Typography>

                      {/* Sources */}
                      {response.sources && response.sources.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Sources:
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {response.sources.slice(0, 3).map((source, sourceIndex) => (
                              <Chip
                                key={sourceIndex}
                                label={source}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 18 }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Feedback */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Helpful?
                        </Typography>
                        
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeedback(index, 'up');
                          }}
                          sx={{ 
                            color: feedback[index] === 'up' ? 'success.main' : 'text.secondary',
                            '&:hover': { color: 'success.main' }
                          }}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeedback(index, 'down');
                          }}
                          sx={{ 
                            color: feedback[index] === 'down' ? 'error.main' : 'text.secondary',
                            '&:hover': { color: 'error.main' }
                          }}
                        >
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </ResponseCard>
            ))}
          </Stack>
        )}

        {/* Tips */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            💡 Click on any suggestion to use it as your response. 
            You can edit suggestions before sending to add your personal touch.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
