// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const API_BASE_URL = 'http://localhost:3001'; // Backend URL

// -----------------------
// Caching utility functions
// -----------------------
function getCachedUser() {
  const admin = localStorage.getItem('cachedAdminUser');
  const student = localStorage.getItem('cachedStudentUser');
  return {
    admin: admin ? JSON.parse(admin) : null,
    student: student ? JSON.parse(student) : null,
  };
}

function setCachedUser(role, userData) {
  if (role === 'admin') localStorage.setItem('cachedAdminUser', JSON.stringify(userData));
  else if (role === 'student') localStorage.setItem('cachedStudentUser', JSON.stringify(userData));
}

function clearCachedUsers() {
  localStorage.removeItem('cachedAdminUser');
  localStorage.removeItem('cachedStudentUser');
  alert('Cached data cleared.');
}

// -----------------------
// Main LoginScreen Component
// -----------------------
export default function LoginScreen({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    firebaseUid: '', // optional, can be empty
    fullName: '',
    email: '',
    mobile: '',
    studentId: '',
    roomNumber: '',
    block: '',
    password: '',
    confirmPassword: '',
  });

  // Auto-login from cache
  useEffect(() => {
    const { admin, student } = getCachedUser();
    if (selectedRole === 'admin' && admin) onLogin(admin, 'admin');
    if (selectedRole === 'student' && student) onLogin(student, 'student');
  }, [selectedRole, onLogin]);

  // -----------------------
  // Role selection handler
  // -----------------------
  const handleRoleSelection = (role: 'admin' | 'student' | 'parent') => {
    setSelectedRole(role);

    if (role === 'parent') {
      // -----------------------
      // Create Parent object immediately
      // -----------------------
      const parentUser = { 
        name: 'Parent', 
        email: 'parent@hostel.com', 
        relationship: 'Guardian' 
      };
      onLogin(parentUser, 'parent');
      return;
    }

    const cached = getCachedUser();
    if (role === 'admin' && cached.admin) onLogin(cached.admin, 'admin');
    else if (role === 'student' && cached.student) onLogin(cached.student, 'student');
    else setShowManualLogin(true);
  };

  // -----------------------
  // Login API
  // -----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: selectedRole,
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        // -----------------------
        // Create user object immediately after login
        // -----------------------
        const user = {
          firebaseUid: data.user.firebaseUid || '',
          name: data.user.name,
          email: data.user.email,
          studentId: data.user.studentId,
          room: data.user.roomNumber,
          block: data.user.block,
          token: data.token,
        };

        // Cache user object
        setCachedUser(selectedRole, user);

        // Pass user object to parent component
        onLogin(user, selectedRole);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Signup API
  // -----------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: signupData.firebaseUid,
          name: signupData.fullName,
          email: signupData.email,
          mobile: signupData.mobile,
          studentId: signupData.studentId,
          room: signupData.roomNumber,
          block: signupData.block,
          password: signupData.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // -----------------------
        // Create user object immediately after signup
        // -----------------------
        const newUser = {
          firebaseUid: signupData.firebaseUid || '',
          name: signupData.fullName,
          email: signupData.email,
          studentId: signupData.studentId,
          room: signupData.roomNumber,
          block: signupData.block,
        };

        // Optionally cache the new user
        setCachedUser('student', newUser);

        // Signup success, allow login
        setSignupSuccess(true);

        // Optionally, auto-login right after signup
        // onLogin(newUser, 'student');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Role selection */}
        {!showManualLogin && !showSignup && (
          <div className="space-y-4">
            <Button onClick={() => handleRoleSelection('admin')}>Login as Admin</Button>
            <Button onClick={() => handleRoleSelection('student')}>Login as Student</Button>
            <Button onClick={() => handleRoleSelection('parent')}>Parent View</Button>
            <Button onClick={clearCachedUsers} variant="destructive">Clear Cached Data</Button>
          </div>
        )}

        {/* Login Form */}
        {showManualLogin && !showSignup && (
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
                {error && <p className="text-destructive">{error}</p>}
                <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                <Button type="button" onClick={() => setShowSignup(true)}>Sign up as Student</Button>
                <Button type="button" onClick={() => setShowManualLogin(false)}>Back to Role Selection</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Signup Form */}
        {showSignup && !signupSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>Student Signup</CardTitle>
              <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <Input placeholder="Full Name" value={signupData.fullName} onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} required />
                <Input placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required />
                <Input placeholder="Mobile" value={signupData.mobile} onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })} required />
                <Input placeholder="Student ID" value={signupData.studentId} onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })} required />
                <Input placeholder="Room Number" value={signupData.roomNumber} onChange={(e) => setSignupData({ ...signupData, roomNumber: e.target.value })} required />
                <Select value={signupData.block} onValueChange={(v) => setSignupData({ ...signupData, block: v })} required>
                  <SelectTrigger><SelectValue placeholder="Select Block" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block A">Block A</SelectItem>
                    <SelectItem value="Block B">Block B</SelectItem>
                    <SelectItem value="Block C">Block C</SelectItem>
                    <SelectItem value="Block D">Block D</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required />
                <Input type="password" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} required />
                {error && <p className="text-destructive">{error}</p>}
                <Button type="submit" disabled={loading || signupData.password !== signupData.confirmPassword}>{loading ? 'Creating...' : 'Create Account'}</Button>
                <Button type="button" onClick={() => setShowSignup(false)}>Back to Login</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {signupSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>Signup Successful!</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => { setShowSignup(false); setShowManualLogin(true); setSignupSuccess(false); }}>Go to Login</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
