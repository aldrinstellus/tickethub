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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { tickets, articles, generateAiResponse } from "../data/mockData";

export default function TicketWorkspace() {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id) ?? tickets[0];
  const [draft, setDraft] = React.useState("");
  const related = articles.filter((a) => a.tags.some((t) => ticket.tags.includes(t)));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [kbOpen, setKbOpen] = React.useState(false);

  const handleGenerate = () => {
    const ai = generateAiResponse(`${ticket.subject} ${ticket.body}`, related);
    setDraft(ai);
  };

  const RightColumn = (
    <>
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
              <Button key={m} size="small" variant="text" onClick={() => setDraft((d) => (d ? `${d}\n\n${m}` : m))} sx={{ justifyContent: "flex-start", minHeight: 44 }}>
                {m}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );

  return (
    <Box sx={{ width: "100%" }}>
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
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Reply</Typography>
                {isMobile && (
                  <Button size="small" onClick={() => setKbOpen(true)} sx={{ minHeight: 44 }}>Open KB</Button>
                )}
              </Stack>
              <Stack spacing={1}>
                <TextField multiline minRows={4} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write your reply..." fullWidth sx={{ '& .MuiInputBase-input': { minHeight: 44 } }} />
                <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<AutoAwesomeRoundedIcon />} onClick={handleGenerate} sx={{ minHeight: 44 }}>
                      Generate with AI
                    </Button>
                    <Button variant="outlined" startIcon={<MenuBookRoundedIcon />} onClick={() => setDraft((d) => `${d}\n\n${related[0]?.content ?? ""}`)} sx={{ minHeight: 44 }}>
                      Insert KB
                    </Button>
                  </Stack>
                  <Button variant="contained" endIcon={<SendRoundedIcon />} sx={{ minHeight: 44 }}>Send</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={4}>
            {RightColumn}
          </Grid>
        )}
      </Grid>

      <Dialog fullScreen={false} open={kbOpen} onClose={() => setKbOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Knowledge Base
          <IconButton aria-label="close" onClick={() => setKbOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {RightColumn}
        </DialogContent>
      </Dialog>
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
