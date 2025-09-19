import * as React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import { useTicketCreation } from "../contexts/TicketCreationContext";
import { 
  createTicket, 
  checkCustomerExists, 
  getTeamMembers, 
  getTicketCategories, 
  validateEmail,
  type NewTicketData 
} from "../services/ticketCreationService";

const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const ModalPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[24],
  outline: 'none',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

interface TeamMember {
  id: string;
  name: string;
  email: string;
  available: boolean;
}

export default function NewTicketModal() {
  const { isNewTicketModalOpen, closeNewTicketModal } = useTicketCreation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = React.useState<NewTicketData>({
    customerEmail: '',
    customerName: '',
    customerCompany: '',
    customerPhone: '',
    subject: '',
    description: '',
    priority: 'Normal',
    category: '',
    assignedTo: '',
    tags: [],
  });

  // UI state
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCheckingCustomer, setIsCheckingCustomer] = React.useState(false);
  const [customerExists, setCustomerExists] = React.useState(false);
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string>('');

  // Load team members and categories
  React.useEffect(() => {
    if (isNewTicketModalOpen) {
      loadTeamMembers();
    }
  }, [isNewTicketModalOpen]);

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  // Check customer when email changes
  React.useEffect(() => {
    const checkCustomer = async () => {
      if (formData.customerEmail && validateEmail(formData.customerEmail)) {
        setIsCheckingCustomer(true);
        try {
          const result = await checkCustomerExists(formData.customerEmail);
          setCustomerExists(result.exists);
          
          if (result.exists && result.customerData) {
            setFormData(prev => ({
              ...prev,
              customerName: result.customerData!.name,
              customerCompany: result.customerData!.company,
              customerPhone: result.customerData!.phone || '',
            }));
          }
        } catch (error) {
          console.error('Failed to check customer:', error);
        } finally {
          setIsCheckingCustomer(false);
        }
      }
    };

    const timeoutId = setTimeout(checkCustomer, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.customerEmail]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const createdTicket = await createTicket(formData);
      
      // Success! Close modal and navigate to ticket
      closeNewTicketModal();
      resetForm();
      navigate(`/tickets/${createdTicket.id}`);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      customerEmail: '',
      customerName: '',
      customerCompany: '',
      customerPhone: '',
      subject: '',
      description: '',
      priority: 'Normal',
      category: '',
      assignedTo: '',
      tags: [],
    });
    setErrors({});
    setSubmitError('');
    setShowAdvancedOptions(false);
    setCustomerExists(false);
  };

  const handleClose = () => {
    closeNewTicketModal();
    resetForm();
  };

  // Update form field
  const updateField = (field: keyof NewTicketData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categories = getTicketCategories();
  const isFormValid = formData.customerEmail && formData.subject && formData.description;

  return (
    <ModalContainer
      open={isNewTicketModalOpen}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={isNewTicketModalOpen} timeout={200}>
        <ModalPaper>
          {/* Header */}
          <ModalHeader>
            <Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Create New Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Report an issue or request assistance
              </Typography>
            </Box>
            <IconButton onClick={handleClose} aria-label="Close">
              <CloseRoundedIcon />
            </IconButton>
          </ModalHeader>

          {/* Content */}
          <ModalContent>
            <Stack spacing={3}>
              {/* Customer Information */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonRoundedIcon fontSize="small" />
                  Customer Information
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      label="Customer Email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      error={!!errors.customerEmail}
                      helperText={errors.customerEmail || (customerExists ? 'Existing customer found' : '')}
                      required
                      InputProps={{
                        endAdornment: isCheckingCustomer ? (
                          <CircularProgress size={20} />
                        ) : undefined,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      disabled={customerExists}
                    />
                    <TextField
                      fullWidth
                      label="Company"
                      value={formData.customerCompany}
                      onChange={(e) => updateField('customerCompany', e.target.value)}
                      disabled={customerExists}
                      InputProps={{
                        startAdornment: <BusinessRoundedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.customerPhone}
                    onChange={(e) => updateField('customerPhone', e.target.value)}
                    disabled={customerExists}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Ticket Details */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Ticket Details
                </Typography>
                
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="Brief description of the issue or request"
                    required
                  />

                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => updateField('priority', e.target.value)}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Detailed description of the issue, steps to reproduce, or specific request..."
                    multiline
                    rows={4}
                    required
                  />
                </Stack>
              </Box>

              {/* Advanced Options */}
              <Box>
                <SectionHeader onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Advanced Options
                  </Typography>
                  {showAdvancedOptions ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                </SectionHeader>

                <Collapse in={showAdvancedOptions}>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        label="Category"
                        onChange={(e) => updateField('category', e.target.value)}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Assign To</InputLabel>
                      <Select
                        value={formData.assignedTo}
                        label="Assign To"
                        onChange={(e) => updateField('assignedTo', e.target.value)}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {teamMembers.map((member) => (
                          <MenuItem 
                            key={member.id} 
                            value={member.name}
                            disabled={!member.available}
                          >
                            {member.name} {!member.available && '(Unavailable)'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Autocomplete
                      multiple
                      options={['bug', 'feature', 'urgent', 'billing', 'technical', 'account']}
                      value={formData.tags || []}
                      onChange={(_, newTags) => updateField('tags', newTags)}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Add tags..."
                        />
                      )}
                    />
                  </Stack>
                </Collapse>
              </Box>

              {/* Error Display */}
              {submitError && (
                <Alert severity="error">
                  {submitError}
                </Alert>
              )}
            </Stack>
          </ModalContent>

          {/* Footer */}
          <ModalFooter>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
            >
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </ModalFooter>
        </ModalPaper>
      </Fade>
    </ModalContainer>
  );
}
