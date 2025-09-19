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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CrmStatCard from "../../crm/components/CrmStatCard";
import { useNavigate } from "react-router-dom";
import { fetchTickets } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

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
    setLoading(true);
    fetchTickets()
      .then((data) => {
        if (!mounted) return;
        setTicketsData(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
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
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Dashboard</Typography>
          <Typography variant="caption" color="text.secondary">Home &gt; Dashboard</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">{now.toLocaleString()}</Typography>
          <Chip label="All systems operational" color="success" size="small" />
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => window.dispatchEvent(new CustomEvent('open-quick-create'))}>New Ticket</Button>
        </Stack>
      </Stack>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCardsData.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <CrmStatCard
              title={card.title}
              value={card.value}
              interval={card.interval}
              trend={card.trend as "up" | "down"}
              trendValue={card.trendValue}
              data={card.data as number[]}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main content */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
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

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Team Activity</Typography>
                <Typography variant="body2" color="text.secondary">Recent actions by team members (mock)</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Alex Thompson assigned TH-1042 to Priya Patel" secondary="5m ago" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Priya Patel responded to TH-1043" secondary="20m ago" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">AI Insights</Typography>
                  <Button variant="text">View AI Recommendations</Button>
                </Stack>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Tickets likely to escalate: <strong>{escalateCandidates.length}</strong></Typography>
                  <Typography variant="body2">Suggested priority changes: <strong>{escalateCandidates.length > 0 ? 2 : 0}</strong></Typography>
                  <Typography variant="body2">Knowledge gaps detected: <strong>3</strong></Typography>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Team Status</Typography>
                <Box sx={{ mt: 1 }}>
                  {Object.entries(workload).map(([user, count]) => (
                    <Stack key={user} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Avatar sx={{ width: 28, height: 28 }}>{user.split(' ').map(s=>s[0]).slice(0,2).join('')}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">{user}</Typography>
                        <Typography variant="caption" color="text.secondary">{count} open tickets</Typography>
                      </Box>
                      <Chip label={count} size="small" />
                    </Stack>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
