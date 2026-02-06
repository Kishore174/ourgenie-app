import axios from "axios";

const api = axios.create({
  baseURL: "https://skishore.in/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const registerUser = async (name, email, password) => {
  const res = await api.post("/register", {
    name,
    email,
    password
  });
  return res.data;
};
 
export const loginUser = async (identifier, password) => {
  const res = await api.post("/login", {
    identifier,
    password
  });
  return res.data;
};
 export const createOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return res.data;
}
/* =========================
   SERVICES
========================= */
export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};
export const getOrdersByUser = async (userId) => {
  const res = await api.get(`/orders/user/${userId}`);
  return res.data;
};

/* =========================
   CATEGORIES
========================= */
export const getNestedCategories = async () => {
  const res = await api.get("/categories/nested");
  return res.data;
};

/* =========================
   TIME SLOTS (SCHEDULE)
========================= */
export const getTimeSlots = async () => {
  const res = await api.get("/timeslots");
  return res.data;
};

 