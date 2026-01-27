# 🔐 MERN Authentication System

## Description
A complete **MERN Authentication System** featuring user registration, login, email verification using OTP, password reset functionality, and protected routes.  
Built with **React + Vite** on the frontend and **Node.js, Express, MongoDB** on the backend.

---

## ✨ Features
- User registration & login
- JWT-based authentication (HTTP-only cookies)
- Email verification via OTP
- Password reset with OTP
- Protected routes & middleware
- Responsive UI with Tailwind CSS
- Toast notifications for actions
- Clean client–server separation

---

## 📂 Project Structure
```
root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🛠 Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- Cookie-parser
- CORS

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/MERN-Authentication-System.git
cd MERN-Authentication-System
```

---

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create `.env` file (refer `.env.example`):
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
VITE_FRONTEND_URL=http://localhost:5173
```

Run server:
```bash
npm run server
```

---

### 3️⃣ Frontend Setup
```bash
cd client
npm install
```

Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Run frontend:
```bash
npm run dev
```

---

## 🌍 Demo (Live Links)
- Frontend: https://your-frontend-link.vercel.app
- Backend: https://your-backend-link.vercel.app

---

## 🔐 Authentication Flow
1. User registers
2. OTP sent to email for verification
3. User verifies email
4. Secure login using JWT cookies
5. Forgot password → OTP → reset password

---

## 📄 License
Refer `license.md` file for license details.

---

## 🤝 Contributing
Please read `contributing.md` before submitting pull requests.

---

## 👤 Author
**Asrith Raju**  
Built with ❤️ using the MERN stack
