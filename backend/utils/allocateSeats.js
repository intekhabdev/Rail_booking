export const allocateSeats = (totalSeats, bookedSeats, seatsRequired) => {
  const allocatedSeats = [];

  for (let seat = 1; seat <= totalSeats; seat++) {
    const seatNumber = `S1-${seat}`;

    if (!bookedSeats.includes(seatNumber)) {
      allocatedSeats.push(seatNumber);
    }

    if (allocatedSeats.length === seatsRequired) break;
  }

  return allocatedSeats;
};
