import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion } from 'framer-motion';
import { aiAssistanceService } from '../services/aiAssistanceService';

const AICard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}08, ${theme.palette.secondary.light}05)`,
  border: `1px solid ${theme.palette.primary.light}30`,
}));

const MetricCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

interface AIStats {
  totalAnalyzed: number;
  avgResponseTime: string;
  accuracyScore: number;
  automationRate: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categoryStats: {
    name: string;
    count: number;
    percentage: number;
  }[];
  escalationPrevented: number;
  providerStatus: string;
}

export default function AIDashboardWidget() {
  const [stats, setStats] = React.useState<AIStats>({
    totalAnalyzed: 1247,
    avgResponseTime: '0.8s',
    accuracyScore: 94,
    automationRate: 78,
    sentimentBreakdown: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
    categoryStats: [
      { name: 'Technical Support', count: 450, percentage: 36 },
      { name: 'Billing', count: 312, percentage: 25 },
      { name: 'Account', count: 235, percentage: 19 },
      { name: 'Feature Request', count: 150, percentage: 12 },
      { name: 'General', count: 100, percentage: 8 },
    ],
    escalationPrevented: 23,
    providerStatus: 'Connected',
  });

  const [providerInfo, setProviderInfo] = React.useState<any>(null);

  React.useEffect(() => {
    // Get AI provider information
    const info = aiAssistanceService.getProviderInfo();
    setProviderInfo(info);

    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAnalyzed: prev.totalAnalyzed + Math.floor(Math.random() * 3),
        accuracyScore: Math.min(99, prev.accuracyScore + (Math.random() - 0.5) * 2),
        automationRate: Math.min(95, prev.automationRate + (Math.random() - 0.5) * 3),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <AICard>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PsychologyIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Assistant Dashboard
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              icon={<AutoAwesomeIcon />}
              label={providerInfo?.name || 'AI Provider'} 
              size="small" 
              color="primary"
              variant="outlined"
            />
            <Tooltip title="AI Settings">
              <IconButton size="small">
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Key Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MetricCard>
                <AnalyticsIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stats.totalAnalyzed.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tickets Analyzed
                </Typography>
              </MetricCard>
            </motion.div>
          </Grid>

          <Grid item xs={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MetricCard>
                <SpeedIcon color="success" sx={{ mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.avgResponseTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Response Time
                </Typography>
              </MetricCard>
            </motion.div>
          </Grid>

          <Grid item xs={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MetricCard>
                <TrendingUpIcon color="warning" sx={{ mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.accuracyScore}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AI Accuracy
                </Typography>
              </MetricCard>
            </motion.div>
          </Grid>

          <Grid item xs={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MetricCard>
                <AutoAwesomeIcon color="secondary" sx={{ mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {stats.automationRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Automation Rate
                </Typography>
              </MetricCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Sentiment Analysis Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Sentiment Analysis (Last 7 Days)
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.sentimentBreakdown).map(([sentiment, percentage]) => (
              <Grid item xs={4} key={sentiment}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {sentiment}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {percentage}%
                    </Typography>
                  </Stack>
                  <ProgressBar 
                    variant="determinate" 
                    value={percentage}
                    color={getSentimentColor(sentiment)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Category Distribution */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Auto-Categorization Results
          </Typography>
          <Stack spacing={1}>
            {stats.categoryStats.slice(0, 3).map((category) => (
              <Box key={category.name}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {category.count}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {category.percentage}%
                    </Typography>
                  </Stack>
                </Stack>
                <ProgressBar 
                  variant="determinate" 
                  value={category.percentage}
                  color="primary"
                />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* AI Capabilities */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Active AI Features
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {providerInfo?.capabilities?.map((capability: string, index: number) => (
              <Chip
                key={index}
                label={capability}
                size="small"
                variant="outlined"
                color="primary"
              />
            )) || [
              'Sentiment Analysis',
              'Auto-categorization',
              'Escalation Prediction',
              'Priority Suggestions',
              'Smart Responses'
            ].map((capability, index) => (
              <Chip
                key={index}
                label={capability}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Stack>
        </Box>

        {/* Achievement */}
        {stats.escalationPrevented > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
              🎯 AI prevented {stats.escalationPrevented} potential escalations this week!
            </Typography>
          </Box>
        )}
      </CardContent>
    </AICard>
  );
}
