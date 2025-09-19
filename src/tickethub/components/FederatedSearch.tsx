import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import { styled, alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { searchService, SearchResult, SearchResults } from "../services/searchService";
import { useSearch } from "../contexts/SearchContext";

const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  borderRadius: theme.spacing(2),
  overflow: 'auto',
  boxShadow: theme.shadows[24],
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  outline: 'none',
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const SearchIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  color: theme.palette.text.secondary,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: '16px',
  fontWeight: 400,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 0),
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.8,
    },
  },
}));

const EscButton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.common.black, 0.06),
  border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
  borderRadius: theme.spacing(0.5),
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    borderColor: alpha(theme.palette.common.white, 0.2),
  }),
}));

const ResultsContainer = styled(Box)({
  maxHeight: '400px',
  overflowY: 'auto',
});

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2, 0.5, 2),
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LoadingState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
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

const getSectionTitle = (type: string) => {
  switch (type) {
    case 'tickets':
      return 'Tickets';
    case 'articles':
      return 'Knowledge Base';
    case 'users':
      return 'Team Members';
    case 'pages':
      return 'Pages';
    default:
      return type;
  }
};

export default function FederatedSearch() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>({
    tickets: [],
    articles: [],
    pages: [],
    users: [],
  });
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  
  const { isSearchOpen, closeSearch } = useSearch();
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Focus input when modal opens
  React.useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Get all results as flat array for navigation
  const allResults = React.useMemo(() => {
    return [
      ...results.tickets,
      ...results.articles,
      ...results.pages,
      ...results.users,
    ];
  }, [results]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            handleResultClick(allResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedIndex, allResults]);

  // Search function with debouncing
  const performSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({
        tickets: [],
        articles: [],
        pages: [],
        users: [],
      });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchService.search(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Federated search error:', error);
      setResults({
        tickets: [],
        articles: [],
        pages: [],
        users: [],
      });
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    closeSearch();
    setQuery("");
    setResults({
      tickets: [],
      articles: [],
      pages: [],
      users: [],
    });
    setSelectedIndex(-1);
    
    if (result.url && result.url !== '#') {
      navigate(result.url);
    }
  };

  // Handle modal close
  const handleClose = () => {
    closeSearch();
    setQuery("");
    setSelectedIndex(-1);
  };

  // Check if we have any results
  const hasResults = allResults.length > 0;
  const showEmptyState = query.trim().length > 0 && !isSearching && !hasResults;

  return (
    <ModalContainer
      open={isSearchOpen}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={isSearchOpen} timeout={200}>
        <SearchContainer>
          {/* Search Header */}
          <SearchHeader>
            <SearchIcon>
              <SearchRoundedIcon fontSize="small" />
            </SearchIcon>
            <SearchInput
              ref={inputRef}
              placeholder="Search tickets, articles, pages, team members..."
              value={query}
              onChange={handleInputChange}
              fullWidth
            />
            <EscButton>ESC</EscButton>
          </SearchHeader>

          {/* Search Results */}
          <ResultsContainer>
            {isSearching && (
              <LoadingState>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Searching...
                </Typography>
              </LoadingState>
            )}

            {showEmptyState && (
              <EmptyState>
                <Typography variant="body2" color="text.secondary">
                  No results found for "{query}"
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Try searching for tickets, articles, or team members
                </Typography>
              </EmptyState>
            )}

            {hasResults && !isSearching && (
              <List dense sx={{ py: 1 }}>
                {Object.entries(results).map(([type, typeResults]) => {
                  if (typeResults.length === 0) return null;
                  
                  return (
                    <React.Fragment key={type}>
                      <SectionHeader>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                        >
                          {getSectionTitle(type)}
                        </Typography>
                      </SectionHeader>
                      
                      {typeResults.map((result, index) => {
                        const globalIndex = allResults.indexOf(result);
                        return (
                          <ListItemButton
                            key={`${type}-${result.id}`}
                            selected={selectedIndex === globalIndex}
                            onClick={() => handleResultClick(result)}
                            sx={{ 
                              px: 2, 
                              py: 1,
                              mx: 1,
                              borderRadius: 1,
                              '&.Mui-selected': {
                                backgroundColor: 'action.selected',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {getResultIcon(result.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {result.title}
                                  </Typography>
                                  {result.priority && (
                                    <Chip
                                      label={result.priority}
                                      size="small"
                                      color={result.priority === 'Urgent' ? 'error' : result.priority === 'High' ? 'warning' : 'default'}
                                      sx={{ height: 18, fontSize: '10px' }}
                                    />
                                  )}
                                  {result.status && (
                                    <Chip
                                      label={result.status}
                                      size="small"
                                      variant="outlined"
                                      sx={{ height: 18, fontSize: '10px' }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={result.subtitle}
                              primaryTypographyProps={{
                                component: 'div',
                                sx: { lineHeight: 1.2 }
                              }}
                              secondaryTypographyProps={{
                                sx: {
                                  fontSize: '12px',
                                  lineHeight: 1.3,
                                  color: 'text.secondary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                      
                      {/* Add divider between sections except for the last one */}
                      {Object.entries(results).findIndex(([t]) => t === type) < 
                       Object.entries(results).filter(([, r]) => r.length > 0).length - 1 && (
                        <Divider sx={{ my: 1, mx: 2 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            )}

            {/* Default state when no query */}
            {!query.trim() && !isSearching && (
              <EmptyState>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Start typing to search across all content
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Search tickets, knowledge base, team members, and pages
                </Typography>
              </EmptyState>
            )}
          </ResultsContainer>
        </SearchContainer>
      </Fade>
    </ModalContainer>
  );
}
