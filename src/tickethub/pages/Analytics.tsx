import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";
import ReactECharts from "echarts-for-react";

export default function Analytics() {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['FRT', 'CSAT'], top: 10 },
    xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    yAxis: [{ type: 'value', name: 'hrs' }, { type: 'value', name: '%' }],
    series: [
      { name: 'FRT', type: 'line', data: [2.4, 2.1, 1.9, 2.2, 1.8, 1.7, 1.9] },
      { name: 'CSAT', type: 'line', data: [92, 92, 93, 94, 95, 94, 94], yAxisIndex: 1 },
    ],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Analytics</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>First Response Time</Typography>
          <ReactECharts option={option} style={{ height: 280 }} />
        </Box>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>CSAT</Typography>
          <LineChart height={280} series={[{ data: [92,92,93,94,95,94,94], label: 'CSAT' }]} xAxis={[{ scaleType: 'point', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }]} />
        </Box>
      </Box>
    </Box>
  );
}
