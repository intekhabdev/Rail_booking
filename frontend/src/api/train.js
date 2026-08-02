import API from "./api";

export const getTrains = (params) => API.get("/trains", { params });

export const addTrain = (data) => API.post("/trains", data);

export const updateTrain = (id, data) => API.put(`/trains/${id}`, data);

export const deleteTrain = (id) => API.delete(`/trains/${id}`);
