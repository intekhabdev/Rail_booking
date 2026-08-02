import API from "./api";
export const createOrder = (data) => API.post("/payments/create-order", data);
export const verifyPayment = (data) =>
  API.post("/payments/verify-payment", data);
