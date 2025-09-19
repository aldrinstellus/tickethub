import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MenuButton from "../../dashboard/components/MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import CrmSearch from "../../crm/components/CrmSearch";
import { TicketHubLogo } from "./SupportAppNavbar";
import SupportSideMenuMobile from "./SupportSideMenuMobile";

export default function SupportTopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = (newOpen: boolean) => () => {
    setMobileMenuOpen(newOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 0,
          bgcolor: "background.paper",
          backgroundImage: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important", px: 2 }}>
          {/* Left side - Wordmark (Logo and Title) */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              minWidth: "200px"
            }}
          >
            <TicketHubLogo />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: '"Special Gothic Condensed One", sans-serif',
                fontWeight: 600
              }}
            >
              TicketHub
            </Typography>
          </Stack>

          {/* Center - Search */}
          <Box sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            mx: 2
          }}>
            <Box sx={{ maxWidth: "500px", width: "100%" }}>
              <CrmSearch />
            </Box>
          </Box>

          {/* Right side - New Ticket, Notifications and Controls */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: "200px", justifyContent: "flex-end" }}>
            {/* New Ticket Button */}
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => window.dispatchEvent(new CustomEvent('open-quick-create'))}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              New Ticket
            </Button>

            <MenuButton showBadge aria-label="Open notifications">
              <NotificationsRoundedIcon />
            </MenuButton>
            <ColorModeIconDropdown />

            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={toggleMobileMenu(true)}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      
      {/* Mobile menu drawer */}
      <SupportSideMenuMobile open={mobileMenuOpen} toggleDrawer={toggleMobileMenu} />
    </>
  );
}
