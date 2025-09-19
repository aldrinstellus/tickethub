import * as React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import * as Router from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { fetchTicketById } from "../services/api";
import { Ticket } from "../data/mockData";

const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  tickets: "Tickets",
  "knowledge-base": "Knowledge Base",
  analytics: "Analytics",
  surveys: "Surveys",
  playground: "Playground",
  settings: "Settings",
  reports: "Reports",
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function SupportNavbarBreadcrumbs() {
  const location = Router.useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [ticketTitles, setTicketTitles] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    async function loadTicketTitles() {
      const newTitles: Record<string, string> = {};

      for (let i = 0; i < pathnames.length; i++) {
        const segment = pathnames[i];
        const prevSegment = i > 0 ? pathnames[i - 1] : null;

        // If this looks like a ticket ID and previous segment was "tickets"
        if (prevSegment === "tickets" && segment.startsWith("TH-")) {
          try {
            const ticket = await fetchTicketById(segment);
            if (ticket) {
              newTitles[segment] = ticket.subject;
            }
          } catch (err) {
            // ignore, will use default label
          }
        }
      }

      if (Object.keys(newTitles).length > 0) {
        setTicketTitles(prev => ({ ...prev, ...newTitles }));
      }
    }

    loadTicketTitles();
  }, [location.pathname]);

  function getBreadcrumbLabel(segment: string, index: number): string {
    const prevSegment = index > 0 ? pathnames[index - 1] : null;

    // Check if this is a ticket ID
    if (prevSegment === "tickets" && segment.startsWith("TH-")) {
      return ticketTitles[segment] || segment;
    }

    // Check if this is a known path
    if (pathLabels[segment]) {
      return pathLabels[segment];
    }

    // Default to capitalized
    return capitalizeFirstLetter(segment);
  }

  function getBreadcrumbPath(index: number): string {
    return "/" + pathnames.slice(0, index + 1).join("/");
  }

  return (
    <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
      <Link component={Router.Link} underline="hover" color="inherit" to="/" sx={{ display: "flex", alignItems: "center" }}>
        <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const label = getBreadcrumbLabel(value, index);
        const path = getBreadcrumbPath(index);

        return last ? (
          <Typography key={index} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link key={index} component={Router.Link} underline="hover" color="inherit" to={path}>
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
