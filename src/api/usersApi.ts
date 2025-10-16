import axios from "axios";
import type {User} from "../types/users.ts";
const API_URL = "http://localhost:3001/users";

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};


export const fetchUserById = async (id: number): Promise<User> => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};


export const createUser = async (
    newUser: { name: string; email: string; role: string }
): Promise<User> => {
  const { data } = await axios.post(API_URL, newUser);
  return data;
};


export const updateUser = async (
    id: number,
    updatedUser: { name: string; email: string; role: string }
): Promise<User> => {
  const { data } = await axios.put(`${API_URL}/${id}`, updatedUser);
  return data;
};


export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
