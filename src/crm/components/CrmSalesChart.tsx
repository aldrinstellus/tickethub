import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ReactECharts from "echarts-for-react";

export default function CrmSalesChart() {
  const theme = useTheme();
  const [timeRange, setTimeRange] = React.useState("year");

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string | null,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Generate monthly data
  const currentYear = new Date().getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Sample data (in a real app this would come from an API)
  const salesData = [
    180000, 210000, 250000, 220000, 270000, 310000, 330000, 350000, 390000,
    410000, 430000, 470000,
  ];
  const targetsData = [
    200000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 360000,
    380000, 400000, 450000,
  ];
  const projectedData = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    450000,
    500000,
  ];

  const xAxisData = {
    scaleType: "band" as const,
    data: monthNames,
    tickLabelStyle: {
      angle: 0,
      textAnchor: "middle",
      fontSize: 12,
    },
  };

  // Format y-axis labels to show $ and K for thousands
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" component="h3">
            Sales Performance
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
          >
            <ToggleButton value="month" aria-label="month view">
              Month
            </ToggleButton>
            <ToggleButton value="quarter" aria-label="quarter view">
              Quarter
            </ToggleButton>
            <ToggleButton value="year" aria-label="year view">
              Year
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ flexGrow: 1, width: "100%", height: "300px" }}>
          {/* ECharts replacement */}
          <ReactECharts
            option={{
              tooltip: { trigger: 'axis', formatter: (params: any) => {
                return params.map((p: any) => `${p.seriesName}: ${formatYAxis(p.value)}`).join('<br/>');
              } },
              legend: { data: ['Actual Sales','Targets','Projected'], top: 10 },
              toolbox: { feature: { saveAsImage: {} } },
              xAxis: { type: 'category', data: monthNames },
              yAxis: { type: 'value', axisLabel: { formatter: (value: number) => formatYAxis(value) } },
              dataZoom: [{ type: 'slider', start: 0, end: 100 }],
              series: [
                { name: 'Actual Sales', type: 'bar', data: salesData, itemStyle: { color: theme.palette.primary.main } },
                { name: 'Targets', type: 'bar', data: targetsData, itemStyle: { color: theme.palette.grey[400] } },
                { name: 'Projected', type: 'line', data: projectedData, itemStyle: { color: theme.palette.secondary.main }, smooth: true },
              ],
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
