import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Reports() {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Performance Reports
      </Typography>
      <Stack spacing={2}>
        <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            First Response Time (hrs)
          </Typography>
          <LineChart height={280} series={[{ data: [2.4, 2.1, 1.9, 2.2, 1.8, 1.7, 1.9], label: "FRT" }]} xAxis={[{ scaleType: "point", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }]} />
        </Box>
        <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            CSAT (%)
          </Typography>
          <LineChart height={280} series={[{ data: [92, 92, 93, 94, 95, 94, 94], label: "CSAT" }]} xAxis={[{ scaleType: "point", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }]} />
        </Box>
      </Stack>
    </Box>
  );
}
