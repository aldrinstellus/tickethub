import * as React from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useSearch } from "../contexts/SearchContext";

const SearchTriggerWrapper = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
  transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
    borderColor: alpha(theme.palette.common.black, 0.12),
  },
  "&:focus-visible": {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    outline: 'none',
  },
  marginLeft: 0,
  width: "100%",
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up("sm")]: {
    width: "auto",
    marginLeft: theme.spacing(1),
    minWidth: "280px",
  },
  [theme.breakpoints.up("md")]: {
    minWidth: "320px",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    borderColor: alpha(theme.palette.common.white, 0.12),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: alpha(theme.palette.common.white, 0.2),
    },
    "&:focus-visible": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: theme.palette.primary.main,
    },
  }),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const PlaceholderText = styled(Typography)(({ theme }) => ({
  flex: 1,
  textAlign: 'left',
  color: theme.palette.text.secondary,
  fontSize: '14px',
  fontWeight: 400,
  userSelect: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const ShortcutWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(0.5),
}));

const ShortcutKey = styled("kbd")(({ theme }) => ({
  padding: "2px 6px",
  fontSize: "11px",
  fontWeight: 500,
  lineHeight: 1,
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.common.black, 0.06),
  border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
  borderRadius: 3,
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  ...theme.applyStyles("dark", {
    color: theme.palette.text.secondary,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    borderColor: alpha(theme.palette.common.white, 0.2),
  }),
}));

interface SearchTriggerProps {
  fullWidth?: boolean;
  placeholder?: string;
}

export default function SearchTrigger({ 
  fullWidth = false, 
  placeholder = "Search tickets, articles, pages..." 
}: SearchTriggerProps) {
  const { openSearch } = useSearch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Detect OS for keyboard shortcuts
  const isMac = React.useMemo(() => {
    return typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }, []);

  const handleClick = () => {
    openSearch();
  };

  // Responsive placeholder text
  const getPlaceholderText = () => {
    if (isMobile) {
      return "Search...";
    }
    return placeholder;
  };

  return (
    <SearchTriggerWrapper
      onClick={handleClick}
      sx={{
        width: fullWidth ? "100%" : undefined,
      }}
      aria-label="Open search"
      role="button"
    >
      <SearchIconWrapper>
        <SearchRoundedIcon fontSize="small" />
      </SearchIconWrapper>
      
      <PlaceholderText variant="body2">
        {getPlaceholderText()}
      </PlaceholderText>
      
      {!isMobile && (
        <ShortcutWrapper>
          <ShortcutKey>{isMac ? '⌘' : 'Ctrl'}</ShortcutKey>
          <ShortcutKey>K</ShortcutKey>
        </ShortcutWrapper>
      )}
    </SearchTriggerWrapper>
  );
}
