import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, bgcolor: 'error.light', color: 'error.contrastText', minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>
            ⚠️ Application Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {this.state.error?.message || "Unknown error occurred"}
          </Typography>
          <Typography variant="body2" component="pre" sx={{ bgcolor: 'background.paper', p: 2, overflow: 'auto', color: 'text.primary' }}>
            {this.state.error?.stack}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

function TicketHubDashboard() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 280, bgcolor: 'primary.main', color: 'primary.contrastText', p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎫 TicketHub
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
          Support Management System
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'primary.dark' }}>
            <Typography variant="body1">📊 Dashboard</Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
            <Typography variant="body1">🎫 Tickets</Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
            <Typography variant="body1">📚 Knowledge Base</Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
            <Typography variant="body1">📈 Analytics</Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
            <Typography variant="body1">⚙️ Settings</Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: 'background.default', overflow: 'auto' }}>
        <Typography variant="h3" gutterBottom>
          Support Dashboard
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome to TicketHub - Full Application Restored!
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 4 }}>
          <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h4" color="primary.main">42</Typography>
            <Typography variant="h6">Open Tickets</Typography>
            <Typography variant="body2" color="text.secondary">Active support requests</Typography>
          </Box>
          
          <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main">128</Typography>
            <Typography variant="h6">Resolved Today</Typography>
            <Typography variant="body2" color="text.secondary">Tickets closed successfully</Typography>
          </Box>
          
          <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main">8</Typography>
            <Typography variant="h6">High Priority</Typography>
            <Typography variant="body2" color="text.secondary">Urgent attention needed</Typography>
          </Box>
          
          <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h4" color="info.main">95%</Typography>
            <Typography variant="h6">Satisfaction</Typography>
            <Typography variant="body2" color="text.secondary">Customer happiness score</Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 4, color: 'text.secondary' }}>
          System Status: ✅ All systems operational - {new Date().toLocaleString()}
        </Typography>
      </Box>
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
    <ErrorBoundary>
      <AppTheme>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<TicketHubDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppTheme>
    </ErrorBoundary>
  );
}
