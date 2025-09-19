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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedIcon from "@mui/icons-material/Verified";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FilterListIcon from "@mui/icons-material/FilterList";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { articles, generateAiResponse, Ticket, Article } from "../data/mockData";
import type { Message as TicketMessage } from "../data/mockData";
import { fetchTicketById, fetchArticles, fetchMessages, createMessage, updateTicketStatus, assignTicket, updateTicketPriority } from "../services/api";
import { useUser } from "../contexts/UserContext";
import PageHeader from "../components/PageHeader";

// SLA calculation function
function getSLATimeRemaining(createdAt: string, priority: string): string {
  const created = new Date(createdAt);
  const now = new Date();

  // SLA targets in hours
  const slaHours: Record<string, number> = {
    'Urgent': 2,
    'High': 8,
    'Normal': 24,
    'Low': 72
  };

  const targetHours = slaHours[priority] || 24;
  const targetTime = new Date(created.getTime() + targetHours * 60 * 60 * 1000);
  const remainingMs = targetTime.getTime() - now.getTime();

  if (remainingMs <= 0) {
    const overdue = Math.abs(remainingMs);
    const overdueHours = Math.floor(overdue / (1000 * 60 * 60));
    const overdueMinutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
    return `Overdue by ${overdueHours}h ${overdueMinutes}m`;
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

export default function TicketWorkspace() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState("");
  const [related, setRelated] = React.useState<Article[]>([]);
  const [updating, setUpdating] = React.useState(false);
  const [messages, setMessages] = React.useState<TicketMessage[]>([]);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [kbSearch, setKbSearch] = React.useState("");
  const [selectedKbCategory, setSelectedKbCategory] = React.useState("all");
  const [kbArticles, setKbArticles] = React.useState<Article[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [kbOpen, setKbOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadTicketData() {
      if (!id) return;

      setLoading(true);
      try {
        const [ticketData, articlesData, messagesData] = await Promise.all([
          fetchTicketById(id),
          fetchArticles(),
          fetchMessages(id)
        ]);

        setTicket(ticketData);
        setMessages(messagesData);
        setKbArticles(articlesData);

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

  // Filter knowledge base articles based on search and category
  const filteredKbArticles = React.useMemo(() => {
    let filtered = kbArticles;

    // Filter by search
    if (kbSearch.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
          article.content.toLowerCase().includes(kbSearch.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(kbSearch.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedKbCategory !== "all") {
      filtered = filtered.filter((article) =>
        article.tags.includes(selectedKbCategory)
      );
    }

    return filtered.slice(0, 10); // Limit to 10 results
  }, [kbArticles, kbSearch, selectedKbCategory]);

  const kbCategories = React.useMemo(() => {
    const categories = new Set<string>();
    kbArticles.forEach((article) => {
      article.tags.forEach((tag) => categories.add(tag));
    });
    return Array.from(categories);
  }, [kbArticles]);

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

  const handleSendMessage = async () => {
    if (!ticket || !draft.trim()) return;

    setSendingMessage(true);
    try {
      const newMessage = await createMessage({
        ticket_id: ticket.id,
        author: user?.name || "Unknown Agent",
        content: draft.trim(),
        is_agent: true,
      });

      setMessages(prev => [...prev, newMessage]);
      setDraft("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMessage(false);
    }
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
      {/* Custom Header with Back Button and SLA Timer */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/tickets')}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          Back to Tickets
        </Button>

        {/* Ticket Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            #{ticket?.id}: {ticket?.subject || `Ticket ${id}`}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {ticket && (
              <>
                <Chip
                  size="small"
                  label={ticket.priority}
                  color={ticket.priority === "Urgent" ? "error" : ticket.priority === "High" ? "warning" : "default"}
                />
                <Chip size="small" label={ticket.status} variant="outlined" />

                {/* SLA Timer */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" color="warning" />
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                    SLA: {getSLATimeRemaining(ticket.createdAt, ticket.priority)}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Box>

        {/* Action Buttons */}
        {ticket && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" disabled={updating}>
              Hold
            </Button>
            <Button variant="outlined" size="small" disabled={updating}>
              Reassign
            </Button>
            <Button variant="outlined" size="small" color="warning" disabled={updating}>
              Escalate
            </Button>
            <Button
              variant="contained"
              size="small"
              color="success"
              disabled={updating}
              onClick={() => handleStatusUpdate('Resolved')}
            >
              Close
            </Button>
          </Stack>
        )}
      </Stack>

      <Grid container spacing={2}>
        {/* Left Column - Customer Info & Ticket Details */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Customer Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {ticket.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Customer
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2">
                        {ticket.customer.toLowerCase().replace(' ', '.')}@company.com
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2">
                        +1 (555) 123-4567
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2">
                        TechCorp Inc.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Company
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedIcon fontSize="small" color="success" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Premium Plan
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Subscription Tier
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon fontSize="small" color="warning" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        4.8/5.0
                      </Typography>
                      <Stack direction="row" spacing={0.2}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            fontSize="small"
                            sx={{
                              fontSize: 14,
                              color: i < 5 ? 'warning.main' : 'grey.300'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', width: '100%' }}>
                      Customer Satisfaction
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBoxIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Active since Mar 2023
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Account Status
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        12 Total Tickets
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        8 Resolved, 3 Open, 1 Pending
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon fontSize="small" color="success" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Last Contact: 3 days ago
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Previous ticket resolved
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Recent Tickets
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          #1247: Login issue with SSO
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Resolved • 3 days ago
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          #1198: Data export feature request
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Resolved • 1 week ago
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          #1156: API rate limit question
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Resolved • 2 weeks ago
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                    onClick={() => {/* Navigate to customer tickets */}}
                  >
                    View All Customer Tickets
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Ticket Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Status
                    </Typography>
                    <FormControl fullWidth size="small" disabled={updating} sx={{ mt: 0.5 }}>
                      <Select
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(e.target.value as Ticket['status'])}
                        displayEmpty
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Priority
                    </Typography>
                    <FormControl fullWidth size="small" disabled={updating} sx={{ mt: 0.5 }}>
                      <Select
                        value={ticket.priority}
                        onChange={(e) => handlePriorityUpdate(e.target.value as Ticket['priority'])}
                        displayEmpty
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Normal">Normal</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Assignee
                    </Typography>
                    <FormControl fullWidth size="small" disabled={updating} sx={{ mt: 0.5 }}>
                      <Select
                        value={ticket.assignee}
                        onChange={(e) => handleAssignUpdate(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="Unassigned">Unassigned</MenuItem>
                        <MenuItem value="Alex Thompson">Alex Thompson</MenuItem>
                        <MenuItem value="Priya Patel">Priya Patel</MenuItem>
                        <MenuItem value="Marcus Johnson">Marcus Johnson</MenuItem>
                        <MenuItem value="Sarah Chen">Sarah Chen</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(ticket.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Updated: {new Date(ticket.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  {updating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption" color="text.secondary">
                        Updating...
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Middle Column - Conversation & Reply */}
        <Grid item xs={12} md={isMobile ? 12 : 6}>
          {isMobile && (
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
          )}

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Conversation
              </Typography>
              <Stack spacing={2}>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Message
                      key={message.id}
                      author={message.author}
                      time={message.created_at}
                      agent={message.is_agent}
                    >
                      {message.content}
                    </Message>
                  ))
                ) : (
                  <Message author={ticket.customer} time={ticket.updatedAt}>
                    {ticket.body}
                  </Message>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Reply</Typography>
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
                  <Button
                    variant="contained"
                    endIcon={<SendRoundedIcon />}
                    onClick={handleSendMessage}
                    disabled={!draft.trim() || sendingMessage}
                    sx={{ minHeight: 44 }}
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Knowledge Base & Tools */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
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
