import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
} from "@mui/material";
import {type FC, useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { z } from "zod";

import { fetchProductById, updateProduct } from "../../../api/productsApi";
import { updateProductSchema } from "../../../validation/productSchema";

interface UpdateProductModalProps {
    id: number | null;
    open: boolean;
    onClose: () => void;
}

type FormValues = z.infer<typeof updateProductSchema>;

const UpdateProductModal: FC<UpdateProductModalProps> = ({ id, open, onClose }) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: "",
            price: 0,
            inStock: false,
        },
    });

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id!),
        enabled: !!id,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormValues) => updateProduct(id!, data),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Product updated",
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onClose();
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Failed to update product",
                text: "Something went wrong",
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        mutate(data);
    };

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                price: product.price,
                inStock: product.inStock,
            });
        }
    }, [product, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <div className="p-4 text-gray-500">Loading product data...</div>
                    ) : (
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
                                        control={<Switch {...field} checked={field.value} />}
                                        label="In stock"
                                    />
                                )}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isPending || isLoading}>
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateProductModal;
