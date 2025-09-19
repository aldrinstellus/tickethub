import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";

export default function App() {
  console.log("App rendering...");

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: '100vh' }}>
        <Typography variant="h3" gutterBottom>
          TicketHub - Testing AppTheme
        </Typography>
        <Typography variant="body1">
          If you can see this, AppTheme and MUI are working correctly.
        </Typography>
      </Box>
    </AppTheme>
  );
}
