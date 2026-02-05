import axios from "axios";

const api = axios.create({
  baseURL: "https://skishore.in/api",
});

/* =========================
   SERVICES
========================= */
export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

/* =========================
   CATEGORIES
========================= */
export const getNestedCategories = async () => {
  const res = await api.get("/categories/nested");
  return res.data;
};
