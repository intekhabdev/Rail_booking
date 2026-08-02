import transporter from "../config/email.js";

export const sendReminderEmail = async (user, booking, train) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "⏰ Journey Reminder - RailBook",

    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>⏰ Journey Reminder</h2>

        <p>Hi <b>${user.name}</b>,</p>

        <p>This is a reminder for your upcoming train journey.</p>

        <h3>🚆 Trip Details:</h3>
        <ul>
          <li><b>PNR:</b> ${booking.pnr}</li>
          <li><b>Train:</b> ${train.trainName}</li>
          <li><b>Seats:</b> ${booking.seatNumbers.join(", ")}</li>
          <li><b>Status:</b> CONFIRMED</li>
        </ul>

        <p>📅 Please arrive at station on time.</p>

        <p>Happy Journey 🚆</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
