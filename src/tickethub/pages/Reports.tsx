import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DatePicker from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmailIcon from "@mui/icons-material/Email";
import { LineChart, BarChart } from "@mui/x-charts";
import ReactECharts from "echarts-for-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";

export default function Reports() {
  const [dateRange, setDateRange] = React.useState("last30days");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedReport, setSelectedReport] = React.useState(0);

  const reportTemplates = [
    {
      name: "Executive Summary",
      description: "High-level overview of support metrics for leadership",
      frequency: "Weekly",
      lastGenerated: "2 days ago",
      recipients: 3
    },
    {
      name: "Agent Performance",
      description: "Individual agent metrics and performance trends",
      frequency: "Monthly",
      lastGenerated: "1 week ago",
      recipients: 8
    },
    {
      name: "SLA Compliance",
      description: "Service level agreement adherence tracking",
      frequency: "Daily",
      lastGenerated: "Today",
      recipients: 5
    },
    {
      name: "Customer Satisfaction",
      description: "CSAT scores and customer feedback analysis",
      frequency: "Bi-weekly",
      lastGenerated: "3 days ago",
      recipients: 12
    }
  ];

  const performanceOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['FRT', 'Resolution Time', 'CSAT'], top: 10 },
    xAxis: { type: 'category', data: ['Jan','Feb','Mar','Apr','May','Jun'] },
    yAxis: [
      { type: 'value', name: 'Hours', position: 'left' },
      { type: 'value', name: 'CSAT %', position: 'right', min: 80, max: 100 }
    ],
    series: [
      { name: 'FRT', type: 'line', data: [2.4, 2.1, 1.9, 2.2, 1.8, 1.7] },
      { name: 'Resolution Time', type: 'line', data: [24, 22, 20, 23, 19, 18] },
      { name: 'CSAT', type: 'line', yAxisIndex: 1, data: [92, 93, 94, 93, 95, 94] },
    ],
  };

  const volumeData = [
    { month: 'Jan', created: 145, resolved: 142 },
    { month: 'Feb', created: 158, resolved: 156 },
    { month: 'Mar', created: 162, resolved: 159 },
    { month: 'Apr', created: 171, resolved: 168 },
    { month: 'May', created: 183, resolved: 180 },
    { month: 'Jun', created: 177, resolved: 175 },
  ];

  const agentData = [
    { agent: 'Alex Thompson', tickets: 47, avgResponse: '1.2h', csat: 4.6 },
    { agent: 'Priya Patel', tickets: 52, avgResponse: '1.8h', csat: 4.4 },
    { agent: 'Marcus Johnson', tickets: 38, avgResponse: '2.1h', csat: 4.2 },
    { agent: 'Sarah Chen', tickets: 41, avgResponse: '1.5h', csat: 4.7 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <PageHeader
                title="Reports"
                subtitle="Generate and schedule automated reports"
              />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<ScheduleIcon />}>
                  Schedule Report
                </Button>
                <Button variant="contained" startIcon={<DownloadIcon />}>
                  Export Data
                </Button>
              </Stack>
            </Stack>
          </motion.div>

          {/* Date Range Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Report Filters</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={dateRange}
                      label="Date Range"
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <MenuItem value="last7days">Last 7 days</MenuItem>
                      <MenuItem value="last30days">Last 30 days</MenuItem>
                      <MenuItem value="last90days">Last 90 days</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>

                  {dateRange === 'custom' && (
                    <>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ textField: { size: 'small' } }}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { size: 'small' } }}
                      />
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          <Grid container spacing={3}>
            {/* Report Templates */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Report Templates</Typography>
                    <List dense>
                      <AnimatePresence>
                        {reportTemplates.map((report, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ListItem disablePadding>
                              <ListItemButton
                                selected={selectedReport === index}
                                onClick={() => setSelectedReport(index)}
                              >
                                <ListItemText
                                  primary={report.name}
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {report.description}
                                      </Typography>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={report.frequency} size="small" />
                                        <Typography variant="caption">
                                          Last: {report.lastGenerated}
                                        </Typography>
                                      </Stack>
                                    </Box>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EmailIcon />}>
                      Send Now
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>

            {/* Report Content */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {/* Performance Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Performance Trends</Typography>
                      <ReactECharts option={performanceOption} style={{ height: 320 }} />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Volume Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Ticket Volume</Typography>
                      <BarChart
                        height={300}
                        series={[
                          { data: volumeData.map(d => d.created), label: 'Created', id: 'created' },
                          { data: volumeData.map(d => d.resolved), label: 'Resolved', id: 'resolved' },
                        ]}
                        xAxis={[{ scaleType: 'band', data: volumeData.map(d => d.month) }]}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Agent Performance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Agent Performance</Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Agent</th>
                              <th style={{ textAlign: 'center', padding: '12px 8px' }}>Tickets</th>
                              <th style={{ textAlign: 'center', padding: '12px 8px' }}>Avg Response</th>
                              <th style={{ textAlign: 'center', padding: '12px 8px' }}>CSAT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agentData.map((agent, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '12px 8px' }}>{agent.agent}</td>
                                <td style={{ textAlign: 'center', padding: '12px 8px' }}>{agent.tickets}</td>
                                <td style={{ textAlign: 'center', padding: '12px 8px' }}>{agent.avgResponse}</td>
                                <td style={{ textAlign: 'center', padding: '12px 8px' }}>{agent.csat}/5</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </motion.div>
  );
}
