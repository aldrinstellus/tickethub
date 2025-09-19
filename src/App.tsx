import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";

function SimpleTicketHub() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h2" gutterBottom sx={{ color: 'primary.main' }}>
        🎫 TicketHub
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Support Ticket Management System
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Welcome to TicketHub! Routing is working...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Time: {new Date().toLocaleTimeString()}
      </Typography>
    </Box>
  );
}

function NotFound() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1">The requested page could not be found.</Typography>
    </Box>
  );
}

export default function App() {
  return (
    <AppTheme>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<SimpleTicketHub />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppTheme>
  );
}
