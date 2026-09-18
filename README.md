🚆 Rail Ticket Booking System

A full-stack Rail Ticket Booking System built using the MERN Stack.

This project allows users to search trains, check seat availability, book tickets, generate PNR numbers, cancel bookings, and download tickets. It also includes an admin dashboard for managing trains, users, bookings, and revenue.

🚀 Features

👤 User Features

User registration and login
JWT-based authentication
Search trains by train number, source, destination, and fare
View available seats
Select journey date
Book tickets
Automatic PNR generation
Seat number allocation
View booking history
Cancel tickets
Download ticket with QR code
Payment integration

🛠️ Admin Features

Admin dashboard
View total users, bookings, and trains
Revenue overview
Manage train details
View and manage bookings
Track booking and payment status

🧑‍💻 Tech Stack

Frontend: React.js, JavaScript, HTML5, CSS3

Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT

Payment: Razorpay

Email: Nodemailer

API: RESTful APIs

📸 Screenshots

1. Available Trains
2. Book Ticket
3. My Bookings
4. Generated Ticket with QR Code
5. Admin Bookings
6. Admin Dashboard
7. Job Opportunity
8. 
🔄 Booking Flow

Register/Login

Search for a train

Check seat availability

Select journey date

Enter number of seats

Confirm booking

Complete payment

Generate PNR and ticket

Download ticket

Cancel ticket when required

📊 Sample Train Data

Train No.

Train Name

Source

Destination

Fare

12301

Rajdhani Express

New Delhi

Mumbai Central

₹1500

12002

Shatabdi Express

New Delhi

Bhopal

₹1200

12951

Mumbai Rajdhani

Mumbai Central

New Delhi

₹1650

12801

Purushottam Express

New Delhi

Puri

₹1100

12309

Rajdhani Express

Mumbai Central

New Delhi

₹1550

12245

Duronto Express

New Delhi

Howrah

₹1300

⚙️ Installation

Clone the repository

git clone <your-github-repository-url>
cd <project-folder>

Install dependencies

cd backend
npm install

cd frontend
npm install

cd admin
npm install

Environment Variables

Create a .env file in the backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

For Razorpay:

VITE_RAZORPAY_KEY_ID=rzp_test_your_key

Run the project

npm run dev

📁 Project Structure

Rail-Ticket-Booking-System/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── admin/
│   ├── src/
│   └── package.json
└── README.md

👨‍💻 Author
Md Intekhab
GitHub: <your-github-profile>
LinkedIn: <your-linkedin-profile>


