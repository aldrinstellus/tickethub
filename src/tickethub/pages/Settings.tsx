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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import WorkspaceIcon from "@mui/icons-material/Workspaces";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import PageHeader from "../components/PageHeader";
import { getDummyAvatarUrl } from "../components/UserProfileDropdown";

interface SettingsData {
  // Workspace settings
  workspaceName: string;
  adminEmail: string;
  timezone: string;
  defaultSignature: string;

  // Notification settings
  emailNotifications: boolean;
  slackNotifications: boolean;
  pushNotifications: boolean;
  escalationNotifications: boolean;

  // Security settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  allowTeamAccess: boolean;

  // Team settings
  autoAssignTickets: boolean;
  roundRobinAssignment: boolean;
  workingHours: string;

  // Integration settings
  slackConnected: boolean;
  zendeskSync: boolean;
  salesforceIntegration: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SETTINGS_STORAGE_KEY = 'tickethub-settings';

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [settings, setSettings] = React.useState<SettingsData>({
    // Workspace settings
    workspaceName: "TicketHub",
    adminEmail: "",
    timezone: "UTC",
    defaultSignature: "Best regards,\nTicketHub Support Team",

    // Notification settings
    emailNotifications: true,
    slackNotifications: false,
    pushNotifications: true,
    escalationNotifications: true,

    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 480, // 8 hours in minutes
    allowTeamAccess: true,

    // Team settings
    autoAssignTickets: true,
    roundRobinAssignment: false,
    workingHours: "9:00 AM - 5:00 PM",

    // Integration settings
    slackConnected: false,
    zendeskSync: false,
    salesforceIntegration: false,
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

      {/* Error Display */}
      {saveError && (
        <Alert severity="error" onClose={() => setSaveError("")} sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="settings tabs"
        >
          <Tab icon={<WorkspaceIcon />} label="Workspace" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<PeopleIcon />} label="Team" />
          <Tab icon={<IntegrationInstructionsIcon />} label="Integrations" />
        </Tabs>
      </Box>

      {/* Workspace Settings Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Workspace Configuration</Typography>
            <Stack spacing={3}>
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
            </Stack>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Email Notifications</Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="New ticket notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.escalationNotifications}
                        onChange={(e) => handleChange('escalationNotifications', e.target.checked)}
                      />
                    }
                    label="Escalation alerts"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Other Notifications</Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.slackNotifications}
                        onChange={(e) => handleChange('slackNotifications', e.target.checked)}
                      />
                    }
                    label="Slack notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Browser push notifications"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Authentication</Typography>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-factor authentication (2FA)"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Session Timeout</InputLabel>
                    <Select
                      value={settings.sessionTimeout}
                      label="Session Timeout"
                      onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                    >
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={240}>4 hours</MenuItem>
                      <MenuItem value={480}>8 hours</MenuItem>
                      <MenuItem value={720}>12 hours</MenuItem>
                      <MenuItem value={1440}>24 hours</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Access Control</Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowTeamAccess}
                        onChange={(e) => handleChange('allowTeamAccess', e.target.checked)}
                      />
                    }
                    label="Allow team member access"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Team Tab */}
      <TabPanel value={activeTab} index={3}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Team Configuration</Typography>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAssignTickets}
                    onChange={(e) => handleChange('autoAssignTickets', e.target.checked)}
                  />
                }
                label="Auto-assign new tickets"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.roundRobinAssignment}
                    onChange={(e) => handleChange('roundRobinAssignment', e.target.checked)}
                  />
                }
                label="Round-robin assignment"
              />

              <TextField
                label="Working Hours"
                value={settings.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                helperText="Default working hours for the team"
                placeholder="9:00 AM - 5:00 PM"
              />

              <Divider />

              <Typography variant="subtitle1">Team Members</Typography>
              <Stack spacing={2}>
                {['Alex Thompson', 'Priya Patel', 'Marcus Johnson', 'Sarah Chen'].map((member, index) => (
                  <Box key={member} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {member.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{member}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Support Agent
                      </Typography>
                    </Box>
                    <Chip size="small" label="Active" color="success" />
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Integrations Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Slack</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Connect with Slack for real-time notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.slackConnected}
                      onChange={(e) => handleChange('slackConnected', e.target.checked)}
                    />
                  }
                  label="Enable Slack integration"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Zendesk</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Sync tickets with your Zendesk instance
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.zendeskSync}
                      onChange={(e) => handleChange('zendeskSync', e.target.checked)}
                    />
                  }
                  label="Enable Zendesk sync"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Salesforce</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Connect with Salesforce CRM
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.salesforceIntegration}
                      onChange={(e) => handleChange('salesforceIntegration', e.target.checked)}
                    />
                  }
                  label="Enable Salesforce integration"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Floating Action Buttons */}
      <Box sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        gap: 2,
        zIndex: 1000
      }}>
        {hasChanges && (
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset Changes
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges || isSaving || Object.keys(errors).some(key => errors[key])}
          startIcon={isSaving ? <CircularProgress size={20} /> : undefined}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Change Indicator */}
      {hasChanges && (
        <Alert severity="info" sx={{ position: 'fixed', bottom: 100, right: 24, zIndex: 1000 }}>
          You have unsaved changes.
        </Alert>
      )}

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
