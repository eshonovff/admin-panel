import axios from 'axios'
import type {Product} from "../types/products.ts";

const API_URL = "http://localhost:3001/products";

export const fetchProducts = async ():Promise<Product[]> => {
    const { data } = await axios.get(API_URL)
    return data
}


export const fetchProductById = async (id: number): Promise<Product> => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};



export const createProduct = async (
    newUser: { name: string; price: number; inStock: boolean }
): Promise<Product> => {
    const { data } = await axios.post(API_URL, newUser);
    return data;
};



export const updateProduct = async (
    id: number,
    updatedProduct: { name: string; price: number; inStock: boolean }
): Promise<Product> => {
    const { data } = await axios.put(`${API_URL}/${id}`, updatedProduct);
    return data;
};
