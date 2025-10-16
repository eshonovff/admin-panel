import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControlLabel,
    Switch,
    Stack,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import type { z } from "zod"
import Swal from "sweetalert2"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FC } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "../../../api/productsApi"
import { createProductSchema } from "../../../validation/productSchema"

interface CreateProductModalProps {
    open: boolean
    onClose: () => void
}

    type FormValues = z.infer<typeof createProductSchema>

const CreateProductModal: FC<CreateProductModalProps> = ({ open, onClose }) => {
    const queryClient = useQueryClient()
    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            price: 0,
            inStock: false,
        },
    });


    const { mutate, isPending } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Product created successfully",
                timer: 1500,
                showConfirmButton: false,
            })
            queryClient.invalidateQueries({ queryKey: ["products"] })
            reset()
            onClose()
        },
        onError: (error) => {
            console.error(error)
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "Product could not be created",
            })
        },
    })

    const onSubmit = (data: FormValues) => {
        mutate(data)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)} >
                <DialogTitle sx={{ fontWeight: 600 }}>Add Product</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Product Name"
                                    fullWidth
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    autoFocus
                                />
                            )}
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="inStock"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label="In stock"
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Product"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateProductModal
