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
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
        <TextField size="small" placeholder="Search articles" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Stack>
      <Stack spacing={2}>
        {filtered.map((a) => (
          <Card key={a.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {a.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {a.content}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {a.tags.map((t) => (
                  <Chip key={t} size="small" label={t} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
