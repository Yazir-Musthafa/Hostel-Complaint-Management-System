// @ts-nocheck
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Shield, User, Phone, UserPlus } from 'lucide-react';
import authService from '../services/authService';

// Utility to get cached user data
function getCachedUser() {
  const adminData = localStorage.getItem('cachedAdminUser');
  const studentData = localStorage.getItem('cachedStudentUser');
  return { 
    admin: adminData ? JSON.parse(adminData) : null,
    student: studentData ? JSON.parse(studentData) : null
  };
}

interface LoginScreenProps {
  onLogin: (user: any, role: 'admin' | 'student' | 'parent') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    mobile: '',
    password: ''
  });

  // On mount, check for cached tokens and redirect
  React.useEffect(() => {
    const { admin, student } = getCachedUser();
    if (selectedRole === 'admin' && admin) {
      onLogin({ token: admin }, 'admin');
    }
    if (selectedRole === 'student' && student) {
      onLogin({ token: student }, 'student');
    }
  }, [selectedRole, onLogin]);

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    roomNumber: '',
    block: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (role: 'admin' | 'student' | 'parent') => {
    setSelectedRole(role);
    if (role === 'parent') {
      // Direct navigation for parent view
      onLogin({
        name: 'Parent',
        email: 'parent@hostel.com',
        relationship: 'Guardian'
      }, 'parent');
      return;
    }
    
    // Check for cached user data
    const cachedUsers = getCachedUser();
    
    if (role === 'admin') {
      if (cachedUsers.admin) {
        // Auto-login with cached admin user
        onLogin(cachedUsers.admin, 'admin');
        return;
      } else {
        // Show credential login form for admin
        setShowManualLogin(true);
        return;
      }
    }
    
    if (role === 'student') {
      if (cachedUsers.student) {
        // Auto-login with cached student user
        onLogin(cachedUsers.student, 'student');
        return;
      } else {
        // Show credential login form for student
        setShowManualLogin(true);
        return;
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        email: loginData.email,
        password: loginData.password
      });

      if (response.success && response.user) {
        const userRole = response.user.role as 'admin' | 'student' | 'parent';
        
        // Create user data object for onLogin callback
        const userData = {
          ...response.user,
          token: response.token,
          mobile: loginData.mobile || response.user.mobile
        };

        onLogin(userData, userRole);
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        mobile: signupData.mobile,
        studentId: signupData.studentId,
        roomNumber: signupData.roomNumber,
        block: signupData.block
      });

      if (response.success && response.user) {
        // Create user data object for onLogin callback
        const userData = {
          ...response.user,
          token: response.token
        };

        onLogin(userData, 'student');
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md space-y-responsive">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/25 mb-4">
            <Users className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-responsive-lg font-bold text-foreground text-balance">
              Hostel Management System
            </h1>
            <p className="text-responsive-sm text-muted-foreground text-balance">
              Choose your role to continue
            </p>
          </div>
        </div>

        {/* Role Selection */}
        {!showManualLogin && (
          <div className="space-y-4">
            {/* Admin Login */}
            <Button
              onClick={() => handleRoleSelection('admin')}
              onMouseEnter={() => setHoveredRole('admin')}
              onMouseLeave={() => setHoveredRole(null)}
              className={`w-full h-16 lg:h-18 rounded-2xl flex items-center gap-4 justify-start px-6 btn-professional shadow-lg transition-all duration-300 ${
                hoveredRole === 'admin'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/25 scale-[1.02]'
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 shadow-gray-200/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors duration-300 ${
                hoveredRole === 'admin' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <Shield className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                  hoveredRole === 'admin' ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-responsive-base">Login as Admin</div>
                <div className={`text-xs lg:text-sm text-balance transition-colors duration-300 ${
                  hoveredRole === 'admin' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Full access to manage complaints
                </div>
              </div>
            </Button>

            {/* Student Login */}
            <Button
              onClick={() => handleRoleSelection('student')}
              onMouseEnter={() => setHoveredRole('student')}
              onMouseLeave={() => setHoveredRole(null)}
              variant="outline"
              className={`w-full h-16 lg:h-18 border-2 rounded-2xl flex items-center gap-4 justify-start px-6 btn-professional transition-all duration-300 ${
                hoveredRole === 'student'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]'
                  : 'border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-background/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors duration-300 ${
                hoveredRole === 'student' ? 'bg-white/20' : 'bg-purple-100'
              }`}>
                <User className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                  hoveredRole === 'student' ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <div className="text-left flex-1">
                <div className={`font-semibold text-responsive-base transition-colors duration-300 ${
                  hoveredRole === 'student' ? 'text-white' : 'text-purple-700'
                }`}>Login as Student</div>
                <div className={`text-xs lg:text-sm text-balance transition-colors duration-300 ${
                  hoveredRole === 'student' ? 'text-white/80' : 'text-purple-600'
                }`}>
                  Submit and track your complaints
                </div>
              </div>
            </Button>

            {/* Parent Access Section */}
            <div className="text-center space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Parent Access</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              <Button
                onClick={() => handleRoleSelection('parent')}
                onMouseEnter={() => setHoveredRole('parent')}
                onMouseLeave={() => setHoveredRole(null)}
                variant="outline"
                className={`w-full h-16 lg:h-18 border-2 rounded-2xl flex items-center gap-4 justify-start px-6 btn-professional transition-all duration-300 ${
                  hoveredRole === 'parent'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-500 shadow-lg shadow-green-500/25 scale-[1.02]'
                    : 'border-green-200 hover:bg-green-50 hover:border-green-300 bg-background/50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors duration-300 ${
                  hoveredRole === 'parent' ? 'bg-white/20' : 'bg-green-100'
                }`}>
                  <Users className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                    hoveredRole === 'parent' ? 'text-white' : 'text-green-600'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold text-responsive-base transition-colors duration-300 ${
                    hoveredRole === 'parent' ? 'text-white' : 'text-green-700'
                  }`}>Parent Public View</div>
                  <div className={`text-xs lg:text-sm text-balance transition-colors duration-300 ${
                    hoveredRole === 'parent' ? 'text-white/80' : 'text-green-600'
                  }`}>
                    Monitor complaints & provide feedback
                  </div>
                </div>
              </Button>

              <div className="pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">OR</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowManualLogin(true)}
                  className="w-full h-12 mt-4 border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground flex items-center gap-3 btn-professional"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">Login with Credentials</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        {showManualLogin && !showSignup && (
          <Card className="card-professional card-shadow-lg">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-responsive-base font-semibold text-center">Login to Your Account</CardTitle>
              <CardDescription className="text-responsive-sm text-center text-balance">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-responsive-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-responsive-sm font-medium">Mobile Number (Optional)</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-responsive-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                </div>

                {error && <div className="text-destructive text-sm font-medium">{error}</div>}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground btn-professional font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login to Account'}
                </Button>

                <div className="text-center space-y-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowManualLogin(false)}
                    className="w-full text-muted-foreground hover:text-foreground"
                    disabled={loading}
                  >
                    ← Back to Role Selection
                  </Button>
                  
                  <div className="text-responsive-sm text-muted-foreground">
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => setShowSignup(true)}
                      className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
                    >
                      Sign up as a Student
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Student Signup Form */}
        {showSignup && (
          <Card className="card-professional card-shadow-lg">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-responsive-base font-semibold text-center">Student Registration</CardTitle>
              <CardDescription className="text-responsive-sm text-center text-balance">
                Create your student account to submit and track complaints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupFullName" className="text-responsive-sm font-medium">Full Name</Label>
                    <Input
                      id="signupFullName"
                      placeholder="Enter your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupStudentId" className="text-responsive-sm font-medium">Student ID</Label>
                    <Input
                      id="signupStudentId"
                      placeholder="STU12345"
                      value={signupData.studentId}
                      onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-responsive-sm font-medium">Email Address</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupMobile" className="text-responsive-sm font-medium">Mobile Number</Label>
                  <Input
                    id="signupMobile"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={signupData.mobile}
                    onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber" className="text-responsive-sm font-medium">Room Number</Label>
                    <Input
                      id="roomNumber"
                      placeholder="Room 201"
                      value={signupData.roomNumber}
                      onChange={(e) => setSignupData({ ...signupData, roomNumber: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="block" className="text-responsive-sm font-medium">Block</Label>
                    <Select
                      value={signupData.block}
                      onValueChange={(value) => setSignupData({ ...signupData, block: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12">
                        <SelectValue placeholder="Select Block" />
                      </SelectTrigger>
                      <SelectContent className="bg-background/95 backdrop-blur-md border-border/50">
                        <SelectItem value="Block A">Block A</SelectItem>
                        <SelectItem value="Block B">Block B</SelectItem>
                        <SelectItem value="Block C">Block C</SelectItem>
                        <SelectItem value="Block D">Block D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-responsive-sm font-medium">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-responsive-sm font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="bg-muted/30 border-border/50 focus:bg-background transition-colors h-12"
                    required
                    disabled={loading}
                  />
                  {signupData.password !== signupData.confirmPassword && signupData.confirmPassword && (
                    <p className="text-responsive-sm text-destructive font-medium">Passwords do not match</p>
                  )}
                </div>

                {error && <div className="text-destructive text-sm font-medium">{error}</div>}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground btn-professional font-semibold"
                  disabled={signupData.password !== signupData.confirmPassword || loading}
                >
                  {loading ? 'Creating Account...' : 'Create Student Account'}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="text-responsive-sm text-muted-foreground hover:text-foreground font-medium underline-offset-4 hover:underline transition-colors"
                    disabled={loading}
                  >
                    Already have an account? Login here
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
