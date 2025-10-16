import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Typography
} from "@mui/material"
import {deleteUser, fetchUsers} from "../../api/usersApi.ts";
import {useCallback, useState} from "react";
import CreateUserModal from "../../components/pagesModal/usersModal/createUserModal.tsx";
import Swal from "sweetalert2";
import UpdateUserModal from "../../components/pagesModal/usersModal/updateUserModal.tsx";

const Users = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const {data: users = [], isLoading, isError} = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers
    })


    const {mutate} = useMutation({
        mutationKey: ["deleteUser"],
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
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "User could not be deleted.",
            });
        },
    });

    const handleDeleteUser = useCallback(
        (id: number) => {
            Swal.fire({
                title: "Are you sure?",
                text: "This user will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    mutate(id);
                }
            });
        },
        [mutate]
    );

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (isLoading) return <div>Загрузка...</div>
    if (isError) return <div>Ошибка при загрузке пользователей</div>

    return (
        <div className='space-y-5'>
            <Typography variant="h5" gutterBottom>Users list</Typography>
            <div className='flex justify-between items-center'>
                <TextField
                    id="standard-search"
                    label="Search"
                    type="search"
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Add User
                </Button>

            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button onClick={() => {
                                        setUserId(user.id);
                                        setUpdateOpen(true)
                                    }} variant="outlined" color="primary"
                                            size="small"
                                            style={{marginRight: 8}}>Edit</Button>
                                    <Button onClick={() => handleDeleteUser(user.id)} variant="outlined" color="error"
                                            size="small">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            <UpdateUserModal id={userId} open={updateOpen} onClose={() => setUpdateOpen(false)}/>
            <CreateUserModal open={open} onClose={() => setOpen(false)}/>

        </div>
    )
}

export default Users
