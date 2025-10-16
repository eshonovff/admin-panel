import {useCallback, useState} from "react"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TextField,
    Switch,
    Typography, Button
} from "@mui/material"
import {deleteProduct, fetchProducts} from "../../api/productsApi.ts";
import Swal from "sweetalert2";
import CreateProductModal from "../../components/pagesModal/productModal/createProductModal.tsx";
import UpdateProductModal from "../../components/pagesModal/productModal/updateProductModal.tsx";

const Products = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [productId, setProductId] = useState<number | null>(null);

    const {data: products = [], isLoading, isError} = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    })

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const {mutate} = useMutation({
        mutationKey: ["deleteProduct"],
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Product successfully deleted!",
                timer: 1500,
                showConfirmButton: false,
            });

            queryClient.invalidateQueries({queryKey: ["products"]});
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Product could not be deleted.",
            });
        },

    })

    const handleDeleteProduct = useCallback(
        (id: number) => {
            Swal.fire({
                title: "Are you sure?",
                text: "This product will be deleted!",
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
    )

    if (isLoading) return <div>Загрузка...</div>
    if (isError) return <div>Ошибка загрузки продуктов</div>

    return (
        <div className='space-y-5'>
            <Typography variant="h5" gutterBottom>Products list</Typography>
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
                    Add Product
                </Button>

            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>В наличии</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product, idx) => (
                            <TableRow key={product.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price} сомонӣ</TableCell>
                                <TableCell>
                                    <Switch checked={product.inStock} disabled/>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary"
                                            onClick={() => {
                                                setProductId(product.id)
                                                    setUpdateOpen(true)
                                            }}
                                            size="small"
                                            style={{marginRight: 8}}>Edit</Button>
                                    <Button onClick={() => handleDeleteProduct(product.id)} variant="outlined"
                                            color="error"
                                            size="small">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <UpdateProductModal id={productId} open={updateOpen} onClose={() => setUpdateOpen(false)}/>
            <CreateProductModal open={open} onClose={() => setOpen(false)}/>
        </div>
    )
}

export default Products
