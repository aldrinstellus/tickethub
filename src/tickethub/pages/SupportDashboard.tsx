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
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <PageHeader title="Dashboard" />
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">{now.toLocaleString()}</Typography>
              <Chip label="All systems operational" color="success" size="small" />
            </Stack>
          </Stack>
        </motion.div>

        {/* Main Dashboard Layout */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Left Column - Business Metrics & Activity */}
          <Grid item xs={12} lg={8}>
            {/* Primary Business Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                Business Overview
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Active Tickets - Most Important */}
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
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

                {/* Resolution Rate */}
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
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
              </Grid>
            </motion.div>
          </Grid>

          {/* Right Column - Team Performance & Intelligence */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                Team Performance
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Average Response Time */}
                <Grid item xs={12}>
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

                {/* Customer Satisfaction */}
                <Grid item xs={12}>
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
          </Grid>
        </Grid>

        {/* Secondary Content Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Grid container spacing={3}>
            {/* Left Column - Current Activity */}
            <Grid item xs={12} lg={8}>
              <Typography variant="h6" sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
                Current Activity
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">Recent Tickets</Typography>
                    <Button variant="text" onClick={() => navigate('/tickets')}>View All Tickets</Button>
                  </Stack>

                  <List>
                    {recent.map((t) => (
                      <React.Fragment key={t.id}>
                        <ListItem disablePadding>
                          <ListItemButton onClick={() => navigate(`/tickets/${t.id}`)} sx={{ width: '100%' }}>
                            <Avatar sx={{ width: 36, height: 36, mr: 2 }}>{t.customer.split(' ').map(s=>s[0]).slice(0,2).join('')}</Avatar>
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
            </Grid>

            {/* Right Column - Team Intelligence */}
            <Grid item xs={12} lg={4}>
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
                          <Avatar sx={{ width: 32, height: 32 }}>{user.split(' ').map(s=>s[0]).slice(0,2).join('')}</Avatar>
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

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6">AI Insights</Typography>
                      <Button variant="text">View All</Button>
                    </Stack>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                          ⚠️ {escalateCandidates.length} tickets likely to escalate
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                          📊 {escalateCandidates.length > 0 ? 2 : 0} priority changes suggested
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 500 }}>
                          📚 3 knowledge gaps detected
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

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
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </motion.div>
  );
}
