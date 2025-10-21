import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import LoginScreen from './utils/helpers/auth/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'parent' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendActive, setIsBackendActive] = useState<boolean | null>(null); // null: checking, true: active, false: inactive

  // Function to check backend health
  const checkBackendHealth = async () => {
    try {
      // Assuming backend runs on port 3001 and has a /health endpoint
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        setIsBackendActive(true);
      if (response.ok) {
        setIsBackendActive(true);
      } else {
      }
        setIsBackendActive(true);

      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendActive(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);


  const handleLogin = (user: User, role: 'admin' | 'student' | 'parent') => {
    setIsLoading(true);
    // Simulate loading for smooth transition
    setTimeout(() => {
      setCurrentUser(user);
      setUserRole(role);
      setIsLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    setIsLoading(true);
    // Simulate loading for smooth transition
    setTimeout(() => {
      setCurrentUser(null);
      setUserRole(null);
      setIsLoading(false);
    }, 200);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-responsive-sm text-muted-foreground">Loading...</p>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Backend health check state
  if (isBackendActive === null) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-responsive-sm text-muted-foreground">Checking backend status...</p>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  if (isBackendActive === false) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Backend Server Unavailable</h1>
          <p className="text-lg text-red-600">Please ensure the backend server is running.</p>
          <p className="text-sm text-red-500 mt-2">Error code: CONNECTION_FAILED</p>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Login screen
  if (!currentUser || !userRole) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            className: 'bg-background border-border text-foreground',
          }}
        />
      </>
    );
  }

  // Main application
  return (
    <div className="min-h-screen bg-muted/20">
      {userRole === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {userRole === 'student' && (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {userRole === 'parent' && (
        <ParentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          className: 'bg-background border-border text-foreground',
        }}
      />
    </div>
  );
}
