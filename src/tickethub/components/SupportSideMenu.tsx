import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import SupportMenuContent from "./SupportMenuContent";
import { useSidebar } from "../contexts/SidebarContext";

const drawerWidth = 240;
const collapsedWidth = 72;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ collapsed }) => ({
  width: collapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  [`& .${drawerClasses.paper}`]: {
    width: collapsed ? collapsedWidth : drawerWidth,
    boxSizing: "border-box",
    transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    overflowX: "hidden",
  },
}));

export default function SupportSideMenu() {
  const { isExpanded, isCollapsed, isHidden } = useSidebar();

  if (isHidden) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      collapsed={isCollapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          top: "64px",
          height: "calc(100vh - 64px)",
        },
      }}
    >
      <Box sx={{ overflow: "auto", height: "100%", pt: 1 }}>
        <SupportMenuContent collapsed={isCollapsed} />
      </Box>
    </Drawer>
  );
}
