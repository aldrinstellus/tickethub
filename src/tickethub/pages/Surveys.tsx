import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Surveys() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Surveys</Typography>
        <Button variant="contained">Create Survey</Button>
      </Stack>

      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>In-ticket CSAT</Typography>
        <Typography variant="body2" color="text.secondary">Configure automated CSAT prompts to trigger after ticket resolution.</Typography>
      </Box>
    </Box>
  );
}
