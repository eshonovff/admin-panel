import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Stack,
} from "@mui/material";
import {type FC, useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserById, updateUser } from "../../../api/usersApi.ts";
import {updateUserSchema} from "../../../validation/userSchema.ts";

interface UpdateUserModalProps {
    id: number | null;
    open: boolean;
    onClose: () => void;
}

type FormValues = z.infer<typeof updateUserSchema>;
const roles = ["admin", "manager", "user"];

const UpdateUserModal: FC<UpdateUserModalProps> = ({ id, open, onClose }) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: { name: "", email: "", role: "" },
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(id!)
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [user, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormValues) => updateUser(id!, data),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "User updated successfully ✅",
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            onClose();
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Something went wrong 😢",
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        mutate(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ fontWeight: 600 }}>Edit User</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <div className="p-4 text-gray-500">Loading user data...</div>
                    ) : (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        autoFocus
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="role"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        select
                                        label="Role"
                                        fullWidth
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    >
                                        {roles.map((r) => (
                                            <MenuItem key={r} value={r}>
                                                {r}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending || isLoading}
                    >
                        {isPending ? "Updating..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateUserModal;
