import * as React from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { tickets, articles, generateAiResponse } from "../data/mockData";

export default function TicketWorkspace() {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id) ?? tickets[0];
  const [draft, setDraft] = React.useState("");
  const related = articles.filter((a) => a.tags.some((t) => ticket.tags.includes(t)));

  const handleGenerate = () => {
    const ai = generateAiResponse(`${ticket.subject} ${ticket.body}`, related);
    setDraft(ai);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <Typography variant="h6" component="h2" sx={{ mr: 1 }}>
                  {ticket.subject}
                </Typography>
                <Chip size="small" label={ticket.priority} color={ticket.priority === "Urgent" ? "error" : ticket.priority === "High" ? "warning" : "default"} />
                <Chip size="small" label={ticket.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {ticket.customer} • Assigned to {ticket.assignee} • Updated {new Date(ticket.updatedAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Conversation
              </Typography>
              <Stack spacing={2}>
                <Message author={ticket.customer} time={ticket.updatedAt}>
                  {ticket.body}
                </Message>
                <Message author={ticket.assignee} time={ticket.updatedAt} agent>
                  Thanks for reporting this. I'm checking the details and will follow up shortly.
                </Message>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Reply
              </Typography>
              <Stack spacing={1}>
                <TextField multiline minRows={4} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write your reply..." fullWidth />
                <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<AutoAwesomeRoundedIcon />} onClick={handleGenerate}>
                      Generate with AI
                    </Button>
                    <Button variant="outlined" startIcon={<MenuBookRoundedIcon />} onClick={() => setDraft((d) => `${d}\n\n${related[0]?.content ?? ""}`)}>
                      Insert KB
                    </Button>
                  </Stack>
                  <Button variant="contained" endIcon={<SendRoundedIcon />}>Send</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Suggested Articles
              </Typography>
              <Stack spacing={1}>
                {related.map((a) => (
                  <Box key={a.id} sx={{ p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.content}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {a.tags.map((t) => (
                        <Chip key={t} size="small" label={t} />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Macros
              </Typography>
              <Stack spacing={1}>
                {macroPresets.map((m) => (
                  <Button key={m} size="small" variant="text" onClick={() => setDraft((d) => (d ? `${d}\n\n${m}` : m))} sx={{ justifyContent: "flex-start" }}>
                    {m}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function Message({ author, time, children, agent }: { author: string; time: string; children: React.ReactNode; agent?: boolean }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: agent ? "action.hover" : "background.default", border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {author}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(time).toLocaleString()}
        </Typography>
      </Stack>
      <Typography variant="body2">{children}</Typography>
    </Box>
  );
}

const macroPresets = [
  "Thanks for your patience while we look into this.",
  "Could you share a short screen recording so we can reproduce the issue?",
  "We’ve resolved the incident and will continue to monitor.",
];
