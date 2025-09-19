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
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { articles, generateAiResponse, Ticket, Article } from "../data/mockData";
import { fetchTicketById, fetchArticles, updateTicketStatus, assignTicket, updateTicketPriority } from "../services/api";

export default function TicketWorkspace() {
  const { id } = useParams();
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState("");
  const [related, setRelated] = React.useState<Article[]>([]);
  const [updating, setUpdating] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [kbOpen, setKbOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadTicketData() {
      if (!id) return;

      setLoading(true);
      try {
        const [ticketData, articlesData] = await Promise.all([
          fetchTicketById(id),
          fetchArticles()
        ]);

        setTicket(ticketData);
        if (ticketData) {
          const relatedArticles = articlesData.filter((a) =>
            a.tags.some((t) => ticketData.tags.includes(t))
          );
          setRelated(relatedArticles);
        }
      } catch (err) {
        console.error("Failed to load ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTicketData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Ticket not found
        </Typography>
      </Box>
    );
  }

  const handleGenerate = () => {
    const ai = generateAiResponse(`${ticket.subject} ${ticket.body}`, related);
    setDraft(ai);
  };

  const handleStatusUpdate = async (newStatus: Ticket['status']) => {
    if (!ticket) return;

    setUpdating(true);
    try {
      const updated = await updateTicketStatus(ticket.id, newStatus);
      if (updated) {
        setTicket(updated);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignUpdate = async (newAssignee: string) => {
    if (!ticket) return;

    setUpdating(true);
    try {
      const updated = await assignTicket(ticket.id, newAssignee);
      if (updated) {
        setTicket(updated);
      }
    } catch (err) {
      console.error("Failed to assign ticket:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityUpdate = async (newPriority: Ticket['priority']) => {
    if (!ticket) return;

    setUpdating(true);
    try {
      const updated = await updateTicketPriority(ticket.id, newPriority);
      if (updated) {
        setTicket(updated);
      }
    } catch (err) {
      console.error("Failed to update priority:", err);
    } finally {
      setUpdating(false);
    }
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
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ mr: 1, flexGrow: 1 }}>
                  {ticket.subject}
                </Typography>
                <Chip size="small" label={ticket.priority} color={ticket.priority === "Urgent" ? "error" : ticket.priority === "High" ? "warning" : "default"} />
                <Chip size="small" label={ticket.status} />
              </Stack>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={updating}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={ticket.status}
                      label="Status"
                      onChange={(e) => handleStatusUpdate(e.target.value as Ticket['status'])}
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={updating}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={ticket.priority}
                      label="Priority"
                      onChange={(e) => handlePriorityUpdate(e.target.value as Ticket['priority'])}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={updating}>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={ticket.assignee}
                      label="Assignee"
                      onChange={(e) => handleAssignUpdate(e.target.value)}
                    >
                      <MenuItem value="Unassigned">Unassigned</MenuItem>
                      <MenuItem value="Alex Thompson">Alex Thompson</MenuItem>
                      <MenuItem value="Priya Patel">Priya Patel</MenuItem>
                      <MenuItem value="Marcus Johnson">Marcus Johnson</MenuItem>
                      <MenuItem value="Sarah Chen">Sarah Chen</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary">
                {ticket.customer} • Updated {new Date(ticket.updatedAt).toLocaleString()}
                {updating && <CircularProgress size={16} sx={{ ml: 1 }} />}
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
