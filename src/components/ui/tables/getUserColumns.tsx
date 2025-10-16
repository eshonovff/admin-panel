import { Button, Stack } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

interface UserColumnsProps {
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const getUserColumns = ({ onEdit, onDelete }: UserColumnsProps): GridColDef[] => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Имя", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Роль", width: 130 },
    {
        field: "actions",
        headerName: "Действия",
        sortable: false,
        width: 200,
        renderCell: (params) => (
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => onEdit(params.row.id)}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => onDelete(params.row.id)}
                >
                    Delete
                </Button>
            </Stack>
        ),
    },
];
