import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function SupportNavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
      <Link component={RouterLink} underline="hover" color="inherit" to="/support" sx={{ display: "flex", alignItems: "center" }}>
        <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/)"}`; // will not be used since base is /support link above
        return last ? (
          <Typography key={index} color="text.primary">
            {capitalizeFirstLetter(value)}
          </Typography>
        ) : null;
      })}
    </Breadcrumbs>
  );
}