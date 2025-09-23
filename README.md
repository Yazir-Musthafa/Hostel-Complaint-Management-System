# Hostel Complaint Management System

A comprehensive web application for managing hostel complaints with role-based access control for students, parents, and administrators.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Java Spring Boot 3.2.0
- **Database**: H2 (development) / MySQL (production)
- **Authentication**: Firebase Authentication
- **Security**: Spring Security with JWT tokens

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Java 17** or higher
- **Maven 3.6+**
- **Firebase Account** (for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/Yazir-Musthafa/Hostel-Complaint-Management-System.git
cd Hostel-Complaint-Management-System
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📊 Database Configuration

### Development (H2 Database)
The application is pre-configured to use H2 in-memory database for immediate testing:

- **Database Console**: `http://localhost:3001/h2-console`
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (leave empty)

### Production (MySQL)
To use MySQL in production:

1. Install MySQL Server
2. Create database: `CREATE DATABASE hostel_complaint_db;`
3. Update `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hostel_complaint_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## 🔐 Authentication & Authorization

### User Roles
- **Student**: Submit and track complaints
- **Parent**: View child's complaints and provide feedback
- **Admin**: Manage all complaints and users

### Authentication Flow
1. User registers/logs in through Firebase
2. Backend validates Firebase token
3. User data stored in local database
4. JWT token issued for subsequent requests

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/login-with-token` - Firebase token login

### Health Check
- `GET /api/health` - Application health status

### Protected Endpoints
All other endpoints require authentication via Bearer token.

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Access Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`
   - H2 Console: `http://localhost:3001/h2-console`

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend
mvn clean package

# Run production JAR
java -jar target/complaint-management-0.0.1-SNAPSHOT.jar
```

## 🔧 Configuration Files

### Frontend Configuration
- `src/services/authService.ts` - Authentication service
- `vite.config.ts` - Vite configuration

### Backend Configuration
- `application.properties` - Main configuration
- `application-dev.properties` - Development profile
- `firebase-service-account.json` - Firebase credentials

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Ensure Java 17+ is installed
   - Check if port 3001 is available
   - Verify Firebase service account file exists

2. **Database connection errors**:
   - For H2: No action needed (in-memory)
   - For MySQL: Ensure MySQL server is running

3. **Authentication errors**:
   - Verify Firebase configuration
   - Check service account permissions
   - Ensure CORS is properly configured

4. **Frontend can't connect to backend**:
   - Verify backend is running on port 3001
   - Check CORS configuration in SecurityConfig
   - Ensure API_BASE_URL in authService.ts is correct

### Logs and Debugging

- **Backend logs**: Check console output when running `mvn spring-boot:run`
- **Frontend logs**: Check browser developer console
- **Database**: Use H2 console to inspect data

## 📁 Project Structure

```
├── backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/hostel/complaint/
│   │       ├── config/         # Configuration classes
│   │       ├── controller/     # REST controllers
│   │       ├── entity/         # JPA entities
│   │       ├── repository/     # Data repositories
│   │       ├── security/       # Security filters
│   │       └── service/        # Business logic
│   └── src/main/resources/
│       ├── application.properties
│       └── firebase-service-account.json
├── src/                        # React frontend
│   ├── components/             # React components
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── BACKEND_SETUP_GUIDE.md      # Detailed backend setup
└── README.md                   # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is made for our college 

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the `BACKEND_SETUP_GUIDE.md`
3. Create an issue on GitHub

---

**Note**: This application uses Firebase for authentication. Ensure you have proper Firebase configuration before running in production.
