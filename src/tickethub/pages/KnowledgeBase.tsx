import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { Article } from "../data/mockData";
import { fetchArticles } from "../services/api";

export default function KnowledgeBase() {
  const [query, setQuery] = React.useState("");
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchArticles().then((data) => {
      if (!mounted) return;
      setArticles(data);
    }).catch((err) => {
      console.error("Failed to load articles:", err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = articles.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">Knowledge Base</Typography>
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
