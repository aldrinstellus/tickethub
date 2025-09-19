import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Ticket } from '../data/mockData';
import { aiAssistanceService, AIInsights } from '../services/aiAssistanceService';

const AICard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const SentimentCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'sentiment',
})<{ sentiment: string }>(({ theme, sentiment }) => {
  const getColors = () => {
    switch (sentiment) {
      case 'positive':
        return {
          background: theme.palette.success.light,
          border: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        };
      case 'negative':
        return {
          background: theme.palette.error.light,
          border: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        };
      default:
        return {
          background: theme.palette.info.light,
          border: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        };
    }
  };

  const colors = getColors();
  return {
    background: colors.background,
    border: `1px solid ${colors.border}`,
    '& .MuiTypography-root': {
      color: colors.color,
    },
    '& .MuiAccordionSummary-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };
});

const RiskCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'risk',
})<{ risk: string }>(({ theme, risk }) => {
  const getColors = () => {
    switch (risk) {
      case 'critical':
        return {
          background: theme.palette.error.light,
          border: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        };
      case 'high':
        return {
          background: theme.palette.warning.light,
          border: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        };
      case 'medium':
        return {
          background: theme.palette.info.light,
          border: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        };
      default:
        return {
          background: theme.palette.success.light,
          border: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        };
    }
  };

  const colors = getColors();
  return {
    background: colors.background,
    border: `1px solid ${colors.border}`,
    '& .MuiTypography-root': {
      color: colors.color,
    },
    '& .MuiAccordionSummary-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };
});

const ConfidenceBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
  },
}));

interface AIInsightsWidgetProps {
  ticket: Ticket;
  messages?: any[];
  articles?: any[];
  compact?: boolean;
}

export default function AIInsightsWidget({ 
  ticket, 
  messages = [], 
  articles = [], 
  compact = false 
}: AIInsightsWidgetProps) {
  const [insights, setInsights] = React.useState<AIInsights | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<string | false>('sentiment');

  React.useEffect(() => {
    async function generateInsights() {
      if (!ticket || !ticket.id) return;

      setLoading(true);
      setError(null);

      try {
        const aiInsights = await aiAssistanceService.generateInsights(ticket, messages, articles);
        setInsights(aiInsights);
      } catch (err) {
        console.error('Failed to generate AI insights:', err);
        setError('Failed to generate AI insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    generateInsights();
  }, [ticket?.id, ticket?.subject, ticket?.description, ticket?.status, ticket?.priority]);

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent, 
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <SentimentSatisfiedIcon color="success" />;
      case 'negative':
        return <SentimentDissatisfiedIcon color="error" />;
      default:
        return <SentimentNeutralIcon color="action" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'info';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  const getChipProps = (color: string, variant: 'filled' | 'outlined' = 'filled') => ({
    size: 'small' as const,
    variant,
    sx: {
      color: 'white',
      fontWeight: 600,
      '& .MuiChip-label': {
        color: 'inherit',
      },
    },
  });

  if (loading) {
    return (
      <AICard>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <PsychologyIcon color="primary" />
            <Typography variant="h6">AI Insights</Typography>
          </Stack>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
          </Stack>
        </CardContent>
      </AICard>
    );
  }

  if (error) {
    return (
      <AICard>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </AICard>
    );
  }

  if (!insights) return null;

  if (compact) {
    return (
      <AICard>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <SmartToyIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              AI Analysis
            </Typography>
          </Stack>
          
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              {getSentimentIcon(insights.sentiment.label)}
              <Typography variant="caption">
                {insights.sentiment.label} sentiment
              </Typography>
              <Chip 
                label={insights.escalationRisk.risk} 
                size="small" 
                color={getRiskColor(insights.escalationRisk.risk)} 
              />
            </Stack>
            
            {insights.prioritySuggestion.shouldChange && (
              <Alert severity="info" sx={{ py: 0.5 }}>
                <Typography variant="caption">
                  Suggested priority: {insights.prioritySuggestion.suggestedPriority}
                </Typography>
              </Alert>
            )}
          </Stack>
        </CardContent>
      </AICard>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Header */}
      <AICard>
        <CardContent sx={{ pb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PsychologyIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              AI Insights
            </Typography>
            <Chip
              label={aiAssistanceService.getProviderInfo().name}
              size="small"
              variant="outlined"
              sx={{ color: 'text.primary' }}
            />
          </Stack>
        </CardContent>
      </AICard>

      {/* Sentiment Analysis */}
      <SentimentCard sentiment={insights.sentiment.label}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            {getSentimentIcon(insights.sentiment.label)}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'inherit' }}>
              Sentiment Analysis
            </Typography>
            <Chip
              label={insights.sentiment.label}
              {...getChipProps(getSentimentColor(insights.sentiment.label))}
              color={getSentimentColor(insights.sentiment.label)}
            />
          </Stack>

          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8 }}>
                Confidence: {Math.round(insights.sentiment.confidence * 100)}%
              </Typography>
              <ConfidenceBar
                variant="determinate"
                value={insights.sentiment.confidence * 100}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                  },
                }}
              />
            </Box>

            {insights.sentiment.keywords.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, display: 'block', mb: 1 }}>
                  Key indicators:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {insights.sentiment.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: 'inherit',
                        borderColor: 'currentColor',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </SentimentCard>

      {/* Category Suggestions */}
      <AICard>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CategoryIcon color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Category Suggestions
            </Typography>
            <Chip
              label={insights.categoryData[0]?.category || 'General'}
              size="small"
              color="primary"
              sx={{ color: 'white', fontWeight: 600 }}
            />
          </Stack>

          <Stack spacing={2}>
            {insights.categoryData.slice(0, 3).map((category, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{category.category}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(category.confidence * 100)}%
                  </Typography>
                </Stack>
                <ConfidenceBar
                  variant="determinate"
                  value={category.confidence * 100}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {category.reasoning}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </AICard>

      {/* Escalation Risk */}
      <RiskCard risk={insights.escalationRisk.risk}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <TrendingUpIcon sx={{ color: 'inherit' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'inherit' }}>
              Escalation Risk
            </Typography>
            <Chip
              label={insights.escalationRisk.risk}
              {...getChipProps(getRiskColor(insights.escalationRisk.risk))}
              color={getRiskColor(insights.escalationRisk.risk)}
            />
          </Stack>

          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8 }}>
                Risk probability: {Math.round(insights.escalationRisk.probability * 100)}%
              </Typography>
              <ConfidenceBar
                variant="determinate"
                value={insights.escalationRisk.probability * 100}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                  },
                }}
              />
            </Box>

            {insights.escalationRisk.factors.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, display: 'block', mb: 1 }}>
                  Risk factors:
                </Typography>
                <Stack spacing={0.5}>
                  {insights.escalationRisk.factors.map((factor, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem', color: 'inherit' }}>
                      • {factor}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {insights.escalationRisk.suggestedActions.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, display: 'block', mb: 1 }}>
                  Suggested actions:
                </Typography>
                <Stack spacing={0.5}>
                  {insights.escalationRisk.suggestedActions.map((action, index) => (
                    <Alert
                      key={index}
                      severity="info"
                      sx={{
                        py: 0.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '& .MuiAlert-message': {
                          color: 'inherit',
                        },
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'inherit' }}>{action}</Typography>
                    </Alert>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </RiskCard>

      {/* Priority Suggestion */}
      {insights.prioritySuggestion.shouldChange && (
        <Card sx={{ backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PriorityHighIcon sx={{ color: '#e65100' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e65100' }}>
                Priority Adjustment
              </Typography>
              <Chip
                label={`→ ${insights.prioritySuggestion.suggestedPriority}`}
                size="small"
                sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 600 }}
              />
            </Stack>

            <Stack spacing={2}>
              <Alert
                severity="warning"
                sx={{
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  '& .MuiAlert-message': {
                    color: '#e65100',
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
                  Current: {insights.prioritySuggestion.currentPriority} →
                  Suggested: {insights.prioritySuggestion.suggestedPriority}
                </Typography>
              </Alert>

              <Box>
                <Typography variant="caption" sx={{ color: '#bf360c' }}>
                  AI Confidence: {Math.round(insights.prioritySuggestion.confidence * 100)}%
                </Typography>
                <ConfidenceBar
                  variant="determinate"
                  value={insights.prioritySuggestion.confidence * 100}
                  sx={{
                    backgroundColor: 'rgba(255, 152, 0, 0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#ff9800',
                    },
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#bf360c' }}>
                {insights.prioritySuggestion.reasoning}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Suggested Actions */}
      {insights.suggestedActions.length > 0 && (
        <AICard>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Recommended Actions
            </Typography>
            <Stack spacing={1}>
              {insights.suggestedActions.map((action, index) => (
                <Alert
                  key={index}
                  severity="info"
                  sx={{
                    py: 0.5,
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    '& .MuiAlert-message': {
                      color: '#0d47a1',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#0d47a1', fontWeight: 500 }}>{action}</Typography>
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </AICard>
      )}
    </Stack>
  );
}
