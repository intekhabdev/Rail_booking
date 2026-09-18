# 🚆 Rail Ticket Booking System

A full-stack **Rail Ticket Booking System** built using the **MERN Stack**.

This project allows users to search trains, check seat availability, book tickets, generate PNR numbers, cancel bookings, and download tickets. It also includes an admin dashboard for managing trains, users, bookings, and revenue.

## 🚀 Features

### 👤 User Features
- User registration and login
- JWT-based authentication
- Search trains by train number, source, destination, and fare
- View available seats
- Select journey date
- Book tickets
- Automatic PNR generation
- Seat number allocation
- View booking history
- Cancel tickets
- Download ticket with QR code
- Payment integration

### 🛠️ Admin Features
- Admin dashboard
- View total users, bookings, and trains
- Revenue overview
- Manage train details
- View and manage bookings
- Track booking and payment status

## 🧑‍💻 Tech Stack

- **Frontend:** React.js, JavaScript, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **Payment:** Razorpay
- **Email:** Nodemailer
- **API:** RESTful APIs

## 📸 Screenshots

### 1. Available Trains
![Available Trains](screenshots/available-trains.jpg)

### 2. Book Ticket
![Book Ticket](screenshots/book-ticket.jpg)

### 3. My Bookings
![My Bookings](screenshots/my-bookings.jpg)

### 4. Generated Ticket with QR Code
![Generated Ticket](screenshots/ticket.jpg)

### 5. Admin Bookings
![Admin Bookings](screenshots/admin-bookings.jpg)

### 6. Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.jpg)

### 7. Job Opportunity
![Job Opportunity](screenshots/job-post.jpg)

## 🔄 Booking Flow

1. Register/Login
2. Search for a train
3. Check seat availability
4. Select journey date
5. Enter number of seats
6. Confirm booking
7. Complete payment
8. Generate PNR and ticket
9. Download ticket
10. Cancel ticket when required

## 📊 Sample Train Data

| Train No. | Train Name | Source | Destination | Fare |
|---|---|---|---|---:|
| 12301 | Rajdhani Express | New Delhi | Mumbai Central | ₹1500 |
| 12002 | Shatabdi Express | New Delhi | Bhopal | ₹1200 |
| 12951 | Mumbai Rajdhani | Mumbai Central | New Delhi | ₹1650 |
| 12801 | Purushottam Express | New Delhi | Puri | ₹1100 |
| 12309 | Rajdhani Express | Mumbai Central | New Delhi | ₹1550 |
| 12245 | Duronto Express | New Delhi | Howrah | ₹1300 |

## ⚙️ Installation

### Clone the repository

```bash
git clone <your-github-repository-url>
cd <project-folder>
```

### Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

```bash
cd admin
npm install
```

### Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

For Razorpay:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```

### Run the project

```bash
npm run dev
```

## 📁 Project Structure

```text
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
```

## 🔐 Security

- JWT authentication
- Protected routes
- Password hashing
- Environment variables for sensitive credentials
- Backend-side API validation

## 📌 Project Highlights

This project helped me gain practical experience in:

- Full-stack MERN development
- React development
- REST API development
- MongoDB database management
- Authentication and authorization
- Payment API integration
- Booking and cancellation workflows
- Admin dashboard development
- QR-code ticket generation

## 👨‍💻 Author

**Md Intekhab**
- GitHub: http://github.com/intekhabdev
- LinkedIn: http://linkedin.com/in/hbintekhab
