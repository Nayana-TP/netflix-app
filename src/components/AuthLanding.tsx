import React, { useState } from 'react';
import { authService, tokenStorage, User } from '../services/authService';

interface AuthLandingProps {
  onLoginSuccess: (user: User) => void;
}

const AuthLanding: React.FC<AuthLandingProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    user_name: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginData);
      
      if (response.success && response.token && response.user) {
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);
        setSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          onLoginSuccess(response.user!);
        }, 1500);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration form submitted!');
    setLoading(true);
    setError('');

    // Log form data before validation
    console.log('Form data before validation:', registerData);

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      console.log('Password validation failed');
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      console.log('Password length validation failed');
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Check if all required fields are filled
    if (!registerData.user_name || !registerData.email || !registerData.password) {
      console.log('Required fields validation failed');
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    console.log('All validations passed, proceeding with registration...');

    try {
      const { confirmPassword, ...userData } = registerData;
      console.log('Sending registration data:', userData);
      const response = await authService.register(userData);
      console.log('Registration response:', response);
      
      if (response.success) {
        setSuccess('Registration successful! You can now login.');
        
        // Switch to login form after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          // Pre-fill username for login
          setLoginData({
            user_name: registerData.user_name,
            password: '',
          });
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 -bottom-20 -right-20 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Netflix Clone
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the magic of cinema with our streaming platform. 
            Discover thousands of movies and TV shows from around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-semibold text-white mb-4">Why Join Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="text-white font-medium">Unlimited Streaming</h4>
                    <p className="text-gray-300 text-sm">Watch thousands of movies and shows anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="text-white font-medium">Personalized Experience</h4>
                    <p className="text-gray-300 text-sm">Get recommendations based on your viewing history</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="text-white font-medium">HD Quality</h4>
                    <p className="text-gray-300 text-sm">Enjoy crystal-clear video quality on all devices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="text-white font-medium">Exclusive Content</h4>
                    <p className="text-gray-300 text-sm">Access original series and movies you won't find anywhere else</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-3">Join Millions of Users</h3>
              <p className="text-gray-300 text-sm mb-4">
                Start your journey with us today and transform your entertainment experience.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-white">10M+</div>
                <div className="text-gray-300">Active Users Worldwide</div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            {/* Toggle Buttons */}
            <div className="flex mb-6 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
                {success}
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginData.user_name}
                    onChange={(e) => setLoginData({ ...loginData, user_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={registerData.user_name}
                    onChange={(e) => setRegisterData({ ...registerData, user_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Choose a username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={registerData.phone_number}
                    onChange={(e) => setRegisterData({ ...registerData, phone_number: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
