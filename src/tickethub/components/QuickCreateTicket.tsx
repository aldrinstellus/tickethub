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
import { tickets, Ticket } from "../data/mockData";

export default function QuickCreateTicket() {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [priority, setPriority] = React.useState<"Low" | "Normal" | "High" | "Urgent">("Normal");
  const [body, setBody] = React.useState("");
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

  function handleSubmit() {
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
    tickets.unshift(newTicket);
    setOpen(false);
    reset();
    navigate(`/support/tickets/${id}`);
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="New Ticket"
        sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 1400, minHeight: 56, minWidth: 56 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <TextField label="Subject" fullWidth margin="dense" value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ '& .MuiInputBase-input': { minHeight: 44 } }} />
          <TextField label="Customer" fullWidth margin="dense" value={customer} onChange={(e) => setCustomer(e.target.value)} sx={{ '& .MuiInputBase-input': { minHeight: 44 } }} />
          <TextField select label="Priority" fullWidth margin="dense" value={priority} onChange={(e) => setPriority(e.target.value as any)} sx={{ '& .MuiInputBase-input': { minHeight: 44 } }}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </TextField>
          <TextField label="Initial message" multiline fullWidth minRows={4} margin="dense" value={body} onChange={(e) => setBody(e.target.value)} sx={{ '& .MuiInputBase-input': { minHeight: 44 } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ minHeight: 44 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ minHeight: 44 }}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
