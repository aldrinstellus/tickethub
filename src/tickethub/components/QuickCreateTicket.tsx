import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Ticket } from "../data/mockData";
import { createTicket } from "../services/api";

export default function QuickCreateTicket() {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [priority, setPriority] = React.useState<"Low" | "Normal" | "High" | "Urgent">("Normal");
  const [body, setBody] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-quick-create", handler as EventListener);
    return () => window.removeEventListener("open-quick-create", handler as EventListener);
  }, []);

  function reset() {
    setSubject("");
    setCustomer("");
    setPriority("Normal");
    setBody("");
  }

  async function handleSubmit() {
    setLoading(true);
    const id = `TH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      id,
      subject: subject || "New ticket",
      customer: customer || "Unknown",
      priority,
      status: "Open",
      assignee: "Unassigned",
      updatedAt: new Date().toISOString(),
      tags: [],
      body: body || "",
    };

    try {
      const created = await createTicket(newTicket);
      setOpen(false);
      reset();
      navigate(`/tickets/${created.id}`);
    } catch (err) {
      // best-effort: on failure navigate to local id
      setOpen(false);
      reset();
      navigate(`/tickets/${id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="New Ticket"
        className="quick-create-fab"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <TextField label="Subject" fullWidth margin="dense" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input-minheight" />
          <TextField label="Customer" fullWidth margin="dense" value={customer} onChange={(e) => setCustomer(e.target.value)} className="form-input-minheight" />
          <TextField select label="Priority" fullWidth margin="dense" value={priority} onChange={(e) => setPriority(e.target.value as any)} className="form-input-minheight">
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </TextField>
          <TextField label="Initial message" multiline fullWidth minRows={4} margin="dense" value={body} onChange={(e) => setBody(e.target.value)} className="form-input-minheight" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className="form-btn-minheight">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} className="form-btn-minheight">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
