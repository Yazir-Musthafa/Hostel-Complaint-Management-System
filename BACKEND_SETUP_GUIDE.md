# Backend Setup and Error Resolution Guide

## Issues Found and Fixed

### 1. MySQL Connection Error
**Problem**: The main error was that MySQL server is not running on your system.
```
Caused by: java.net.ConnectException: Connection refused: getsockopt
```

**Solutions Provided**:

#### Option A: Install and Start MySQL (Recommended for Production)
1. **Install MySQL Server**:
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use package manager: `winget install Oracle.MySQL`

2. **Start MySQL Service**:
   ```cmd
   net start mysql80
   ```

3. **Create Database**:
   ```sql
   CREATE DATABASE hostel_complaint_db;
   ```

4. **Run with MySQL**:
   ```cmd
   cd backend
   mvn spring-boot:run
   ```

#### Option B: Use H2 In-Memory Database (Quick Testing)
1. **Run with Development Profile**:
   ```cmd
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

2. **Access H2 Console** (for debugging):
   - URL: http://localhost:3001/h2-console
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)

### 2. Other Issues Fixed

#### Maven POM.xml Issues
- ✅ Fixed XML parsing errors
- ✅ Updated deprecated MySQL connector
- ✅ Added H2 database dependency

#### Spring Security Configuration
- ✅ Fixed deprecated CORS and CSRF configuration
- ✅ Updated to modern lambda-based syntax
- ✅ Proper CORS configuration for React frontend

#### Controller Mapping
- ✅ Fixed AuthController mapping to `/api/auth`
- ✅ Added HealthController for testing

## How to Run the Backend

### Method 1: With H2 Database (Easiest)
```cmd
cd backend
mvn clean compile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Method 2: With MySQL Database
1. Install and start MySQL
2. Create database: `hostel_complaint_db`
3. Run:
```cmd
cd backend
mvn clean compile
mvn spring-boot:run
```

## Testing the Backend

### Health Check
```
GET http://localhost:3001/api/health
```

### Authentication Endpoints
```
POST http://localhost:3001/api/auth/register
POST http://localhost:3001/api/auth/login
POST http://localhost:3001/api/auth/login-with-token
```

## Configuration Files

### application.properties (MySQL)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hostel_complaint_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=password
server.port=3001
```

### application-dev.properties (H2)
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
server.port=3001
```

## Firebase Integration
- ✅ Firebase Admin SDK properly configured
- ✅ Service account JSON file in place
- ✅ Authentication filter working
- ✅ Custom token generation available

## CORS Configuration
- ✅ Configured for React frontend
- ✅ Allows localhost:3000 and localhost:5173
- ✅ Supports all necessary HTTP methods

## Next Steps
1. Choose your database option (H2 for quick testing, MySQL for production)
2. Start the backend using the appropriate method
3. Test the health endpoint
4. Connect your React frontend
5. Test authentication flow

## Troubleshooting

### If MySQL connection still fails:
1. Check if MySQL service is running: `net start mysql80`
2. Verify database exists: `SHOW DATABASES;`
3. Check username/password in application.properties

### If H2 doesn't work:
1. Make sure you're using the dev profile: `-Dspring-boot.run.profiles=dev`
2. Check if port 3001 is available
3. Try accessing H2 console at http://localhost:3001/h2-console

### If Firebase errors occur:
1. Verify firebase-service-account.json is in src/main/resources/
2. Check Firebase project settings
3. Ensure service account has proper permissions
