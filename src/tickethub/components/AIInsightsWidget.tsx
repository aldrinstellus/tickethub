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
      if (!ticket) return;
      
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
  }, [ticket, messages, articles]);

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
        return 'default';
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
    <AICard>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <PsychologyIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Insights
          </Typography>
          <Chip 
            label={aiAssistanceService.getProviderInfo().name} 
            size="small" 
            variant="outlined" 
          />
        </Stack>

        {/* Sentiment Analysis */}
        <Accordion 
          expanded={expanded === 'sentiment'} 
          onChange={handleAccordionChange('sentiment')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} alignItems="center">
              {getSentimentIcon(insights.sentiment.label)}
              <Typography variant="subtitle2">Sentiment Analysis</Typography>
              <Chip 
                label={insights.sentiment.label} 
                size="small" 
                color={getSentimentColor(insights.sentiment.label)} 
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Confidence: {Math.round(insights.sentiment.confidence * 100)}%
                </Typography>
                <ConfidenceBar 
                  variant="determinate" 
                  value={insights.sentiment.confidence * 100}
                  color={getSentimentColor(insights.sentiment.label)}
                />
              </Box>
              
              {insights.sentiment.keywords.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Key indicators:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {insights.sentiment.keywords.map((keyword, index) => (
                      <Chip 
                        key={index} 
                        label={keyword} 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Category Suggestions */}
        <Accordion 
          expanded={expanded === 'category'} 
          onChange={handleAccordionChange('category')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryIcon color="primary" />
              <Typography variant="subtitle2">Category Suggestions</Typography>
              <Chip 
                label={insights.categoryData[0]?.category || 'General'} 
                size="small" 
                variant="outlined" 
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {insights.categoryData.slice(0, 3).map((category, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{category.category}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(category.confidence * 100)}%
                    </Typography>
                  </Stack>
                  <ConfidenceBar 
                    variant="determinate" 
                    value={category.confidence * 100}
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {category.reasoning}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Escalation Risk */}
        <Accordion 
          expanded={expanded === 'escalation'} 
          onChange={handleAccordionChange('escalation')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon color="warning" />
              <Typography variant="subtitle2">Escalation Risk</Typography>
              <Chip 
                label={insights.escalationRisk.risk} 
                size="small" 
                color={getRiskColor(insights.escalationRisk.risk)} 
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Risk probability: {Math.round(insights.escalationRisk.probability * 100)}%
                </Typography>
                <ConfidenceBar 
                  variant="determinate" 
                  value={insights.escalationRisk.probability * 100}
                  color={getRiskColor(insights.escalationRisk.risk)}
                />
              </Box>
              
              {insights.escalationRisk.factors.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Risk factors:
                  </Typography>
                  <Stack spacing={0.5}>
                    {insights.escalationRisk.factors.map((factor, index) => (
                      <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem' }}>
                        • {factor}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
              
              {insights.escalationRisk.suggestedActions.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Suggested actions:
                  </Typography>
                  <Stack spacing={0.5}>
                    {insights.escalationRisk.suggestedActions.map((action, index) => (
                      <Alert key={index} severity="info" sx={{ py: 0.5 }}>
                        <Typography variant="caption">{action}</Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Priority Suggestion */}
        {insights.prioritySuggestion.shouldChange && (
          <Accordion 
            expanded={expanded === 'priority'} 
            onChange={handleAccordionChange('priority')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PriorityHighIcon color="warning" />
                <Typography variant="subtitle2">Priority Adjustment</Typography>
                <Chip 
                  label={`→ ${insights.prioritySuggestion.suggestedPriority}`} 
                  size="small" 
                  color="warning"
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Alert severity="warning">
                  <Typography variant="body2">
                    Current: {insights.prioritySuggestion.currentPriority} → 
                    Suggested: {insights.prioritySuggestion.suggestedPriority}
                  </Typography>
                </Alert>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    AI Confidence: {Math.round(insights.prioritySuggestion.confidence * 100)}%
                  </Typography>
                  <ConfidenceBar 
                    variant="determinate" 
                    value={insights.prioritySuggestion.confidence * 100}
                    color="warning"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {insights.prioritySuggestion.reasoning}
                </Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Suggested Actions */}
        {insights.suggestedActions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recommended Actions
            </Typography>
            <Stack spacing={1}>
              {insights.suggestedActions.map((action, index) => (
                <Alert key={index} severity="info" sx={{ py: 0.5 }}>
                  <Typography variant="body2">{action}</Typography>
                </Alert>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </AICard>
  );
}
