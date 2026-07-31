# 📘 CMS Lapangan Backend API Setup Guide

This document provides a step-by-step guide on how to set up, configure, and run the **CMS Lapangan Backend API**. The API is built using **Node.js**, **Express**, **Sequelize**, and **MySQL**.

---

## 🛠️ **Prerequisites**

Before you begin, ensure you have the following installed on your machine:

1. **Node.js** (v16 or later) - [Download Node.js](https://nodejs.org/)
2. **MySQL** - Ensure that MySQL is installed and running.
3. **npm** - Comes with Node.js installation.

---

## 📂 **Project Structure**

```
project-root/
├── node_modules/
├── config/
│   └── config.json   // Database configuration file
├── controllers/
├── models/
├── services/
├── utils/
├── .env              // Environment variables file
├── .gitignore
├── package.json
├── README.md
├── index.js          // Main entry point
```

---

## ⚙️ **Installation Instructions**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/cms_lapangan_backend.git
   cd cms_lapangan_backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the environment variables:**
   Create a `.env` file in the root directory and add the following values:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=cms_lapangan
   JWT_SECRET=your_jwt_secret_key
   ```

   **Note:** Replace `yourpassword` and `your_jwt_secret_key` with your own values.

4. **Configure the database:**
   Update the `config/config.json` file to match your MySQL database details.

   ```json
   {
     "development": {
       "username": "root",
       "password": "yourpassword",
       "database": "cms_lapangan",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "test": {
       "username": "root",
       "password": "yourpassword",
       "database": "cms_lapangan_test",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "production": {
       "username": "root",
       "password": "yourpassword",
       "database": "cms_lapangan_production",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

   **Note:** Replace `yourpassword` with your MySQL password.

5. **Run Sequelize migrations and seeders:**

   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server should now be running at **http://localhost:3000**.

---

## 🚀 **Available Scripts**

| Command                         | Description                              |
| ------------------------------- | ---------------------------------------- |
| `npm install`                   | Install dependencies                     |
| `npm run dev`                   | Run the development server using Nodemon |
| `npx sequelize-cli db:create`   | Create the database                      |
| `npx sequelize-cli db:migrate`  | Run database migrations                  |
| `npx sequelize-cli db:seed:all` | Seed initial data into the database      |

---

## 📌 **API Endpoints**

### **Auth**

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/login`    | Log in and get JWT token |
| POST   | `/api/auth/register` | Register a new user      |

### **Lapangan (Field Management)**

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/lapangan`     | Get all Lapangan            |
| GET    | `/api/lapangan/:id` | Get a single Lapangan by ID |
| POST   | `/api/lapangan`     | Create a new Lapangan       |
| PUT    | `/api/lapangan/:id` | Update an existing Lapangan |
| DELETE | `/api/lapangan/:id` | Delete a Lapangan by ID     |

### **Booking**

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| POST   | `/api/booking`    | Create a booking                        |
| GET    | `/api/booking/my` | Get all bookings for the logged-in user |

---

## 🗄️ **Database Models**

### **User**

| Field      | Data Type | Description     |
| ---------- | --------- | --------------- |
| `id`       | INTEGER   | Primary key     |
| `email`    | STRING    | User email      |
| `password` | STRING    | Hashed password |

### **Lapangan**

| Field            | Data Type | Description                     |
| ---------------- | --------- | ------------------------------- |
| `id`             | INTEGER   | Primary key                     |
| `nama`           | STRING    | Name of the field               |
| `jenis_olahraga` | STRING    | Type of sport (e.g., badminton) |
| `lokasi`         | STRING    | Location of the field           |
| `harga_per_jam`  | DECIMAL   | Price per hour                  |

### **Booking**

| Field           | Data Type | Description             |
| --------------- | --------- | ----------------------- |
| `id`            | INTEGER   | Primary key             |
| `id_pengguna`   | INTEGER   | Foreign key to User     |
| `id_lapangan`   | INTEGER   | Foreign key to Lapangan |
| `tanggal`       | DATE      | Booking date            |
| `waktu_mulai`   | TIME      | Booking start time      |
| `waktu_selesai` | TIME      | Booking end time        |
| `total_harga`   | DECIMAL   | Total booking price     |

---

## 🔐 **Authentication**

The API uses **JWT (JSON Web Tokens)** for authentication. To access protected routes, you must include the following header in your requests:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, you need to log in using the `/api/auth/login` endpoint.

---

## 🧪 **Testing the API**

To test the API, you can use **Postman** or **cURL**. Below is an example to create a Lapangan.

```bash
curl -X POST http://localhost:3000/api/lapangan \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Lapangan A",
    "jenis_olahraga": "futsal",
    "lokasi": "Jl. Merdeka No.1",
    "harga_per_jam": "60000.00"
  }'
```

---

## 🔥 **Troubleshooting**

1. **Database Connection Issues**

   - Ensure MySQL is running.
   - Verify your MySQL credentials in the `.env` file.

2. **JWT Errors**
   - Ensure you are passing the token in the `Authorization` header.

---

## 📄 **License**

This project is licensed under the ISC License.

---

## 📞 **Support**

For support, contact the @dzoxploit or raise an issue in the repository.
