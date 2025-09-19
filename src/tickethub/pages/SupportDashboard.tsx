import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import CrmStatCard from "../../crm/components/CrmStatCard";
import { useNavigate } from "react-router-dom";
import { fetchTickets } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import LiveMetricsWidget from "../components/LiveMetricsWidget";
import AIDashboardWidget from "../components/AIDashboardWidget";
import { getDummyAvatarUrl } from "../components/UserProfileDropdown";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function SupportDashboard() {
  const navigate = useNavigate();
  const [now, setNow] = React.useState(new Date());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const [ticketsData, setTicketsData] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      if (!mounted) return;

      setLoading(true);
      try {
        const data = await fetchTickets();

        if (!mounted) return;

        // Ensure data is always an array with valid tickets
        const validTickets = Array.isArray(data) ? data.filter(ticket =>
          ticket &&
          typeof ticket === 'object' &&
          ticket.id &&
          ticket.status &&
          ticket.priority &&
          ticket.subject
        ) : [];

        console.log(`Dashboard loaded with ${validTickets.length} valid tickets`);
        setTicketsData(validTickets);
      } catch (err) {
        console.error("Failed to load dashboard tickets:", err);
        if (mounted) {
          // Set empty array on error but don't break the UI
          setTicketsData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  // Key metrics
  const activeTickets = ticketsData.length;
  const resolved = ticketsData.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const resolutionRate = ticketsData.length ? Math.round((resolved / ticketsData.length) * 100) : 0;
  const csat = 94; // placeholder
  const avgResponse = "1.8h";

  // Recent tickets
  const recent = [...ticketsData].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 8);

  // AI insights: simple heuristics
  const escalateCandidates = ticketsData.filter((t) => t.priority === "Urgent" || (t.priority === "High" && t.status === "Open"));

  // Team status
  const workload: Record<string, number> = {};
  ticketsData.forEach((t) => {
    const who = t.assignee || "Unassigned";
    workload[who] = (workload[who] || 0) + 1;
  });

  // Stat cards data compatible with CrmStatCard
  const statCardsData = [
    {
      title: "Active Tickets",
      value: String(activeTickets),
      interval: "Last 24 hours",
      trend: "up",
      trendValue: "+8%",
      data: [12, 14, 13, 15, 18, 16, 17],
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate}%`,
      interval: "Last 30 days",
      trend: resolutionRate >= 85 ? "up" : "down",
      trendValue: resolutionRate >= 85 ? "+2%" : "-3%",
      data: [80, 82, 83, 85, 86, 87, resolutionRate],
    },
    {
      title: "Avg Response",
      value: avgResponse,
      interval: "Last 7 days",
      trend: "down",
      trendValue: "-12%",
      data: [2.2, 2.0, 1.9, 1.8, 1.7, 1.9, 1.8],
    },
    {
      title: "CSAT",
      value: `${csat}%`,
      interval: "Last 30 days",
      trend: "up",
      trendValue: "+2%",
      data: [92, 92, 93, 94, 94, 95, csat],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header - Full Width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, px: 1 }}>
            <PageHeader title="Dashboard" />
            <Chip
              label="All systems operational"
              color="success"
              size="small"
              icon={
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    marginRight: 1,
                    animation: 'subtlePulse 2s infinite',
                    '@keyframes subtlePulse': {
                      '0%': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                      '50%': {
                        opacity: 0.6,
                        transform: 'scale(1.1)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                    },
                  }}
                />
              }
            />
          </Stack>
        </motion.div>

        {/* Two Column Layout with Independent Scrolling */}
        <Box sx={{ display: "flex", flex: 1, gap: 3, overflow: "hidden", px: 1 }}>

          {/* LEFT COLUMN (62%) - Command Center */}
          <Box
            sx={{
              flex: "0 0 62%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                pr: 1,
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                '&::-webkit-scrollbar': {
                  display: 'none', // Chrome, Safari, Opera
                },
              }}
            >
              {/* Live Metrics Widget */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Box sx={{ mb: 3 }}>
                  <LiveMetricsWidget />
                </Box>
              </motion.div>

              {/* Business Overview Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                  Business Overview
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <CrmStatCard
                        title="Active Tickets"
                        value={String(activeTickets)}
                        interval="Last 24 hours"
                        trend="up"
                        trendValue="+8%"
                        data={[12, 14, 13, 15, 18, 16, 17]}
                      />
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <CrmStatCard
                        title="Resolution Rate"
                        value={`${resolutionRate}%`}
                        interval="Last 30 days"
                        trend={resolutionRate >= 85 ? "up" : "down"}
                        trendValue={resolutionRate >= 85 ? "+2%" : "-3%"}
                        data={[80, 82, 83, 85, 86, 87, resolutionRate]}
                      />
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <CrmStatCard
                        title="Avg Response Time"
                        value={avgResponse}
                        interval="Last 7 days"
                        trend="down"
                        trendValue="-12%"
                        data={[2.2, 2.0, 1.9, 1.8, 1.7, 1.9, 1.8]}
                      />
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <CrmStatCard
                        title="Customer Satisfaction"
                        value={`${csat}%`}
                        interval="Last 30 days"
                        trend="up"
                        trendValue="+2%"
                        data={[92, 92, 93, 94, 94, 95, csat]}
                      />
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>

              {/* Recent Tickets List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                  Current Activity
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6">Recent Tickets</Typography>
                      <Button variant="text" onClick={() => navigate('/tickets')}>View All Tickets</Button>
                    </Stack>

                    <List sx={{
                      maxHeight: 400,
                      overflow: 'auto',
                      scrollbarWidth: 'none', // Firefox
                      msOverflowStyle: 'none', // IE/Edge
                      '&::-webkit-scrollbar': {
                        display: 'none', // Chrome, Safari, Opera
                      },
                    }}>
                      {recent.map((t) => (
                        <React.Fragment key={t.id}>
                          <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate(`/tickets/${t.id}`)} sx={{ width: '100%' }}>
                              <Avatar
                                src={getDummyAvatarUrl(t.customer)}
                                alt={t.customer}
                                sx={{ width: 36, height: 36, mr: 2 }}
                              />
                              <ListItemText primary={`${t.id} — ${t.subject}`} secondary={`${t.customer} • ${timeAgo(t.updatedAt)} • ${t.assignee}`} />
                              <Chip label={t.priority} color={t.priority === 'Urgent' ? 'error' : t.priority === 'High' ? 'warning' : t.priority === 'Normal' ? 'default' : 'success'} size="small" />
                            </ListItemButton>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Box>

          {/* RIGHT COLUMN (38%) - Intelligence Hub */}
          <Box
            sx={{
              flex: "0 0 38%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                pl: 1,
                pr: 1,
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                '&::-webkit-scrollbar': {
                  display: 'none', // Chrome, Safari, Opera
                },
              }}
            >
              {/* AI Dashboard Widget */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Box sx={{ mb: 3 }}>
                  <AIDashboardWidget />
                </Box>
              </motion.div>

              {/* Team Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                  Team Intelligence
                </Typography>
                <Stack spacing={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Team Status</Typography>
                      <Box>
                        {Object.entries(workload).map(([user, count]) => (
                          <Stack key={user} direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                            <Avatar
                              src={getDummyAvatarUrl(user)}
                              alt={user}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>{user}</Typography>
                              <Typography variant="caption" color="text.secondary">{count} open tickets</Typography>
                            </Box>
                            <Chip
                              label={count}
                              size="small"
                              color={count > 3 ? "warning" : count > 1 ? "default" : "success"}
                            />
                          </Stack>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6">AI Insights</Typography>
                        <Button variant="text" color="primary" size="small">
                          View AI Recommendations
                        </Button>
                      </Stack>
                      <Stack spacing={2}>
                        {/* Escalation Predictions */}
                        <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1, border: '1px solid', borderColor: 'error.200' }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                              ⚠️ Escalation Risk
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500, mb: 1 }}>
                            {escalateCandidates.length} tickets likely to escalate
                          </Typography>
                          <Typography variant="caption" color="error.dark">
                            Predicted within next 2-4 hours based on response patterns
                          </Typography>
                          {escalateCandidates.length > 0 && (
                            <Button variant="outlined" size="small" color="error" sx={{ mt: 1 }}>
                              View High-Risk Tickets
                            </Button>
                          )}
                        </Box>

                        {/* Priority Suggestions */}
                        <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.200' }}>
                          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
                            📊 Priority Adjustments
                          </Typography>
                          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500, mb: 1 }}>
                            {escalateCandidates.length > 0 ? 3 : 0} priority changes suggested
                          </Typography>
                          <Typography variant="caption" color="warning.dark">
                            AI recommends increasing priority for tickets with urgent keywords
                          </Typography>
                          {escalateCandidates.length > 0 && (
                            <Button variant="outlined" size="small" color="warning" sx={{ mt: 1 }}>
                              Review Suggestions
                            </Button>
                          )}
                        </Box>

                        {/* Knowledge Gaps */}
                        <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
                          <Typography variant="body2" color="info.main" sx={{ fontWeight: 600, mb: 1 }}>
                            📚 Knowledge Gaps
                          </Typography>
                          <Typography variant="body2" color="info.main" sx={{ fontWeight: 500, mb: 1 }}>
                            4 knowledge gaps detected
                          </Typography>
                          <Typography variant="caption" color="info.dark">
                            Topics: API authentication, billing cycles, mobile app setup
                          </Typography>
                          <Button variant="outlined" size="small" color="info" sx={{ mt: 1 }}>
                            Create Articles
                          </Button>
                        </Box>

                        {/* AI Confidence Score */}
                        <Box sx={{ p: 1.5, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              🤖 AI Confidence
                            </Typography>
                            <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                              87%
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="success.dark">
                            High accuracy in current predictions
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Recent Team Activity */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Recent Team Activity</Typography>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Alex Thompson</Typography>
                          <Typography variant="caption" color="text.secondary">assigned TH-1042 to Priya Patel • 5m ago</Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Priya Patel</Typography>
                          <Typography variant="caption" color="text.secondary">responded to TH-1043 • 20m ago</Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Marcus Johnson</Typography>
                          <Typography variant="caption" color="text.secondary">closed TH-1038 • 12m ago</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
