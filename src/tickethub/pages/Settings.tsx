import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Settings() {
  const [name, setName] = React.useState("TicketHub AI");
  const [signature, setSignature] = React.useState("Best regards,\nTicketHub Support Team");

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Workspace Settings
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <TextField label="Workspace Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Default Signature" value={signature} onChange={(e) => setSignature(e.target.value)} multiline minRows={4} />
        <Button variant="contained">Save Changes</Button>
      </Stack>
    </Box>
  );
}
