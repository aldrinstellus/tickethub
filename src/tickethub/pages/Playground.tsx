import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ReactECharts from "echarts-for-react";
import Plot from "react-plotly.js";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

export default function Playground() {
  const echartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line', smooth: true }]
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader title="Playground" />
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>ECharts (echarts-for-react)</Typography>
          {/* @ts-ignore */}
          <ReactECharts option={echartsOption} style={{ height: 300 }} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Plotly</Typography>
          <Plot data={[{ x: [1,2,3,4], y: [2,6,3,5], type: 'scatter', mode: 'lines+markers', marker: {color: 'blue'}}]} layout={{ width: '100%', height: 300, autosize: true }} style={{ width: '100%' }} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>ApexCharts</Typography>
          <Chart options={{ chart: { id: 'apex-demo' }, xaxis: { categories: ['Jan','Feb','Mar','Apr'] } }} series={[{ name: 'Series 1', data: [30,40,35,50] }]} type="line" height={300} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Framer Motion micro-interaction</Typography>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>Hover / Tap me</Box>
          </motion.div>
        </Paper>
      </Stack>
    </Box>
  );
}
