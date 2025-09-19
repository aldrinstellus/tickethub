import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PollRoundedIcon from "@mui/icons-material/PollRounded";
import { TicketHubLogo } from "./SupportAppNavbar";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/support" },
  { text: "Tickets", icon: <ConfirmationNumberRoundedIcon />, path: "/support/tickets" },
  { text: "Knowledge Base", icon: <MenuBookRoundedIcon />, path: "/support/knowledge-base" },
  { text: "Analytics", icon: <AssessmentRoundedIcon />, path: "/support/analytics" },
  { text: "Surveys", icon: <PollRoundedIcon />, path: "/support/surveys" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/support/settings" },
];

interface SupportSideMenuMobileProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
}

export default function SupportSideMenuMobile({ open, toggleDrawer }: SupportSideMenuMobileProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      slotProps={{ backdrop: { invisible: false } }}
      sx={{ zIndex: 1300, "& .MuiDrawer-paper": { width: "280px", boxSizing: "border-box" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", mx: 2, my: 2, gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TicketHubLogo />
          <Typography variant="h6" component="div">
            TicketHub AI
          </Typography>
        </Box>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton selected={location.pathname.startsWith(item.path)} onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton selected={location.pathname.startsWith(item.path)} onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
