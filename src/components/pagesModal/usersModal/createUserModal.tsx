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
import { useForm, Controller } from "react-hook-form";
import type { z } from "zod";
import Swal from "sweetalert2";
import { createUserSchema } from "../../../validation/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../../api/usersApi.ts";

    interface CreateUserModalProps {
        open: boolean;
        onClose: () => void;
    }

type FormValues = z.infer<typeof createUserSchema>;

const roles = ["admin", "manager", "user"];

const CreateUserModal: FC<CreateUserModalProps> = ({ open, onClose }) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { name: "", email: "", role: "" },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "User created successfully",
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["users"] }); // ⟳ рӯйхатро навсозӣ мекунад
            reset();
            onClose();
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "User could not be created",
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        mutate(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ fontWeight: 600 }}>Add User</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        autoFocus
                        disabled={isPending}
                    >
                        {isPending ? "Adding..." : "Add User"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateUserModal;
