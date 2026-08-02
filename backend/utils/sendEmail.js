import transporter from "../config/email.js";

export const sendBookingEmail = async (user, booking, train) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "🎟 Ticket Booking Confirmed - RailBook",

    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>🎉 Booking Confirmed!</h2>

        <p>Hi <b>${user.name}</b>,</p>

        <p>Your train ticket has been successfully booked.</p>

        <h3>📄 Booking Details:</h3>
        <ul>
          <li><b>PNR:</b> ${booking.pnr}</li>
          <li><b>Train:</b> ${train.trainName}</li>
          <li><b>Seats:</b> ${booking.seatsBooked}</li>
          <li><b>Seat Numbers:</b> ${booking.seatNumbers.join(", ")}</li>
          <li><b>Total Fare:</b> ₹${booking.totalFare}</li>
        </ul>

        <p>💳 Payment Status: <b>Paid</b></p>

        <br/>
        <p>Thank you for using RailBook 🚆</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
