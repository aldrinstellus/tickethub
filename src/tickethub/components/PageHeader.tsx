import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation, Link as RouterLink } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    const breadcrumbs = [
      <Link key="home" component={RouterLink} to="/" color="inherit" underline="hover">
        Home
      </Link>
    ];

    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');

      if (isLast) {
        breadcrumbs.push(
          <Typography key={routeTo} color="text.primary">
            {displayName}
          </Typography>
        );
      } else {
        breadcrumbs.push(
          <Link key={routeTo} component={RouterLink} to={routeTo} color="inherit" underline="hover">
            {displayName}
          </Link>
        );
      }
    });

    return breadcrumbs;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        {getBreadcrumbs()}
      </Breadcrumbs>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
