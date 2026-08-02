import jsPDF from "jspdf";
import QRCode from "qrcode";
export const generateTicketPDF = async (booking, train, user) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("RailBook Ticket", 20, 20);

  doc.setFontSize(12);

  doc.text(`PNR: ${booking.pnr}`, 20, 40);
  doc.text(`Passenger: ${user.name}`, 20, 50);
  doc.text(`Email: ${user.email}`, 20, 60);

  doc.text(`Train: ${train.trainName}`, 20, 70);
  doc.text(`Train No: ${train.trainNumber}`, 20, 80);

  doc.text(`Seats: ${booking.seatNumbers.join(", ")}`, 20, 90);
  doc.text(`Total Fare: Rs ${booking.totalFare}`, 20, 100);

  doc.text(`Status: CONFIRMED`, 20, 110);

  const qrData = JSON.stringify({
    pnr: booking.pnr,
    train: train.trainName,
    seats: booking.seatNumbers,
    user: user.name,
  });

  const qrImage = await QRCode.toDataURL(qrData);

  doc.addImage(qrImage, "PNG", 140, 40, 50, 50);

  doc.text("Scan for verification", 140, 95);

  doc.save(`ticket_${booking.pnr}.pdf`);
};
