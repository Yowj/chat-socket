import { axiosInstance } from "../axios";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async ({ id, data }) => {
  const response = await axiosInstance.put(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/user/search?q=${encodeURIComponent(query)}`);
  return response.data;
};