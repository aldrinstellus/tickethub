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
import SupportTopNavbar from "./components/SupportTopNavbar";
import SupportDashboard from "./pages/SupportDashboard";
import Tickets from "./pages/Tickets";
import TicketWorkspace from "./pages/TicketWorkspace";
import KnowledgeBase from "./pages/KnowledgeBase";
import Analytics from "./pages/Analytics";
import Surveys from "./pages/Surveys";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Playground from "./pages/Playground";
import FederatedSearch from "./components/FederatedSearch";
import NewTicketModal from "./components/NewTicketModal";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { SearchProvider } from "./contexts/SearchContext";
import { TicketCreationProvider } from "./contexts/TicketCreationContext";
import { RealTimeProvider } from "./contexts/RealTimeContext";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function TicketHubAppInner() {
  const { isHidden } = useSidebar();

  return (
    <>
      <SupportTopNavbar />
      <Box sx={{ display: "flex", height: "100vh", pt: "64px" }}>
        <SupportSideMenu />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
            transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "stretch",
              px: 3,
              py: 3,
              '& > *': {
                width: '100% !important',
                maxWidth: '100% !important',
              },
            }}
          >
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
        </Box>
      </Box>
    </>
  );
}

export default function TicketHubApp() {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <UserProvider>
        <SidebarProvider>
          <SearchProvider>
            <TicketCreationProvider>
              <CssBaseline enableColorScheme />
              <TicketHubAppInner />
              <FederatedSearch />
              <NewTicketModal />
            </TicketCreationProvider>
          </SearchProvider>
        </SidebarProvider>
      </UserProvider>
    </AppTheme>
  );
}
