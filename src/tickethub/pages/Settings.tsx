import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const [name, setName] = React.useState("TicketHub");
  const [signature, setSignature] = React.useState("Best regards,\nTicketHub Support Team");
  const [email, setEmail] = React.useState("");
  const [timezone, setTimezone] = React.useState("UTC");
  const [notifications, setNotifications] = React.useState(true);
  const [emailError, setEmailError] = React.useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Simple email validation for testing
    if (value && !value.includes('@')) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader title="Settings" />
      <Stack spacing={3} sx={{ maxWidth: 720 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>Workspace Settings</Typography>

        <TextField
          label="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="The name of your support workspace"
        />

        <TextField
          label="Admin Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError || "Primary administrator email address"}
          placeholder="admin@company.com"
        />

        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={timezone}
            label="Timezone"
            onChange={(e) => setTimezone(e.target.value)}
          >
            <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
            <MenuItem value="EST">EST (Eastern Standard Time)</MenuItem>
            <MenuItem value="PST">PST (Pacific Standard Time)</MenuItem>
            <MenuItem value="GMT">GMT (Greenwich Mean Time)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Default Signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          multiline
          minRows={4}
          helperText="This signature will be added to all outgoing emails"
        />

        <Typography variant="h6" sx={{ mt: 3 }}>Notification Settings</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Email notifications for new tickets"
        />

        <TextField
          label="Disabled Field Example"
          value="This field is disabled"
          disabled
          helperText="This shows how disabled fields look"
        />

        <Button variant="contained" sx={{ mt: 3 }}>Save Changes</Button>
      </Stack>
    </Box>
  );
}
