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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
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

  // Load tickets on mount
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTickets().then((data) => {
      if (!mounted) return;
      // Ensure data is always an array with valid tickets
      const validTickets = Array.isArray(data) ? data.filter(ticket =>
        ticket && typeof ticket === 'object' && ticket.id && ticket.subject
      ) : [];
      setAllRows(validTickets);
      setFilteredRows(validTickets);
    }).catch((err) => {
      console.error("Failed to load tickets:", err);
      if (mounted) {
        setAllRows([]);
        setFilteredRows([]);
      }
    }).finally(() => {
      if (mounted) setLoading(false);
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
        ticket.id.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.customer.toLowerCase().includes(searchTerm)
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
        const ticketDate = dayjs(ticket.updatedAt);
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
    <Box sx={{ width: "100%" }}>
      <PageHeader title="Tickets" />
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box sx={{ height: 560, minWidth: 800 }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Box>
          ) : (
            <DataGrid
              density="compact"
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              onRowClick={(params) => navigate(`/tickets/${params.id}`)}
            />
          )}
        </Box>
      </Box>
    </Box>
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
