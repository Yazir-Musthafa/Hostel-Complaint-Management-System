
# 🏠 Hostel Complaint Management System

A **comprehensive web application** for managing hostel complaints with **role-based access** for students, parents, and administrators.

---

## 🏗️ Architecture

* **Frontend**: React + TypeScript + Vite
* **Backend**: Spring Boot 3.2.0 (Java 17)
* **Database**: H2 (in-memory for development)
* **Authentication**: Firebase Authentication
* **Security**: Spring Security with JWT tokens

---

## 🚀 Quick Start Guide

This guide will walk you through setting up **Node.js**, **Maven**, **Java**, and **Firebase**, and running both frontend and backend.

---

## ⚙️ Prerequisites

Before running the project, make sure you have installed the following:

### 1. **Node.js & npm**

* Download from: [https://nodejs.org/](https://nodejs.org/)
* Install the **LTS version (v16 or higher)**.
* Verify installation:

  ```bash
  node -v
  npm -v
  ```
* If not recognized, add Node.js path to environment variables:

  ```
  C:\Program Files\nodejs\
  ```

---

### 2. **Java 17 or higher**

* Download from: [https://adoptium.net/](https://adoptium.net/)
* After installation, check version:

  ```bash
  java -version
  ```
* Add environment variables:

  * **JAVA_HOME** → `C:\Program Files\Java\jdk-17`
  * Add `%JAVA_HOME%\bin` to your system **Path**.

---

### 3. **Apache Maven 3.6+**

* Download from: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
* Extract Maven and add it to environment variables:

  * **MAVEN_HOME** → path to extracted Maven folder (e.g. `C:\Program Files\Apache\Maven`)
  * Add `%MAVEN_HOME%\bin` to your system **Path**.
* Verify installation:

  ```bash
  mvn -v
  ```

---

## 💻 Clone the Repository

```bash
git clone https://github.com/Yazir-Musthafa/Hostel-Complaint-Management-System.git
cd "Hostel Complaint Management System (1)"
```

---

## 🔥 Firebase Setup (Required)

The application uses **Firebase Authentication** for login and signup.

Follow these steps carefully **after cloning the project**:

1. Go to the **[Firebase Console](https://console.firebase.google.com/)**
2. Click **“Add Project”** and follow the setup steps
3. Once the project is created, navigate to:
   **Project Settings → Service Accounts**
4. Click **“Generate new private key”** — this will download a JSON file
5. Place this file inside your backend resources folder:

   ```
   Hostel Complaint Management System\backend\src\main\resources\
   ```
6. Rename it as:

   ```
   firebase-service-account.json
   ```
7. The file is already ignored in `.gitignore`, so it will **not be uploaded to GitHub** for security reasons.

---

## 🔧 Backend Setup (Spring Boot)

Navigate to the backend folder and run the Spring Boot server:

```bash
cd backend
mvn spring-boot:run
```

✅ The backend will start at:

```
http://localhost:3001
```

---

## 💾 Development Database (H2)

The application uses an **in-memory H2 database** for easy testing and development.

* **H2 Console**: [http://localhost:3001/h2-console](http://localhost:3001/h2-console)
* **JDBC URL**: `jdbc:h2:mem:testdb`
* **Username**: `sa`
* **Password**: *(leave empty)*

You can use the console to inspect data while the app is running.

---

## 🌐 Frontend Setup (React + TypeScript + Vite)

Install dependencies and start the frontend server:

```bash
cd frontend
npm install
npm run dev
```

✅ The frontend will start at:

```
http://localhost:5173
```

---

## 🔐 Authentication & Authorization

### User Roles

* 👨‍🎓 **Student**: Submit and track complaints
* 👩‍👧 **Parent**: View their child’s complaints
* 🧑‍💼 **Admin**: Manage all complaints and users

### Authentication Flow

1. User registers or logs in using Firebase
2. Backend validates Firebase token
3. User data is stored in local database
4. JWT token issued for authenticated requests

---

## 🛠️ API Endpoints

### Authentication

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/auth/register`         | Register a new user        |
| POST   | `/api/auth/login`            | Login with credentials     |
| POST   | `/api/auth/login-with-token` | Login using Firebase token |

### Miscellaneous

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/api/health` | Application health status |

🔒 All other routes require a valid JWT Bearer token.

---

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start backend
cd backend
mvn spring-boot:run

# Start frontend
cd ../frontend
npm run dev
```

Access the app:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:3001](http://localhost:3001)
* H2 Console → [http://localhost:3001/h2-console](http://localhost:3001/h2-console)

---

### Production Mode

```bash
# Build frontend
npm run build

# Build backend
cd backend
mvn clean package

# Run the JAR
java -jar target/complaint-management-0.0.1-SNAPSHOT.jar
```

---

## 🧰 Configuration Files

### Frontend

* `src/services/authService.ts` – Firebase + API authentication logic
* `vite.config.ts` – Frontend build configuration

### Backend

* `application.properties` – Backend configuration
* `firebase-service-account.json` – Firebase credentials (your own file)
* `SecurityConfig.java` – Handles JWT and CORS configuration

---

## 🐞 Troubleshooting

| Problem                                | Possible Fix                                                          |
| -------------------------------------- | --------------------------------------------------------------------- |
| **Backend doesn’t start**              | Ensure Java 17+ and Maven are installed and environment variables set |
| **H2 Console not loading**             | Verify backend is running on port 3001                                |
| **Firebase authentication error**      | Check if `firebase-service-account.json` is in the correct folder     |
| **Frontend not connecting to backend** | Verify backend is running and CORS is enabled                         |
| **Port conflict**                      | Change backend port in `application.properties`                       |

---

## 📁 Project Structure

```
├── backend/
│   ├── src/main/java/com/hostel/complaint/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── src/main/resources/
│       ├── application.properties
│       └── firebase-service-account.json
├── frontend/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── utils/
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Implement your feature or fix
4. Test thoroughly
5. Submit a Pull Request

---

## 📄 License

This project was developed for **college academic purposes**.
You are free to modify or extend it for educational use.

---

## 🆘 Supports

For help or issues:

1. Review the **Troubleshooting** section
2. Check the backend and frontend setup steps above
3. Open an issue on GitHub


