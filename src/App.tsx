import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CrmDashboard from "./crm/CrmDashboard";
import TicketHubApp from "./tickethub/TicketHubApp";
import AppTheme from "./shared-theme/AppTheme";

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
        <Box sx={{ p: 4, color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {this.state.error?.message || "Unknown error occurred"}
          </Typography>
          <Typography variant="body2" component="pre" sx={{ backgroundColor: '#333', p: 2, overflow: 'auto' }}>
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
    </Box>
  );
}

function SimpleTest() {
  return (
    <Box sx={{ p: 4, backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        React is working!
      </Typography>
      <Typography variant="body1">
        If you can see this, React is mounting correctly.
      </Typography>
    </Box>
  );
}

// Test AppTheme
function TestAppTheme() {
  return (
    <AppTheme>
      <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Typography variant="h4" gutterBottom>
          Testing AppTheme
        </Typography>
        <Typography variant="body1">
          If you see this, AppTheme is working correctly.
        </Typography>
      </Box>
    </AppTheme>
  );
}

export default function App() {
  console.log("App component rendering...");

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CssBaseline enableColorScheme />
        <Routes>
          <Route path="/crm/*" element={<CrmDashboard />} />
          <Route path="/*" element={<TestAppTheme />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
