import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetchTickets } from "../services/api";
import Skeleton from "@mui/material/Skeleton";

export default function Tickets() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTickets().then((data) => {
      if (!mounted) return;
      // Ensure data is always an array with valid tickets
      const validTickets = Array.isArray(data) ? data.filter(ticket =>
        ticket && typeof ticket === 'object' && ticket.id && ticket.subject
      ) : [];
      setRows(validTickets);
    }).catch((err) => {
      console.error("Failed to load tickets:", err);
      if (mounted) {
        // Set empty array on error to prevent crashes
        setRows([]);
      }
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">All Tickets</Typography>
      </Stack>
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
