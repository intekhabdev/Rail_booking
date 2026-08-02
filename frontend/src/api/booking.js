import API from "./api";

export const bookTicket = (data) =>
  API.post("/bookings", data, {
    withCredentials: true,
  });

export const cancelTicket = (id) => API.put(`/bookings/${id}/cancel`);

export const getMyBookings = () => API.get("/bookings/my");
