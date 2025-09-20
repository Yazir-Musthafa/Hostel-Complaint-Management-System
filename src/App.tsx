import React, { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'parent' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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