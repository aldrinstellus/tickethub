import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tickets } from "../data/mockData";

export default function Tickets() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 110 },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 200 },
    { field: "customer", headerName: "Customer", width: 160 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => <Chip size="small" label={params.value} color={priorityColor(params.value)} />,
    },
    { field: "status", headerName: "Status", width: 130 },
    { field: "assignee", headerName: "Assignee", width: 160 },
    { field: "updatedAt", headerName: "Updated", width: 180, valueFormatter: (p) => new Date(p.value as string).toLocaleString() },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">All Tickets</Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />}>New Ticket</Button>
      </Stack>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box sx={{ height: 560, minWidth: 800 }}>
          <DataGrid
            density="compact"
            rows={tickets}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={(params) => navigate(`/tickets/${params.id}`)}
          />
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
