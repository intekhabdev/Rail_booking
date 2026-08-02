import { useEffect, useState } from "react";
import { getMyBookings, cancelTicket } from "../api/booking";
import { toast } from "react-toastify";
import { generateTicketPDF } from "../utils/generateTicketPDF";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      toast.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const res = await cancelTicket(id);
      toast.success(res.data.message || "Ticket cancelled 🚫");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed ❌");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Bookings 🎟️</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div className="border p-4 rounded-lg shadow bg-white relative">
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-white text-sm rounded-full ${
                  b.status === "CONFIRMED"
                    ? "bg-green-500"
                    : b.status === "PENDING"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {b.status}

                {b.waitlistStatus !== "NONE" &&
                  b.waitlistStatus &&
                  ` (${b.waitlistStatus})`}
              </span>

              <h2 className="text-xl font-bold text-blue-600">
                {b.trainId?.trainName}
              </h2>

              <p className="text-gray-600">
                {b.trainId?.source} ➝ {b.trainId?.destination}
              </p>

              <div className="mt-3 p-3 bg-gray-100 rounded border-dashed border">
                <p className="text-sm text-gray-500">PNR</p>
                <p className="font-mono text-lg font-bold">{b.pnr}</p>
              </div>

              <p className="mt-2">
                <strong>Seats:</strong> {b.seatsBooked}
              </p>

              <p className="text-sm font-medium text-amber-600">
                {b.waitlistStatus !== "NONE"
                  ? "⚠️ Seats will be assigned upon confirmation"
                  : `Seat Numbers: ${b.seatNumbers?.join(", ")}`}
              </p>

              <button
                onClick={() => handleCancel(b._id)}
                disabled={b.status === "CANCELLED"}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Cancel Ticket
              </button>
              <button
                onClick={() => generateTicketPDF(b, b.trainId, user)}
                className="mt-2 mx-3 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Download Ticket 🎫
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
