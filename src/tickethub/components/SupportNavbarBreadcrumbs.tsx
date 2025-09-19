import { useLocation, Link as RouterLink } from "react-router-dom";
import * as Router from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function SupportNavbarBreadcrumbs() {
  const location = Router.useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
      <Link component={Router.Link} underline="hover" color="inherit" to="/" sx={{ display: "flex", alignItems: "center" }}>
        <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        return last ? (
          <Typography key={index} color="text.primary">
            {capitalizeFirstLetter(value)}
          </Typography>
        ) : null;
      })}
    </Breadcrumbs>
  );
}
