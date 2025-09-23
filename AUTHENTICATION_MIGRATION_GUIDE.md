# Authentication Migration Guide

## Overview
This guide documents the migration from direct Firebase authentication in React to a hybrid approach where React authenticates with Firebase first, then verifies with the Java backend.

## Changes Made

### 1. Backend Changes

#### AuthController.java
- **Added login endpoint** (`/auth/login`): Simple email-based lookup (for development)
- **Added token-based login endpoint** (`/auth/login-with-token`): Verifies Firebase ID tokens
- **Enhanced register endpoint** (`/auth/register`): Creates users in both Firebase and local database
- **Added DTOs**: `LoginRequest`, `TokenLoginRequest`, `RegisterRequest`
- **Added helper methods**: `createErrorResponse()`, `createUserResponse()`

#### Key Features:
- **Hybrid Authentication**: Frontend authenticates with Firebase, backend verifies the token
- **User Management**: Users are stored in both Firebase and local PostgreSQL database
- **Role-based Access**: Supports admin, student, and parent roles
- **Token Generation**: Creates custom Firebase tokens for authenticated users

### 2. Frontend Changes

#### AuthService.ts (New File)
- **Firebase Integration**: Initializes Firebase with existing config
- **Login Method**: Authenticates with Firebase first, then calls backend
- **Register Method**: Calls backend to create user in both Firebase and database
- **Error Handling**: Provides user-friendly error messages for Firebase auth errors
- **Token Management**: Stores tokens and user data in localStorage

#### LoginScreen.tsx
- **Updated Authentication Flow**: Uses new AuthService instead of direct Firebase calls
- **Loading States**: Added loading indicators during authentication
- **Error Handling**: Displays authentication errors to users
- **Backward Compatibility**: Maintains cached user functionality

## Authentication Flow

### Login Process:
1. User enters email and password in React frontend
2. Frontend calls Firebase `signInWithEmailAndPassword()`
3. Firebase returns ID token if credentials are valid
4. Frontend sends ID token to backend `/auth/login-with-token` endpoint
5. Backend verifies ID token with Firebase Admin SDK
6. Backend retrieves user data from local database
7. Backend returns user data and token to frontend
8. Frontend stores token and user data in localStorage

### Registration Process:
1. User fills registration form in React frontend
2. Frontend sends registration data to backend `/auth/register` endpoint
3. Backend creates user in Firebase using Admin SDK
4. Backend saves user data to local PostgreSQL database
5. Backend generates custom token for immediate login
6. Backend returns user data and token to frontend
7. Frontend stores token and user data in localStorage

## Configuration

### Firebase Config
The Firebase configuration is now centralized in `src/services/authService.ts`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB3qIOimhNmwfGNonJ6sMxsYykQpzSASVs",
  authDomain: "hostelcomplaint-dff1d.firebaseapp.com",
  projectId: "hostelcomplaint-dff1d",
  storageBucket: "hostelcomplaint-dff1d.appspot.com",
  messagingSenderId: "784156885988",
  appId: "1:784156885988:web:1a38457965cd51d836fdf1",
  measurementId: "G-YH40BXJJDX"
};
```

### Backend API Base URL
```javascript
const API_BASE_URL = 'http://localhost:8080/auth';
```

## Testing the Authentication Flow

### Prerequisites:
1. **Start Backend Server**: 
   ```bash
   cd backend
   mvn spring-boot:run
   # or if Maven wrapper is available:
   ./mvnw spring-boot:run
   ```

2. **Start Frontend Server**:
   ```bash
   npm run dev
   ```

### Test Cases:

#### 1. Student Registration
- Navigate to login screen
- Click "Login with Credentials"
- Click "Sign up as a Student"
- Fill in all required fields
- Submit form
- Should create user in Firebase and database, then auto-login

#### 2. Student Login
- Use credentials from a registered student
- Enter email and password
- Click "Login to Account"
- Should authenticate with Firebase, verify with backend, and login

#### 3. Admin Login
- Use admin credentials (must be pre-created in database)
- Follow same login process
- Should login with admin role

### Error Scenarios to Test:
- Invalid email format
- Wrong password
- Non-existent user
- Network connectivity issues
- Backend server not running

## Security Considerations

### Current Implementation:
- **Firebase Authentication**: Handles password verification and security
- **Token Verification**: Backend verifies Firebase ID tokens
- **Role-based Access**: Users have defined roles (admin, student, parent)
- **CORS Configuration**: Backend allows cross-origin requests

### Production Recommendations:
1. **Environment Variables**: Move Firebase config to environment variables
2. **HTTPS**: Use HTTPS for all communications
3. **Token Expiration**: Implement token refresh mechanism
4. **Rate Limiting**: Add rate limiting to authentication endpoints
5. **Input Validation**: Add comprehensive input validation
6. **Audit Logging**: Log authentication attempts and failures

## Troubleshooting

### Common Issues:

1. **Backend Not Running**:
   - Error: "Network error occurred"
   - Solution: Start the Spring Boot backend server

2. **Firebase Configuration**:
   - Error: "Firebase configuration error"
   - Solution: Verify Firebase config in authService.ts

3. **CORS Issues**:
   - Error: "CORS policy" errors in browser console
   - Solution: Verify @CrossOrigin annotation in AuthController

4. **Database Connection**:
   - Error: Database connection errors in backend logs
   - Solution: Check application.properties database configuration

5. **Firebase Admin SDK**:
   - Error: "Firebase Admin SDK not initialized"
   - Solution: Verify Firebase service account key configuration

## Migration Benefits

1. **Centralized User Management**: Users are managed in both Firebase and local database
2. **Enhanced Security**: Backend validates all authentication requests
3. **Role-based Authorization**: Proper role management through backend
4. **Audit Trail**: All authentication events can be logged in backend
5. **Scalability**: Backend can implement additional business logic
6. **Data Consistency**: User data is synchronized between Firebase and database

## Next Steps

1. **Test Authentication Flow**: Verify login and registration work correctly
2. **Add Admin User Creation**: Create mechanism for admin user creation
3. **Implement Token Refresh**: Add token refresh functionality
4. **Add Logout Functionality**: Ensure proper cleanup on logout
5. **Error Handling Enhancement**: Improve error messages and handling
6. **Security Hardening**: Implement production security measures
