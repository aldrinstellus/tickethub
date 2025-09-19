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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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

interface TimePeriod {
  label: string;
  value: string;
  days: number;
}

const timePeriods: TimePeriod[] = [
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 3 months", value: "3m", days: 90 },
  { label: "Last 6 months", value: "6m", days: 180 },
  { label: "Last year", value: "1y", days: 365 },
  { label: "Custom range", value: "custom", days: 0 },
];

export default function Analytics() {
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPeriod, setSelectedPeriod] = React.useState("30d");
  const [customStartDate, setCustomStartDate] = React.useState<Dayjs | null>(null);
  const [customEndDate, setCustomEndDate] = React.useState<Dayjs | null>(null);
  const [showCustomDates, setShowCustomDates] = React.useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setShowCustomDates(period === "custom");

    if (period === "custom") {
      // Set default custom range to last 30 days
      setCustomEndDate(dayjs());
      setCustomStartDate(dayjs().subtract(30, 'day'));
    }
  };

  // Get current period info for display
  const getCurrentPeriodInfo = () => {
    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      const days = customEndDate.diff(customStartDate, 'day');
      return {
        label: `${customStartDate.format('MMM D')} - ${customEndDate.format('MMM D, YYYY')}`,
        days: days
      };
    }

    const period = timePeriods.find(p => p.value === selectedPeriod);
    return period ? { label: period.label, days: period.days } : { label: "Last 30 days", days: 30 };
  };

  const currentPeriod = getCurrentPeriodInfo();

  // Generate dynamic mock data based on selected period
  const generateKpiData = () => {
    const dataPoints = Math.min(currentPeriod.days, 30); // Limit chart points for readability
    const interval = currentPeriod.label;

    // Generate sample data arrays
    const generateTrendData = (baseValue: number, variance: number) => {
      return Array.from({ length: 7 }, (_, i) => {
        const trend = (Math.random() - 0.5) * variance;
        return Math.max(0, baseValue + trend);
      });
    };

    // Adjust base values based on period length
    const periodMultiplier = currentPeriod.days > 90 ? 1.1 : currentPeriod.days > 30 ? 1.05 : 1;

    return [
      {
        title: "Avg First Response",
        value: `${(1.8 * periodMultiplier).toFixed(1)}h`,
        interval,
        trend: "down" as const,
        trendValue: currentPeriod.days > 90 ? "-15%" : "-12%",
        data: generateTrendData(1.8 * periodMultiplier, 0.6)
      },
      {
        title: "Resolution Time",
        value: `${(24.5 * periodMultiplier).toFixed(1)}h`,
        interval,
        trend: "down" as const,
        trendValue: currentPeriod.days > 90 ? "-10%" : "-8%",
        data: generateTrendData(24.5 * periodMultiplier, 4)
      },
      {
        title: "CSAT Score",
        value: `${Math.min(99, Math.round(94 + (currentPeriod.days > 90 ? 2 : 0)))}%`,
        interval,
        trend: "up" as const,
        trendValue: currentPeriod.days > 90 ? "+3%" : "+2%",
        data: generateTrendData(94 + (currentPeriod.days > 90 ? 2 : 0), 2)
      },
      {
        title: "SLA Compliance",
        value: `${Math.min(99, Math.round(96 + (currentPeriod.days > 180 ? 1 : 0)))}%`,
        interval,
        trend: "up" as const,
        trendValue: currentPeriod.days > 180 ? "+2%" : "+1%",
        data: generateTrendData(96 + (currentPeriod.days > 180 ? 1 : 0), 1.5)
      },
    ];
  };

  const kpiData = generateKpiData();

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

  // Generate dynamic chart data based on time period
  const generateChartData = () => {
    const days = Math.min(currentPeriod.days, 30); // Limit data points for readability
    const isWeekly = days <= 7;
    const isMonthly = days > 90;

    // Generate date labels
    const labels = [];
    const now = dayjs();

    if (isWeekly) {
      // Show last 7 days
      for (let i = 6; i >= 0; i--) {
        labels.push(now.subtract(i, 'day').format('ddd'));
      }
    } else if (isMonthly) {
      // Show weeks for longer periods
      for (let i = 7; i >= 0; i--) {
        labels.push(`Week ${8 - i}`);
      }
    } else {
      // Show days for medium periods
      const step = Math.ceil(days / 7);
      for (let i = 6; i >= 0; i--) {
        labels.push(now.subtract(i * step, 'day').format('MMM D'));
      }
    }

    // Generate response time data
    const targetResponseTime = 2;
    const actualResponseTimes = labels.map(() =>
      targetResponseTime + (Math.random() - 0.5) * 1.2
    );

    // Generate volume data
    const baseVolume = currentPeriod.days > 90 ? 20 : currentPeriod.days > 30 ? 15 : 12;
    const createdTickets = labels.map(() =>
      Math.round(baseVolume + (Math.random() - 0.5) * 8)
    );
    const resolvedTickets = labels.map((_, i) =>
      Math.round(createdTickets[i] * (0.85 + Math.random() * 0.2))
    );

    return {
      labels,
      responseTime: {
        target: labels.map(() => targetResponseTime),
        actual: actualResponseTimes
      },
      volume: {
        created: createdTickets,
        resolved: resolvedTickets
      }
    };
  };

  const chartData = generateChartData();

  const responseTimeOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Target', 'Actual'], top: 10 },
    xAxis: { type: 'category', data: chartData.labels },
    yAxis: { type: 'value', name: 'Hours' },
    series: [
      { name: 'Target', type: 'line', data: chartData.responseTime.target, lineStyle: { type: 'dashed' } },
      { name: 'Actual', type: 'line', data: chartData.responseTime.actual },
    ],
  };

  const volumeOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Created', 'Resolved'], top: 10 },
    xAxis: { type: 'category', data: chartData.labels },
    yAxis: { type: 'value', name: 'Tickets' },
    series: [
      { name: 'Created', type: 'bar', data: chartData.volume.created },
      { name: 'Resolved', type: 'bar', data: chartData.volume.resolved },
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
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Time Period Selector */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon fontSize="small" color="primary" />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Time Period</InputLabel>
                    <Select
                      value={selectedPeriod}
                      label="Time Period"
                      onChange={(e) => handlePeriodChange(e.target.value)}
                    >
                      {timePeriods.map((period) => (
                        <MenuItem key={period.value} value={period.value}>
                          {period.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Custom Date Range Pickers */}
                  {showCustomDates && (
                    <>
                      <DatePicker
                        label="Start Date"
                        value={customStartDate}
                        onChange={(newValue) => setCustomStartDate(newValue)}
                        slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
                      />
                      <DatePicker
                        label="End Date"
                        value={customEndDate}
                        onChange={(newValue) => setCustomEndDate(newValue)}
                        slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
                        minDate={customStartDate}
                      />
                    </>
                  )}
                </Stack>
              </LocalizationProvider>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small">Export Report</Button>
                <Button variant="contained" size="small">Schedule Report</Button>
              </Stack>
            </Stack>
          </Stack>

          {/* Current Period Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Showing data for ${currentPeriod.label}`}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          </motion.div>
        </motion.div>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <AnimatePresence>
            {kpiData.map((kpi, idx) => (
              <Grid item xs={12} sm={6} md={3} key={kpi.title}>
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
            <TabPanel key={0} value={tabValue} index={0}>
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
                        series={[{
                          data: chartData.labels.map(() => 90 + Math.random() * 8),
                          label: 'CSAT %'
                        }]}
                        xAxis={[{ scaleType: 'point', data: chartData.labels }]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel key={1} value={tabValue} index={1}>
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
