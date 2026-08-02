import { useEffect, useState } from "react";
import { getTrains, addTrain, updateTrain, deleteTrain } from "../api/train";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import TrainSkeleton from "../components/TrainSkeleton";
import { bookTicket } from "../api/booking";
import { createOrder, verifyPayment } from "../api/payment";

export default function Trains() {
  const [trains, setTrains] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [maxFare, setMaxFare] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [journeyDate, setJourneyDate] = useState({});
  const [form, setForm] = useState({
    trainNumber: "",
    trainName: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    totalSeats: "",
    availableSeats: "",
    fare: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrains();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, sourceFilter, destinationFilter, maxFare, page]);
  const fetchTrains = async () => {
    try {
      setLoading(true);

      const res = await getTrains({
        search,
        source: sourceFilter,
        destination: destinationFilter,
        maxFare,
        page,
      });

      setTrains(res.data.trains || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load trains ❌");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this train?",
    );

    if (!confirmDelete) return;

    try {
      await deleteTrain(id);
      setTrains(trains.filter((t) => t._id !== id));
      toast.success("Train deleted successfully 🚆");
    } catch (error) {
      toast.error("Something went wrong ❌");
    }
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = async () => {
    try {
      const res = await updateTrain(form._id, form);

      toast.success(res.data.message || "Train updated successfully ✏️");

      setOpen(false);
      fetchTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update train ❌");
    }
  };
  const handleSave = async () => {
    try {
      const cleanedData = {
        ...form,
        fare: Number(form.fare),
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
      };

      const res = await addTrain(cleanedData);

      toast.success(res.data.message || "Train added successfully 🚆");

      setOpen(false);
      fetchTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add train ❌");
    }
  };
  const openAddModal = () => {
    setEditMode(false);
    setForm({
      trainNumber: "",
      trainName: "",
      source: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      totalSeats: "",
      availableSeats: "",
      fare: "",
    });
    setOpen(true);
  };

  const openEditModal = (train) => {
    setEditMode(true);
    setForm(train);
    setOpen(true);
  };
  const openBookingModal = (train) => {
    setSelectedTrain(train);
    setSeatsBooked(1);
    setBookingOpen(true);
  };

  const handleBooking = async () => {
    try {
      const bookingRes = await bookTicket({
        trainId: selectedTrain._id,
        seatsBooked,
        journeyDate: journeyDate[selectedTrain._id],
      });

      const createdBooking = bookingRes.data.booking;

      const res = await createOrder({
        amount: selectedTrain.fare * seatsBooked,
      });

      const order = res.data.order;

      const options = {
        key: "ADD_YOU_RAZORPAY_KEY",
        amount: order.amount,
        currency: "INR",
        name: "RailBook",
        description: "Train Ticket Booking",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: createdBooking._id, // IMPORTANT
            });
            console.log("VERIFY RESPONSE:", verifyRes.data);
            if (verifyRes?.data?.success === true) {
              toast.success("Ticket Booked Successfully 🎟️");

              setBookingOpen(false);
              setSelectedTrain(null);
              setSeatsBooked(1);

              fetchTrains();
            } else {
              toast.error("Payment verification failed ❌");
            }
          } catch (error) {
            toast.error("Verification failed ❌");
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed ❌");
    }
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Available Trains 🚆
        </h2>

        {user?.role === "admin" && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Train
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search train / number"
          className="border p-2 rounded"
        />

        <input
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          placeholder="Source"
          className="border p-2 rounded"
        />

        <input
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          placeholder="Destination"
          className="border p-2 rounded"
        />

        <input
          value={maxFare}
          onChange={(e) => setMaxFare(e.target.value)}
          placeholder="Max Fare"
          type="number"
          className="border p-2 rounded"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <TrainSkeleton />
        ) : (
          trains.map((train) => (
            <div
              key={train._id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-blue-600">
                {train.trainName}
              </h3>

              <p className="text-gray-600 mt-1">
                {train.source} ➝ {train.destination}
              </p>

              <div className="mt-2 text-sm text-gray-500">
                <p>Train No: {train.trainNumber}</p>
                <p>Fare: ₹{train.fare}</p>
                <p>
                  <strong>Seats:</strong>{" "}
                  {train.availableSeats > 0
                    ? `${train.availableSeats}/${train.totalSeats}`
                    : `0/${train.totalSeats}`}
                </p>
                {user && user.role !== "admin" && (
                  <>
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-1">
                        Select Journey Date
                      </label>

                      <input
                        type="date"
                        value={journeyDate[train._id] || ""}
                        onChange={(e) =>
                          setJourneyDate({
                            ...journeyDate,
                            [train._id]: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>

                    {train.availableSeats > 0 ? (
                      <button
                        onClick={() => openBookingModal(train)}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Book Confirmed Ticket 🎟️
                      </button>
                    ) : train.availableSeats >= -20 ? (
                      <button
                        onClick={() => openBookingModal(train)}
                        className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Join RAC / Waitlist
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-3 w-full bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                      >
                        Booking Closed 🚫
                      </button>
                    )}
                  </>
                )}
              </div>

              {user?.role === "admin" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => openEditModal(train)}
                    className="text-green-600 flex items-center gap-1"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(train._id)}
                    disabled={train.hasBookings}
                    className={`flex items-center gap-2 text-red-600 hover:text-red-800 ${
                      train.hasBookings ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Train" : "Add Train"}
            </h2>

            <div className="grid gap-2">
              <input
                name="trainNumber"
                value={form.trainNumber}
                onChange={handleChange}
                disabled={editMode}
                placeholder="Train Number"
                className={`border p-2 ${editMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />

              <input
                name="trainName"
                value={form.trainName}
                onChange={handleChange}
                placeholder="Train Name"
                className="border p-2"
              />

              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Source"
                className="border p-2"
              />

              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Destination"
                className="border p-2"
              />

              <input
                name="fare"
                value={form.fare}
                onChange={handleChange}
                placeholder="Fare"
                className="border p-2"
              />
              <input
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                placeholder="Departure Time"
                className="border p-2"
              />

              <input
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                placeholder="Arrival Time"
                className="border p-2"
              />

              <input
                name="totalSeats"
                value={form.totalSeats}
                onChange={handleChange}
                placeholder="Total Seats"
                className="border p-2"
              />

              <input
                name="availableSeats"
                value={form.availableSeats}
                onChange={handleChange}
                placeholder="Available Seats"
                className="border p-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={editMode ? handleUpdate : handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Book Ticket 🎟️</h2>

            <p className="mb-2">
              <strong>Train:</strong> {selectedTrain?.trainName}
            </p>

            <p className="mb-4">
              <strong>Available Seats:</strong> {selectedTrain?.availableSeats}
            </p>

            <input
              type="number"
              min="1"
              max="10"
              value={seatsBooked}
              onChange={(e) => setSeatsBooked(Number(e.target.value))}
              className="border p-2 rounded w-full"
              placeholder="Number of Seats"
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setBookingOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
