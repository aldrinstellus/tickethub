import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SupportMenuContent from "./SupportMenuContent";
import { useUser } from "../contexts/UserContext";
import { useSidebar } from "../contexts/SidebarContext";

const drawerWidth = 240;
const collapsedWidth = 72;

const Drawer = styled(MuiDrawer)<{ $collapsed?: boolean }>(({ $collapsed }) => ({
  width: $collapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  [`& .${drawerClasses.paper}`]: {
    width: $collapsed ? collapsedWidth : drawerWidth,
    boxSizing: "border-box",
    transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    overflowX: "hidden",
  },
}));

export default function SupportSideMenu() {
  const { user } = useUser();
  const { isExpanded, isCollapsed, isHidden } = useSidebar();

  if (!user || isHidden) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      $collapsed={isCollapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          top: "64px",
          height: "calc(100vh - 64px)",
        },
      }}
    >
      <Box sx={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column", pt: 1 }}>
        <SupportMenuContent collapsed={isCollapsed} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: isCollapsed ? 1 : 2,
          gap: isCollapsed ? 0 : 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: isCollapsed ? "center" : "flex-start"
        }}
      >
        <Avatar
          sizes="small"
          alt={user.name}
          sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
          title={isCollapsed ? user.name : undefined}
        >
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Avatar>
        {isExpanded && (
          <>
            <Box sx={{ mr: "auto" }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {user.email}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  window.location.reload(); // Simple logout - in real app would call logout()
                }
              }}
              sx={{ color: 'text.secondary' }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
