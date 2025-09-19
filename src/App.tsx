import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";

function SimpleTicketHub() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom>
        🎫 TicketHub
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Support Ticket Management System
      </Typography>
      <Typography variant="body1">
        Welcome to TicketHub! The system is now loading...
      </Typography>
    </Box>
  );
}

function NotFound() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
    </Box>
  );
}

export default function App() {
  return (
    <AppTheme>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleTicketHub />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppTheme>
  );
}
