import {useState, useCallback, useMemo} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Box, Button, TextField, Typography, Paper} from "@mui/material";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import Swal from "sweetalert2";
import {fetchUsers, deleteUser} from "../../api/usersApi";
import CreateUserModal from "../../components/pagesModal/usersModal/createUserModal";
import UpdateUserModal from "../../components/pagesModal/usersModal/updateUserModal";
import {getUserColumns} from "../../components/ui/tables/getUserColumns.tsx";

const Users = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const {data: users = [], isLoading, isError} = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const {mutate} = useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "User successfully deleted!",
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });

    const handleDeleteUser = useCallback(
        (id: number) => {
            Swal.fire({
                title: "Are you sure?",
                text: "This user will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) mutate(id);
            });
        },
        [mutate]
    );

    const handleEditUser = useCallback((id: number) => {
        setUserId(id);
        setUpdateOpen(true);
    }, []);

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.role.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [users, searchTerm]
    );

    const columns = getUserColumns({
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
    });

    if (isLoading) return <Typography>Загрузка...</Typography>;
    if (isError) return <Typography color="error">Ошибка загрузки пользователей</Typography>;

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h5" gutterBottom>
                Users List
            </Typography>

            <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                <TextField
                    label="Search"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add User
                </Button>
            </Box>

            <Paper sx={{height: 500}}>
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{pagination: {paginationModel: {pageSize: 5}}}}
                    disableRowSelectionOnClick
                    loading={isLoading}
                />
            </Paper>

            <UpdateUserModal id={userId} open={updateOpen} onClose={() => setUpdateOpen(false)}/>
            <CreateUserModal open={open} onClose={() => setOpen(false)}/>
        </Box>
    );
};

export default Users;
