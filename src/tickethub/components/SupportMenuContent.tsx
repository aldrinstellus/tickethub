import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import PollRoundedIcon from "@mui/icons-material/PollRounded";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/" },
  { text: "Tickets", icon: <ConfirmationNumberRoundedIcon />, path: "/tickets" },
  { text: "Knowledge Base", icon: <MenuBookRoundedIcon />, path: "/knowledge-base" },
  { text: "Analytics", icon: <AssessmentRoundedIcon />, path: "/analytics" },
  { text: "Surveys", icon: <PollRoundedIcon />, path: "/surveys" },
  { text: "Playground", icon: <ShowChartRoundedIcon />, path: "/playground" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
];

interface SupportMenuContentProps {
  collapsed?: boolean;
}

export default function SupportMenuContent({ collapsed = false }: SupportMenuContentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isSelected = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Tooltip
              title={collapsed ? item.text : ""}
              placement="right"
              arrow
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                selected={isSelected(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 3,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 'auto' : 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={collapsed ? item.text : ""}
                placement="right"
                arrow
                disableHoverListener={!collapsed}
              >
                <ListItemButton
                  selected={isSelected(item.path)}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    px: 3,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 'auto' : 3,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}
