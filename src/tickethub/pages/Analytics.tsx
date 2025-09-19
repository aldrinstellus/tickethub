import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { LineChart, PieChart } from "@mui/x-charts";
import ReactECharts from "echarts-for-react";
import { motion, AnimatePresence } from "framer-motion";
import CrmStatCard from "../../crm/components/CrmStatCard";
import PageHeader from "../components/PageHeader";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function Analytics() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data
  const kpiData = [
    { title: "Avg First Response", value: "1.8h", interval: "Last 30 days", trend: "down", trendValue: "-12%", data: [2.4, 2.2, 2.0, 1.9, 1.8, 1.7, 1.8] },
    { title: "Resolution Time", value: "24.5h", interval: "Last 30 days", trend: "down", trendValue: "-8%", data: [28, 26, 25, 24, 23, 24, 24.5] },
    { title: "CSAT Score", value: "94%", interval: "Last 30 days", trend: "up", trendValue: "+2%", data: [92, 92, 93, 94, 95, 94, 94] },
    { title: "SLA Compliance", value: "96%", interval: "Last 30 days", trend: "up", trendValue: "+1%", data: [94, 95, 95, 96, 96, 97, 96] },
  ];

  const priorityDistribution = [
    { label: 'Low', value: 35, color: '#4caf50' },
    { label: 'Normal', value: 45, color: '#2196f3' },
    { label: 'High', value: 15, color: '#ff9800' },
    { label: 'Urgent', value: 5, color: '#f44336' },
  ];

  const channelData = [
    { label: 'Email', value: 60 },
    { label: 'Chat', value: 25 },
    { label: 'Phone', value: 10 },
    { label: 'API', value: 5 },
  ];

  const responseTimeOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Target', 'Actual'], top: 10 },
    xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    yAxis: { type: 'value', name: 'Hours' },
    series: [
      { name: 'Target', type: 'line', data: [2, 2, 2, 2, 2, 2, 2], lineStyle: { type: 'dashed' } },
      { name: 'Actual', type: 'line', data: [2.4, 2.1, 1.9, 2.2, 1.8, 1.7, 1.9] },
    ],
  };

  const volumeOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Created', 'Resolved'], top: 10 },
    xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    yAxis: { type: 'value', name: 'Tickets' },
    series: [
      { name: 'Created', type: 'bar', data: [12, 14, 13, 15, 18, 16, 17] },
      { name: 'Resolved', type: 'bar', data: [10, 12, 14, 13, 16, 15, 15] },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <PageHeader title="Analytics" />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small">Export Report</Button>
              <Button variant="contained" size="small">Schedule Report</Button>
            </Stack>
          </Stack>
        </motion.div>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <AnimatePresence>
            {kpiData.map((kpi, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + (idx * 0.1),
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <CrmStatCard
                    title={kpi.title}
                    value={kpi.value}
                    interval={kpi.interval}
                    trend={kpi.trend as "up" | "down"}
                    trendValue={kpi.trendValue}
                    data={kpi.data}
                  />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
              <Tab label="Performance" />
              <Tab label="Volume" />
              <Tab label="Distribution" />
            </Tabs>
          </Box>

          <AnimatePresence mode="wait">
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Response Time Trends</Typography>
                      <ReactECharts option={responseTimeOption} style={{ height: 320 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>CSAT Over Time</Typography>
                      <LineChart
                        height={320}
                        series={[{ data: [92,92,93,94,95,94,94], label: 'CSAT %' }]}
                        xAxis={[{ scaleType: 'point', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Ticket Volume</Typography>
                      <ReactECharts option={volumeOption} style={{ height: 400 }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Priority Distribution</Typography>
                      <PieChart
                        series={[{ data: priorityDistribution }]}
                        height={320}
                        slotProps={{
                          legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Channel Distribution</Typography>
                      <PieChart
                        series={[{ data: channelData }]}
                        height={320}
                        slotProps={{
                          legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </AnimatePresence>
        </motion.div>
      </Box>
    </motion.div>
  );
}
