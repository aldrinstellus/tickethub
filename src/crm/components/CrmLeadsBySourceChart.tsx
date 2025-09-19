import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VisxDonutChart from "./VisxDonutChart";

// Sample lead source data
const leadSources = [
  { label: "Website", value: 35, color: "#3f51b5" },
  { label: "Referrals", value: 25, color: "#2196f3" },
  { label: "Social Media", value: 20, color: "#4caf50" },
  { label: "Email Campaigns", value: 15, color: "#ff9800" },
  { label: "Other", value: 5, color: "#9e9e9e" },
];

export default function CrmLeadsBySourceChart() {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Leads by Source
        </Typography>

        <Box sx={{ flexGrow: 1, width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VisxDonutChart data={leadSources} width={280} height={240} innerRadius={60} />
        </Box>
      </CardContent>
    </Card>
  );
}
