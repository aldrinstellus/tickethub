import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import SupportMenuContent from "./SupportMenuContent";
import { TicketHubLogo } from "./SupportAppNavbar";
import { useUser } from "../contexts/UserContext";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SupportSideMenu() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box sx={{ display: "flex", mt: "calc(var(--template-frame-height, 0px) + 4px)", p: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TicketHubLogo />
          <Typography variant="h6" component="div">TicketHub AI</Typography>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
        <SupportMenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{ p: 2, gap: 1, alignItems: "center", borderTop: "1px solid", borderColor: "divider" }}
      >
        <Avatar sizes="small" alt={user.name} sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Avatar>
        <Box sx={{ mr: "auto" }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user.email}
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
