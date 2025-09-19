import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";
// import TicketHubApp from "./tickethub/TicketHubApp";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("React Error Boundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, bgcolor: 'error.light', color: 'error.contrastText', minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>
            ⚠️ Component Error
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

function NotFound() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1">The requested page could not be found.</Typography>
    </Box>
  );
}

function TestTicketHub() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h2" gutterBottom sx={{ color: 'primary.main' }}>
        🎫 TicketHub
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Testing Import Issue
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        If you see this, the issue was with TicketHubApp import
      </Typography>
    </Box>
  );
}

export default function App() {
  return (
    <AppTheme>
      <CssBaseline />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/*" element={<TestTicketHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AppTheme>
  );
}
