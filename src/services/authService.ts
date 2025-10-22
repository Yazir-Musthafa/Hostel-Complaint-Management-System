// Authentication service to communicate with backend
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

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
    id: string | number;
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

// Define a type for student data fetched from Firestore
export interface StudentData {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  studentId: string;
  roomNumber: string;
  block: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
      const uid = user.uid;

      // Get user details from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      let userData = null;

      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        // If user data doesn't exist in Firestore, create basic user data
        userData = {
          uid: uid,
          name: user.displayName || 'Student',
          email: user.email,
          role: 'student',
          active: true // Default to active if not found
        };
      }

      // Check if the user account is active
      if (!userData) {
          // This case should ideally not happen if default is created, but as a safeguard
          return { success: false, message: 'User data not found.', error: 'User data missing' };
      }
      if (userData.active === false) {
        return { success: false, message: 'Your account has been deactivated. Please contact the administrator.', error: 'Account deactivated' };
      }

      // If active, proceed to construct responseData
      const responseData = {
        success: true,
        message: 'Login successful',
        token: await user.getIdToken(),
        user: {
          id: uid,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile || '',
          role: userData.role || 'student',
          studentId: userData.studentId || '',
          roomNumber: userData.roomNumber || '',
          block: userData.block || '',
          active: userData.active !== false // This will be true if we passed the check
        }
      };

      localStorage.setItem('authToken', responseData.token);
      localStorage.setItem('userData', JSON.stringify(responseData.user));
      localStorage.setItem('cachedStudentUser', JSON.stringify({ ...responseData.user, token: responseData.token }));
      
      return responseData;
    } catch (error: any) {
      let errorMessage = 'Login failed';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found': errorMessage = 'No user found with this email.'; break;
          case 'auth/wrong-password': errorMessage = 'Incorrect password.'; break;
          case 'auth/invalid-email': errorMessage = 'Invalid email address.'; break;
          case 'auth/too-many-requests': errorMessage = 'Too many failed login attempts. Please try again later.'; break;
          default: errorMessage = 'An unknown error occurred during login.';
        }
      }
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }

  // Register method
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // First, create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        registerData.email, 
        registerData.password
      );
      
      const user = userCredential.user;
      const uid = user.uid;

      // Store additional user details in Firestore
      const userDocData = {
        uid: uid,
        name: registerData.name,
        email: registerData.email,
        mobile: registerData.mobile,
        studentId: registerData.studentId,
        roomNumber: registerData.roomNumber,
        block: registerData.block,
        role: 'student',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore users collection directly from frontend
      await setDoc(doc(db, 'users', uid), userDocData);

      return {
        success: true,
        message: 'Registration successful! User details stored in database.',
        user: {
          id: uid,
          name: registerData.name,
          email: registerData.email,
          mobile: registerData.mobile,
          role: 'student',
          studentId: registerData.studentId,
          roomNumber: registerData.roomNumber,
          block: registerData.block,
          active: true
        },
      };
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already registered. Please use a different email.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'permission-denied':
            errorMessage = 'Permission denied. Please check Firestore security rules.';
            break;
          default:
            errorMessage = 'An unknown error occurred during registration.';
        }
      }
      return { success: false, message: errorMessage, error: errorMessage };
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

  // Fetch all students from Firestore
  async getAllStudents(): Promise<AuthResponse> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'student'));
      const querySnapshot = await getDocs(q);
      
      const students: StudentData[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ uid: doc.id, ...doc.data() } as StudentData);
      });

      return { success: true, message: 'Students fetched successfully', user: students as any }; // Casting to any for now, will refine if needed
    } catch (error: any) {
      console.error("Error fetching students: ", error);
      return { success: false, message: 'Failed to fetch students', error: error.message };
    }
  }

  // Update student's active status
  async updateStudentStatus(studentId: string, isActive: boolean): Promise<AuthResponse> {
    try {
      const userDocRef = doc(db, 'users', studentId);
      await updateDoc(userDocRef, {
        active: isActive,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: `Student ${isActive ? 'activated' : 'deactivated'} successfully.` };
    } catch (error: any) {
      console.error("Error updating student status: ", error);
      return { success: false, message: 'Failed to update student status', error: error.message };
    }
  }

  // Method to activate a student
  async activateStudent(studentId: string): Promise<AuthResponse> {
    return this.updateStudentStatus(studentId, true);
  }

  // Method to deactivate a student
  async deactivateStudent(studentId: string): Promise<AuthResponse> {
    return this.updateStudentStatus(studentId, false);
  }

  // Validate user's active status from Firestore
  async validateUserActiveStatus(userId: string): Promise<AuthResponse> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return { success: false, message: 'User not found.', error: 'User not found' };
      }

      const userData = userDoc.data();

      if (userData.active === false) {
        return { success: false, message: 'Your account has been deactivated. Please contact the administrator.', error: 'Account deactivated' };
      }

      // If active, return a success response
      return { success: true, message: 'User is active.' };
    } catch (error: any) {
      console.error("Error validating user active status: ", error);
      return { success: false, message: 'Failed to validate user status', error: error.message };
    }
  }

  // Validate cached user data for active status
  async validateCachedUser(cachedUser: any): Promise<AuthResponse> {
    if (!cachedUser || !cachedUser.id) {
      return { success: false, message: 'Invalid cached user data.', error: 'Invalid data' };
    }

    // Use the existing method to validate the user's active status from Firestore
    return this.validateUserActiveStatus(cachedUser.id);
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
