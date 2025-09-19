import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { searchService, SearchResult } from "../services/searchService";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
    borderColor: alpha(theme.palette.common.black, 0.12),
  },
  "&:focus-within": {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    borderColor: alpha(theme.palette.common.white, 0.12),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: alpha(theme.palette.common.white, 0.2),
    },
    "&:focus-within": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: theme.palette.primary.main,
    },
  }),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}));

const ShortcutWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  pointerEvents: "none",
  zIndex: 1,
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.25, 5, 1.25, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(8)})`, // Space for shortcuts
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "14px",
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 0.8,
    },
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
    [theme.breakpoints.up("md")]: {
      width: "24ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

const ResultsPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.modal,
  width: "100%",
  maxWidth: "600px",
}));

const getResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'ticket':
      return <ConfirmationNumberRoundedIcon fontSize="small" />;
    case 'article':
      return <ArticleRoundedIcon fontSize="small" />;
    case 'user':
      return <PersonRoundedIcon fontSize="small" />;
    case 'page':
      return <DashboardRoundedIcon fontSize="small" />;
    default:
      return <SearchRoundedIcon fontSize="small" />;
  }
};

const getResultTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'ticket':
      return 'primary';
    case 'article':
      return 'info';
    case 'user':
      return 'secondary';
    case 'page':
      return 'default';
    default:
      return 'default';
  }
};

export default function EnhancedSearch() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Detect OS for keyboard shortcuts
  const isMac = React.useMemo(() => {
    return typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }, []);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      // Escape to close
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
        setSelectedIndex(-1);
      }
      
      // Arrow navigation in results
      if (isOpen && results.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
          event.preventDefault();
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Search function with debouncing
  const performSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = searchService.quickSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setAnchorEl(event.currentTarget.parentElement);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle input focus
  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget.parentElement);
    if (query.trim()) {
      performSearch(query);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    
    if (result.url && result.url !== '#') {
      navigate(result.url);
    }
  };

  // Handle click away
  const handleClickAway = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Group results by type
  const groupedResults = React.useMemo(() => {
    const groups: { [key: string]: SearchResult[] } = {};
    results.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });
    return groups;
  }, [results]);

  const showResults = isOpen && (query.trim().length > 0) && (results.length > 0 || isSearching);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <SearchWrapper>
          <SearchIconWrapper>
            <SearchRoundedIcon fontSize="small" />
          </SearchIconWrapper>
          
          <StyledInputBase
            ref={inputRef}
            placeholder="Search tickets, articles, pages..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ "aria-label": "search" }}
          />
          
          {!isMobile && (
            <ShortcutWrapper>
              <ShortcutKey>{isMac ? '⌘' : 'Ctrl'}</ShortcutKey>
              <ShortcutKey>K</ShortcutKey>
            </ShortcutWrapper>
          )}
        </SearchWrapper>

        <ResultsPopper
          open={showResults}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          disablePortal
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                padding: 16,
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={150}>
              <Paper
                elevation={8}
                sx={{
                  mt: 1,
                  maxHeight: 400,
                  overflowY: 'auto',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                {isSearching ? (
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Searching...
                    </Typography>
                  </Box>
                ) : (
                  <List dense sx={{ py: 1 }}>
                    {Object.entries(groupedResults).map(([type, typeResults], groupIndex) => (
                      <React.Fragment key={type}>
                        {groupIndex > 0 && <Divider />}
                        
                        <ListItem sx={{ py: 0.5, px: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                            {type === 'ticket' ? 'Tickets' : 
                             type === 'article' ? 'Knowledge Base' :
                             type === 'user' ? 'Users' : 'Pages'}
                          </Typography>
                        </ListItem>
                        
                        {typeResults.map((result, index) => {
                          const globalIndex = results.indexOf(result);
                          return (
                            <ListItemButton
                              key={result.id}
                              selected={selectedIndex === globalIndex}
                              onClick={() => handleResultClick(result)}
                              sx={{ px: 2, py: 1 }}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getResultIcon(result.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {result.title}
                                    </Typography>
                                    {result.priority && (
                                      <Chip
                                        label={result.priority}
                                        size="small"
                                        color={result.priority === 'Urgent' ? 'error' : result.priority === 'High' ? 'warning' : 'default'}
                                        sx={{ height: 20, fontSize: '11px' }}
                                      />
                                    )}
                                    {result.status && (
                                      <Chip
                                        label={result.status}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '11px' }}
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={result.subtitle}
                                primaryTypographyProps={{
                                  sx: { lineHeight: 1.3 }
                                }}
                                secondaryTypographyProps={{
                                  sx: { 
                                    fontSize: '12px',
                                    lineHeight: 1.2,
                                    mt: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Fade>
          )}
        </ResultsPopper>
      </Box>
    </ClickAwayListener>
  );
}
