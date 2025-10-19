// Authentication service to communicate with backend
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3qIOimhNmwfGNonJ6sMxsYykQpzSASVs",
  authDomain: "hostelcomplaint-dff1d.firebaseapp.com",
  projectId: "hostelcomplaint-dff1d",
  storageBucket: "hostelcomplaint-dff1d.appspot.com",
  messagingSenderId: "784156885988",
  appId: "1:784156885988:web:1a38457965cd51d836fdf1",
  measurementId: "G-YH40BXJJDX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_BASE_URL = 'http://localhost:3001/api/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  studentId: string;
  roomNumber: string;
  block: string;
  firebaseUid: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    role: string;
    studentId: string;
    roomNumber: string;
    block: string;
    active: boolean;
  };
  error?: string;
}

class AuthService {
  // Login method - handles both admin and student login
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Special case for admin login
    if (loginData.email === 'admin@gmail.com') {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('cachedAdminUser', JSON.stringify({ ...data.user, token: data.token }));
          return data;
        } else {
          return { success: false, message: data.error || 'Admin login failed', error: data.error };
        }
      } catch (error) {
        return { success: false, message: 'Network error', error: 'Network error' };
      }
    }

    // Standard student login with Firebase
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/login-with-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('cachedStudentUser', JSON.stringify({ ...data.user, token: data.token }));
        return data;
      } else {
        return { success: false, message: data.error || 'Login failed', error: data.error };
      }
    } catch (error: any) {
      let errorMessage = 'Login failed';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found': errorMessage = 'No user found with this email.'; break;
          case 'auth/wrong-password': errorMessage = 'Incorrect password.'; break;
          case 'auth/invalid-email': errorMessage = 'Invalid email address.'; break;
          default: errorMessage = 'An unknown error occurred.';
        }
      }
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }

  // Register method
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Now, register the user in the backend
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: 'Registration successful!',
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.error || 'Registration failed',
          error: data.error || 'Registration failed',
        };
      }
    } catch (error: any) {
      return { success: false, message: 'An unknown error occurred during registration.', error: 'An unknown error occurred during registration.' };
    }
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('cachedAdminUser');
    localStorage.removeItem('cachedStudentUser');
  }

  // Get current user
  getCurrentUser(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }


  // Get cached user data (for backward compatibility)
  getCachedUser() {
    const adminData = localStorage.getItem('cachedAdminUser');
    const studentData = localStorage.getItem('cachedStudentUser');
    return { 
      admin: adminData ? JSON.parse(adminData) : null,
      student: studentData ? JSON.parse(studentData) : null
    };
  }
}

export default new AuthService();
