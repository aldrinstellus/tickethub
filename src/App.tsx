import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function App() {
  console.log("App rendering...");

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
        <Typography variant="h3" gutterBottom>
          TicketHub - Testing WITHOUT AppTheme
        </Typography>
        <Typography variant="body1">
          If you can see this, MUI is working but AppTheme was the issue.
        </Typography>
      </Box>
    </>
  );
}
