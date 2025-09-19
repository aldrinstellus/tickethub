import * as React from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../dashboard/theme/customizations";
import SupportSideMenu from "./components/SupportSideMenu";
import SupportAppNavbar from "./components/SupportAppNavbar";
import SupportHeader from "./components/SupportHeader";
import SupportDashboard from "./pages/SupportDashboard";
import Tickets from "./pages/Tickets";
import TicketWorkspace from "./pages/TicketWorkspace";
import KnowledgeBase from "./pages/KnowledgeBase";
import Analytics from "./pages/Analytics";
import Surveys from "./pages/Surveys";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Playground from "./pages/Playground";
import QuickCreateTicket from "./components/QuickCreateTicket";
import { UserProvider } from "./contexts/UserContext";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function TicketHubApp() {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <UserProvider>
        <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SupportSideMenu />
        <SupportAppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "stretch",
              px: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
              '& > *': {
                width: '100% !important',
                maxWidth: '100% !important',
              },
            }}
          >
            <SupportHeader />
            <Routes>
              <Route index element={<SupportDashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<TicketWorkspace />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="surveys" element={<Surveys />} />
              <Route path="playground" element={<Playground />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
            <Outlet />
          </Stack>
          <QuickCreateTicket />
        </Box>
      </Box>
      </UserProvider>
    </AppTheme>
  );
}
