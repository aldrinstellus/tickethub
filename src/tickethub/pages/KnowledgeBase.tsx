import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { Article } from "../data/mockData";
import { fetchArticles } from "../services/api";
import PageHeader from "../components/PageHeader";

export default function KnowledgeBase() {
  const [query, setQuery] = React.useState("");
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchArticles().then((data) => {
      if (!mounted) return;
      // Ensure data is always an array with valid articles
      const validArticles = Array.isArray(data) ? data.filter(article =>
        article && typeof article === 'object' && article.title && article.content
      ) : [];
      setArticles(validArticles);
    }).catch((err) => {
      console.error("Failed to load articles:", err);
      if (mounted) {
        // Set empty array on error to prevent crashes
        setArticles([]);
      }
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Extract all unique categories from articles
  const allCategories = React.useMemo(() => {
    const categories = new Set<string>();
    articles.forEach((article) => {
      article.tags?.forEach((tag) => categories.add(tag));
    });
    return Array.from(categories).sort();
  }, [articles]);

  // Get category counts
  const categoryCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    articles.forEach((article) => {
      article.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [articles]);

  // Filter articles based on search query and selected categories
  const filtered = React.useMemo(() => {
    return articles.filter((article) => {
      // Text search filter
      const matchesQuery = query === "" ||
        article?.title?.toLowerCase().includes(query.toLowerCase()) ||
        article?.content?.toLowerCase().includes(query.toLowerCase());

      // Category filter
      const matchesCategories = selectedCategories.length === 0 ||
        selectedCategories.some(category => article.tags?.includes(category));

      return matchesQuery && matchesCategories;
    });
  }, [articles, query, selectedCategories]);

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
  };

  // Get popular categories (top 6 by article count)
  const popularCategories = React.useMemo(() => {
    return allCategories
      .sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0))
      .slice(0, 6);
  }, [allCategories, categoryCounts]);

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <PageHeader title="Knowledge Base" />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
          <TextField size="small" placeholder="Search articles" disabled />
        </Stack>
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Card key={i} variant="outlined">
              <CardContent>
                <CircularProgress size={20} sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading articles...
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader title="Knowledge Base" />

      {/* Search and Filter Header */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                <Typography variant="body2" color="text.secondary">
                  {filtered.length} of {articles.length} articles
                </Typography>
                {(selectedCategories.length > 0 || query) && (
                  <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    variant="outlined"
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <FilterListIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Popular Categories
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {popularCategories.map((category) => (
                <Chip
                  key={category}
                  label={`${category} (${categoryCounts[category]})`}
                  onClick={() => handleCategoryToggle(category)}
                  color={selectedCategories.includes(category) ? "primary" : "default"}
                  variant={selectedCategories.includes(category) ? "filled" : "outlined"}
                  clickable
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* All Categories */}
      {allCategories.length > popularCategories.length && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              All Categories
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {allCategories.map((category) => (
                <Chip
                  key={category}
                  label={`${category} (${categoryCounts[category]})`}
                  onClick={() => handleCategoryToggle(category)}
                  size="small"
                  color={selectedCategories.includes(category) ? "primary" : "default"}
                  variant={selectedCategories.includes(category) ? "filled" : "outlined"}
                  clickable
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {selectedCategories.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onDelete={() => handleCategoryToggle(category)}
                color="primary"
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Articles List */}
      <Stack spacing={2}>
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <Card key={article.id} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.content}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {article.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      size="small"
                      label={tag}
                      variant="outlined"
                      clickable
                      onClick={() => handleCategoryToggle(tag)}
                      color={selectedCategories.includes(tag) ? "primary" : "default"}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No articles found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {query || selectedCategories.length > 0
                  ? "Try adjusting your search or filters"
                  : "No articles available"
                }
              </Typography>
              {(query || selectedCategories.length > 0) && (
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
