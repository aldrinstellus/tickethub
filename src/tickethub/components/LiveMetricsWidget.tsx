import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { styled, keyframes } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import SignalWifiIcon from '@mui/icons-material/SignalWifi';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import { useRealTime } from '../contexts/RealTimeContext';
import { motion } from 'framer-motion';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const LiveIndicator = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.success.main,
  '& .pulse-dot': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    animation: `${pulse} 2s infinite`,
  },
}));

const MetricCard = styled(Card)(({ theme }) => ({
  minHeight: 120,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const AnimatedNumber = ({ value, suffix = '' }: { value: number | string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
    }
  }, [value, displayValue]);

  return (
    <motion.div
      animate={{ 
        scale: isAnimating ? [1, 1.1, 1] : 1,
        color: isAnimating ? ['#1976d2', '#4caf50', '#1976d2'] : '#1976d2'
      }}
      transition={{ duration: 0.3 }}
    >
      <Typography 
        variant="h4" 
        component="div"
        sx={{ 
          fontWeight: 700,
          color: 'primary.main'
        }}
      >
        {displayValue}{suffix}
      </Typography>
    </motion.div>
  );
};

export default function LiveMetricsWidget() {
  const { liveMetrics, isConnected, connectionState } = useRealTime();
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  React.useEffect(() => {
    setLastUpdate(new Date());
  }, [liveMetrics]);

  const formatLastUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return lastUpdate.toLocaleTimeString();
    }
  };

  return (
    <Stack spacing={2}>
      {/* Header with connection status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Live Metrics
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          {isConnected ? (
            <LiveIndicator>
              <Box className="pulse-dot" />
              <Typography variant="caption" color="success.main">
                Live
              </Typography>
            </LiveIndicator>
          ) : (
            <Chip
              icon={<SignalWifiOffIcon />}
              label="Offline"
              size="small"
              color="error"
              variant="outlined"
            />
          )}
          
          <Tooltip title={`Last updated: ${formatLastUpdate()}`}>
            <IconButton size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Metrics Grid */}
      <Stack direction="row" spacing={2}>
        <MetricCard variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Active Tickets
              </Typography>
              <AnimatedNumber value={liveMetrics.activeTickets} />
              <Typography variant="caption" color="text.secondary">
                Currently open
              </Typography>
            </Stack>
          </CardContent>
        </MetricCard>

        <MetricCard variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Pending
              </Typography>
              <AnimatedNumber value={liveMetrics.pendingTickets} />
              <Typography variant="caption" color="text.secondary">
                Awaiting response
              </Typography>
            </Stack>
          </CardContent>
        </MetricCard>

        <MetricCard variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Avg Response
              </Typography>
              <AnimatedNumber value={liveMetrics.avgResponseTime} />
              <Typography variant="caption" color="text.secondary">
                Last 24 hours
              </Typography>
            </Stack>
          </CardContent>
        </MetricCard>

        <MetricCard variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Online Agents
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <AnimatedNumber value={liveMetrics.onlineAgents} />
                <Chip 
                  icon={<SignalWifiIcon />} 
                  label="online" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Available now
              </Typography>
            </Stack>
          </CardContent>
        </MetricCard>
      </Stack>

      {/* Connection status footer */}
      {connectionState !== 'connected' && (
        <Box 
          sx={{ 
            p: 1, 
            bgcolor: 'warning.light', 
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" color="warning.dark">
            {connectionState === 'connecting' 
              ? 'Connecting to real-time updates...' 
              : 'Connection lost - showing last known values'
            }
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
