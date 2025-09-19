import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Copyright from "../../dashboard/internals/components/Copyright";
import CrmStatCard from "../../crm/components/CrmStatCard";
import ReactECharts from "echarts-for-react";

const statCardsData = [
  {
    title: "Open Tickets",
    value: "124",
    interval: "Last 7 days",
    trend: "up",
    trendValue: "+8%",
    data: [18, 20, 19, 15, 16, 17, 19],
  },
  {
    title: "Avg First Response",
    value: "1.8h",
    interval: "Last 7 days",
    trend: "down",
    trendValue: "-12%",
    data: [2.2, 2.0, 1.9, 1.8, 1.7, 1.9, 1.8],
  },
  {
    title: "CSAT",
    value: "94%",
    interval: "Last 30 days",
    trend: "up",
    trendValue: "+2%",
    data: [92, 92, 93, 94, 94, 95, 94],
  },
  {
    title: "Backlog",
    value: "37",
    interval: "Open > 7 days",
    trend: "down",
    trendValue: "-5%",
    data: [40, 39, 38, 38, 37, 36, 37],
  },
] as const;

export default function SupportDashboard() {
  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 0 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}>
        <Typography variant="h5" component="h2">
          Support Overview
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} sx={{ mr: 1 }} onClick={() => window.dispatchEvent(new CustomEvent('open-quick-create'))}>
            New Ticket
          </Button>
          <Button variant="outlined" startIcon={<AddRoundedIcon />}>New Macro</Button>
        </Box>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCardsData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} lg={3}>
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tickets by Priority (7 days)
            </Typography>
            <ReactECharts option={{
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: ['Urgent','High','Normal','Low'] },
              yAxis: { type: 'value' },
              series: [{ data: [22,46,38,18], type: 'bar', itemStyle: { color: '#1976d2' } }],
              toolbox: { feature: { saveAsImage: {} } },
            }} style={{ height: 280, width: '100%' }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              SLA Breaches (7 days)
            </Typography>
            <Typography variant="h3">4</Typography>
            <Typography variant="caption" color="text.secondary">-1 vs prior 7 days</Typography>
          </Box>
        </Grid>
      </Grid>

      <Copyright sx={{ mt: 3, mb: 4 }} />
    </Box>
  );
}
