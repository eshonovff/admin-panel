import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { fetchProducts, deleteProduct } from "../../api/productsApi";
import CreateProductModal from "../../components/pagesModal/productModal/createProductModal";
import UpdateProductModal from "../../components/pagesModal/productModal/updateProductModal";
import {getProductColumns} from "../../components/ui/tables/getProductColumns.tsx";

const Products = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [productId, setProductId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const { mutate } = useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Product successfully deleted!",
                timer: 1500,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const handleDeleteProduct = useCallback(
        (id: number) => {
            Swal.fire({
                title: "Are you sure?",
                text: "This product will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) mutate(id);
            });
        },
        [mutate]
    );

    const handleEditProduct = useCallback((id: number) => {
        setProductId(id);
        setUpdateOpen(true);
    }, []);

    const filteredProducts = useMemo(
        () =>
            products.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [products, searchTerm]
    );

    const columns = getProductColumns({
        onEdit: handleEditProduct,
        onDelete: handleDeleteProduct,
    });

    if (isLoading) return <Typography>Загрузка...</Typography>;
    if (isError) return <Typography color="error">Ошибка загрузки продуктов</Typography>;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Products list
            </Typography>

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add Product
                </Button>
            </Stack>

            <Paper sx={{ height: 500 }}>
                <DataGrid
                    rows={filteredProducts}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    disableRowSelectionOnClick
                    loading={isLoading}
                />
            </Paper>

            <UpdateProductModal id={productId} open={updateOpen} onClose={() => setUpdateOpen(false)} />
            <CreateProductModal open={open} onClose={() => setOpen(false)} />
        </Box>
    );
};

export default Products;
