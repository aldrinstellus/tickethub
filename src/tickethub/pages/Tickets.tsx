import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InputAdornment from '@mui/material/InputAdornment';
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Toolbar from "@mui/material/Toolbar";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import dayjs, { Dayjs } from "dayjs";
import { fetchTickets } from "../services/api";
import Skeleton from "@mui/material/Skeleton";
import PageHeader from "../components/PageHeader";

interface TicketFilters {
  search: string;
  priority: string;
  status: string;
  assignedTo: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const PRIORITY_OPTIONS = ['All', 'Critical', 'Urgent', 'High', 'Normal', 'Low'];
const STATUS_OPTIONS = ['All', 'New', 'Open', 'Pending Customer', 'Pending Internal', 'Resolved', 'Closed'];
const TEAM_MEMBERS = ['All', 'Me', 'Unassigned', 'Alex Thompson', 'Priya Patel', 'Marcus Johnson', 'Sarah Chen'];

export default function Tickets() {
  const navigate = useNavigate();
  const [allRows, setAllRows] = React.useState<any[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  const [filters, setFilters] = React.useState<TicketFilters>({
    search: '',
    priority: 'All',
    status: 'All',
    assignedTo: 'All',
    startDate: null,
    endDate: null,
  });

  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);
  const [bulkActionAnchor, setBulkActionAnchor] = React.useState<null | HTMLElement>(null);
  const [bulkAssignDialog, setBulkAssignDialog] = React.useState(false);
  const [bulkPriorityDialog, setBulkPriorityDialog] = React.useState(false);
  const [bulkStatusDialog, setBulkStatusDialog] = React.useState(false);
  const [bulkDeleteDialog, setBulkDeleteDialog] = React.useState(false);
  const [newAssignee, setNewAssignee] = React.useState('');
  const [newPriority, setNewPriority] = React.useState('');
  const [newStatus, setNewStatus] = React.useState('');
  const [bulkProcessing, setBulkProcessing] = React.useState(false);

  // Load tickets on mount
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchTickets()
      .then((data) => {
        if (!mounted) return;
        console.log("Tickets loaded:", data);

        // Ensure data is always an array with valid tickets
        const validTickets = Array.isArray(data) ? data.filter(ticket =>
          ticket &&
          typeof ticket === 'object' &&
          ticket.id &&
          ticket.subject
        ) : [];

        console.log(`Setting ${validTickets.length} valid tickets`);
        setAllRows(validTickets);
        setFilteredRows(validTickets);
      })
      .catch((err) => {
        console.error("Failed to load tickets:", err);
        if (mounted) {
          // Set empty arrays as fallback
          setAllRows([]);
          setFilteredRows([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  // Apply filters whenever filters change
  React.useEffect(() => {
    applyFilters();
  }, [filters, allRows]);

  // Filter application logic
  const applyFilters = () => {
    let filtered = [...allRows];
    const active: string[] = [];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.id || '').toString().toLowerCase().includes(searchTerm) ||
        (ticket.subject || '').toString().toLowerCase().includes(searchTerm) ||
        (ticket.customer || '').toString().toLowerCase().includes(searchTerm)
      );
      active.push(`Search: "${filters.search}"`);
    }

    // Priority filter
    if (filters.priority !== 'All') {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
      active.push(`Priority: ${filters.priority}`);
    }

    // Status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
      active.push(`Status: ${filters.status}`);
    }

    // Assigned to filter
    if (filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Me') {
        // In a real app, this would filter by current user
        filtered = filtered.filter(ticket => ticket.assignee === 'Alex Thompson'); // Mock current user
        active.push('Assigned: Me');
      } else if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(ticket => !ticket.assignee || ticket.assignee === 'Unassigned');
        active.push('Assigned: Unassigned');
      } else {
        filtered = filtered.filter(ticket => ticket.assignee === filters.assignedTo);
        active.push(`Assigned: ${filters.assignedTo}`);
      }
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(ticket => {
        const dateValue = ticket.updatedAt || ticket.created_at || ticket.updatedAt;
        if (!dateValue) return false;
        const ticketDate = dayjs(dateValue);
        if (!ticketDate.isValid()) return false;
        const afterStart = !filters.startDate || ticketDate.isAfter(filters.startDate);
        const beforeEnd = !filters.endDate || ticketDate.isBefore(filters.endDate.add(1, 'day'));
        return afterStart && beforeEnd;
      });

      if (filters.startDate && filters.endDate) {
        active.push(`Date: ${filters.startDate.format('MMM D')} - ${filters.endDate.format('MMM D')}`);
      } else if (filters.startDate) {
        active.push(`After: ${filters.startDate.format('MMM D, YYYY')}`);
      } else if (filters.endDate) {
        active.push(`Before: ${filters.endDate.format('MMM D, YYYY')}`);
      }
    }

    setFilteredRows(filtered);
    setActiveFilters(active);
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof TicketFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      priority: 'All',
      status: 'All',
      assignedTo: 'All',
      startDate: null,
      endDate: null,
    });
    setShowAdvancedFilters(false);
  };

  // Remove specific filter
  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('Search:')) {
      handleFilterChange('search', '');
    } else if (filterText.startsWith('Priority:')) {
      handleFilterChange('priority', 'All');
    } else if (filterText.startsWith('Status:')) {
      handleFilterChange('status', 'All');
    } else if (filterText.startsWith('Assigned:')) {
      handleFilterChange('assignedTo', 'All');
    } else if (filterText.startsWith('Date:') || filterText.startsWith('After:') || filterText.startsWith('Before:')) {
      handleFilterChange('startDate', null);
      handleFilterChange('endDate', null);
    }
  };

  // Bulk action handlers
  const handleBulkMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setBulkActionAnchor(event.currentTarget);
  };

  const handleBulkMenuClose = () => {
    setBulkActionAnchor(null);
  };

  const handleBulkAssign = async () => {
    if (!newAssignee) return;

    setBulkProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update tickets in state
      const updatedRows = allRows.map(ticket =>
        selectedRows.includes(ticket.id)
          ? { ...ticket, assignee: newAssignee }
          : ticket
      );
      setAllRows(updatedRows);

      // Clear selection and close dialog
      setSelectedRows([]);
      setBulkAssignDialog(false);
      setNewAssignee('');
    } catch (error) {
      console.error('Failed to bulk assign:', error);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkPriority = async () => {
    if (!newPriority) return;

    setBulkProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRows = allRows.map(ticket =>
        selectedRows.includes(ticket.id)
          ? { ...ticket, priority: newPriority }
          : ticket
      );
      setAllRows(updatedRows);

      setSelectedRows([]);
      setBulkPriorityDialog(false);
      setNewPriority('');
    } catch (error) {
      console.error('Failed to bulk update priority:', error);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkStatus = async () => {
    if (!newStatus) return;

    setBulkProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRows = allRows.map(ticket =>
        selectedRows.includes(ticket.id)
          ? { ...ticket, status: newStatus }
          : ticket
      );
      setAllRows(updatedRows);

      setSelectedRows([]);
      setBulkStatusDialog(false);
      setNewStatus('');
    } catch (error) {
      console.error('Failed to bulk update status:', error);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRows = allRows.filter(ticket =>
        !selectedRows.includes(ticket.id)
      );
      setAllRows(updatedRows);

      setSelectedRows([]);
      setBulkDeleteDialog(false);
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    } finally {
      setBulkProcessing(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 110 },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 200 },
    { field: "customer", headerName: "Customer", width: 160 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => {
        const value = params?.value || "Normal";
        return <Chip size="small" label={value} color={priorityColor(value)} />;
      },
    },
    { field: "status", headerName: "Status", width: 130 },
    { field: "assignee", headerName: "Assignee", width: 160 },
    { field: "updatedAt", headerName: "Updated", width: 180, valueFormatter: (p) => {
      if (!p || !p.value) return "N/A";
      try {
        return new Date(p.value as string).toLocaleString();
      } catch (error) {
        return "Invalid Date";
      }
    }},
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        <PageHeader title="Tickets" />

        {/* Search and Basic Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Bar - full width */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Search tickets by ID, customer, or subject..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                variant="outlined"
              />
            </Grid>

            {/* Filters row - Material UI style, aligned to end on wide screens */}
            <Grid item xs={12}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="flex-end"
                sx={{ width: '100%' }}
              >
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={filters.priority}
                      label="Priority"
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      {PRIORITY_OPTIONS.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListRoundedIcon />}
                    endIcon={showAdvancedFilters ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    sx={{ minWidth: 140 }}
                  >
                    Advanced Filters
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Collapse in={showAdvancedFilters}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    value={filters.assignedTo}
                    label="Assigned To"
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                  >
                    {TEAM_MEMBERS.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Paper>

        {/* Active Filters and Results Count */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredRows.length} tickets found
          </Typography>

          {activeFilters.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {activeFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter}
                    size="small"
                    onDelete={() => removeFilter(filter)}
                    deleteIcon={<ClearRoundedIcon />}
                  />
                ))}
                <Button
                  size="small"
                  variant="text"
                  onClick={clearAllFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Clear All
                </Button>
              </Stack>
            </>
          )}
        </Stack>

        {/* Bulk Actions Toolbar */}
        <Fade in={selectedRows.length > 0}>
          <Paper sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flex: '1 1 100%' }}>
                {selectedRows.length} ticket{selectedRows.length !== 1 ? 's' : ''} selected
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  startIcon={<AssignmentIndIcon />}
                  onClick={() => setBulkAssignDialog(true)}
                  disabled={bulkProcessing}
                >
                  Assign
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PriorityHighIcon />}
                  onClick={() => setBulkPriorityDialog(true)}
                  disabled={bulkProcessing}
                >
                  Priority
                </Button>
                <Button
                  color="inherit"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => setBulkStatusDialog(true)}
                  disabled={bulkProcessing}
                >
                  Status
                </Button>
                <Button
                  color="inherit"
                  startIcon={<DeleteIcon />}
                  onClick={() => setBulkDeleteDialog(true)}
                  disabled={bulkProcessing}
                  sx={{ color: 'error.light' }}
                >
                  Delete
                </Button>
                <IconButton
                  color="inherit"
                  onClick={handleBulkMenuClick}
                  disabled={bulkProcessing}
                >
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </Paper>
        </Fade>

        {/* Tickets DataGrid */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ height: { xs: 400, sm: 500, md: 600 }, minWidth: 0, width: '100%' }}>
            {loading ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={500} />
              </Box>
            ) : (
              <DataGrid
                loading={loading}
                density="compact"
                rows={Array.isArray(filteredRows) ? filteredRows : []}
                columns={columns}
                getRowId={(row) => row.id}
                onRowClick={(params, event) => {
                  // Only navigate if not clicking on checkbox
                  if (!(event.target as HTMLElement).closest('.MuiCheckbox-root')) {
                    navigate(`/tickets/${params.id}`);
                  }
                }}
                checkboxSelection
                onSelectionModelChange={(newModel) => {
                  // Normalize selection model to array of ids
                  try {
                    const modelArray = Array.isArray(newModel) ? newModel : [newModel];
                    setSelectedRows(modelArray as any);
                  } catch (e) {
                    console.warn('Failed to update selection model', e);
                    setSelectedRows([]);
                  }
                }}
                pageSizeOptions={[25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                disableRowSelectionOnClick
              />
            )}
          </Box>
        </Box>

        {/* Bulk Actions Menu */}
        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={handleBulkMenuClose}
        >
          <MenuItem onClick={() => { setSelectedRows([]); handleBulkMenuClose(); }}>
            Clear Selection
          </MenuItem>
          <MenuItem onClick={() => {
            setSelectedRows(filteredRows.map(row => row.id));
            handleBulkMenuClose();
          }}>
            Select All ({filteredRows.length})
          </MenuItem>
        </Menu>

        {/* Bulk Assign Dialog */}
        <Dialog
          open={bulkAssignDialog}
          onClose={() => setBulkAssignDialog(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Assign Selected Tickets</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Assign {selectedRows.length} ticket{selectedRows.length !== 1 ? 's' : ''} to:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={newAssignee}
                label="Assignee"
                onChange={(e) => setNewAssignee(e.target.value)}
              >
                {TEAM_MEMBERS.filter(member => member !== 'All' && member !== 'Me').map(member => (
                  <MenuItem key={member} value={member}>{member}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkAssignDialog(false)} disabled={bulkProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkAssign}
              variant="contained"
              disabled={!newAssignee || bulkProcessing}
            >
              {bulkProcessing ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Priority Dialog */}
        <Dialog
          open={bulkPriorityDialog}
          onClose={() => setBulkPriorityDialog(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Change Priority</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Change priority for {selectedRows.length} ticket{selectedRows.length !== 1 ? 's' : ''} to:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newPriority}
                label="Priority"
                onChange={(e) => setNewPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.filter(priority => priority !== 'All').map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkPriorityDialog(false)} disabled={bulkProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkPriority}
              variant="contained"
              disabled={!newPriority || bulkProcessing}
            >
              {bulkProcessing ? 'Updating...' : 'Update Priority'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Status Dialog */}
        <Dialog
          open={bulkStatusDialog}
          onClose={() => setBulkStatusDialog(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Change Status</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Change status for {selectedRows.length} ticket{selectedRows.length !== 1 ? 's' : ''} to:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {STATUS_OPTIONS.filter(status => status !== 'All').map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkStatusDialog(false)} disabled={bulkProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkStatus}
              variant="contained"
              disabled={!newStatus || bulkProcessing}
            >
              {bulkProcessing ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Delete Dialog */}
        <Dialog
          open={bulkDeleteDialog}
          onClose={() => setBulkDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Delete Selected Tickets</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete {selectedRows.length} ticket{selectedRows.length !== 1 ? 's' : ''}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkDeleteDialog(false)} disabled={bulkProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkDelete}
              variant="contained"
              color="error"
              disabled={bulkProcessing}
            >
              {bulkProcessing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

function priorityColor(value: unknown) {
  switch (value) {
    case "Urgent":
      return "error" as const;
    case "High":
      return "warning" as const;
    case "Normal":
      return "default" as const;
    case "Low":
      return "success" as const;
    default:
      return "default" as const;
  }
}
