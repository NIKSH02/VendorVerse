import api from "../api/axios";

export const addSupplierItem = async (formData) => {
  const response = await api.post("/supplier-listing/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};