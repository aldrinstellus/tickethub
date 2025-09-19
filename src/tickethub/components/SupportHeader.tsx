import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "../../dashboard/components/MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import EnhancedSearch from "./EnhancedSearch";
import SupportNavbarBreadcrumbs from "./SupportNavbarBreadcrumbs";

export default function SupportHeader() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="column" spacing={1}>
        <SupportNavbarBreadcrumbs />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, fontFamily: '"Special Gothic Condensed One", sans-serif' }}>
          TicketHub
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <EnhancedSearch />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
