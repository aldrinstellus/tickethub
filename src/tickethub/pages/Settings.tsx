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
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import PageHeader from "../components/PageHeader";

interface SettingsData {
  workspaceName: string;
  adminEmail: string;
  timezone: string;
  defaultSignature: string;
  emailNotifications: boolean;
}

const SETTINGS_STORAGE_KEY = 'tickethub-settings';

export default function Settings() {
  const [settings, setSettings] = React.useState<SettingsData>({
    workspaceName: "TicketHub",
    adminEmail: "",
    timezone: "UTC",
    defaultSignature: "Best regards,\nTicketHub Support Team",
    emailNotifications: true,
  });

  const [originalSettings, setOriginalSettings] = React.useState<SettingsData>(settings);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");

  // Load settings from localStorage on mount
  React.useEffect(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        setOriginalSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Email validation
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!settings.workspaceName.trim()) {
      newErrors.workspaceName = "Workspace name is required";
    }

    if (settings.adminEmail && !validateEmail(settings.adminEmail)) {
      newErrors.adminEmail = "Please enter a valid email address";
    }

    if (!settings.defaultSignature.trim()) {
      newErrors.defaultSignature = "Default signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes
  const handleChange = (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Save settings
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveError("");

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

      // Update original settings to reflect saved state
      setOriginalSettings(settings);

      // Show success message
      setSaveSuccess(true);

      console.log('Settings saved successfully:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setSettings(originalSettings);
    setErrors({});
  };

  // Check if form has changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader title="Settings" />
      <Stack spacing={3} sx={{ maxWidth: 720 }}>
        {/* Error Display */}
        {saveError && (
          <Alert severity="error" onClose={() => setSaveError("")}>
            {saveError}
          </Alert>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>Workspace Settings</Typography>

        <TextField
          label="Workspace Name"
          value={settings.workspaceName}
          onChange={(e) => handleChange('workspaceName', e.target.value)}
          error={!!errors.workspaceName}
          helperText={errors.workspaceName || "The name of your support workspace"}
          required
        />

        <TextField
          label="Admin Email"
          type="email"
          value={settings.adminEmail}
          onChange={(e) => handleChange('adminEmail', e.target.value)}
          error={!!errors.adminEmail}
          helperText={errors.adminEmail || "Primary administrator email address (optional)"}
          placeholder="admin@company.com"
        />

        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={settings.timezone}
            label="Timezone"
            onChange={(e) => handleChange('timezone', e.target.value)}
          >
            <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
            <MenuItem value="EST">EST (Eastern Standard Time)</MenuItem>
            <MenuItem value="PST">PST (Pacific Standard Time)</MenuItem>
            <MenuItem value="GMT">GMT (Greenwich Mean Time)</MenuItem>
            <MenuItem value="CST">CST (Central Standard Time)</MenuItem>
            <MenuItem value="MST">MST (Mountain Standard Time)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Default Signature"
          value={settings.defaultSignature}
          onChange={(e) => handleChange('defaultSignature', e.target.value)}
          error={!!errors.defaultSignature}
          helperText={errors.defaultSignature || "This signature will be added to all outgoing emails"}
          multiline
          minRows={4}
          required
        />

        <Typography variant="h6" sx={{ mt: 3 }}>Notification Settings</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
            />
          }
          label="Email notifications for new tickets"
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges || isSaving || Object.keys(errors).some(key => errors[key])}
            startIcon={isSaving ? <CircularProgress size={20} /> : undefined}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset Changes
          </Button>
        </Stack>

        {/* Display current state for testing */}
        {hasChanges && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You have unsaved changes. Click "Save Changes" to persist your settings.
          </Alert>
        )}
      </Stack>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={4000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSaveSuccess(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
