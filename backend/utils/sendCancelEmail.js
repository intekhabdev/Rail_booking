import transporter from "../config/email.js";

export const sendCancelEmail = async (user, booking, train) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "❌ Ticket Cancellation - RailBook",

    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>❌ Booking Cancelled</h2>

        <p>Hi <b>${user.name}</b>,</p>

        <p>Your train ticket has been successfully cancelled.</p>

        <h3>📄 Cancelled Booking Details:</h3>
        <ul>
          <li><b>PNR:</b> ${booking.pnr}</li>
          <li><b>Train:</b> ${train.trainName}</li>
          <li><b>Seats:</b> ${booking.seatNumbers.join(", ")}</li>
          <li><b>Refund Status:</b> Processing / As per policy</li>
        </ul>
       <li><b>Refund Status:</b> Processing / As per policy</li>
          <p><b>Cancellation Charge:</b> ₹${booking.cancellationCharge}</p>
<p><b>Refund Amount:</b> ₹${booking.refundAmount}</p>
        </ul>

        <p>We hope to serve you again 🚆</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
