import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, '')))
      newErrors.phoneNumber = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Uncomment when backend is ready
    // const result = await signup(formData);
    // if (result.success) {
    //   alert(result.message);
    //   navigate('/login');
    // } else {
    //   setErrors({ submit: result.error });
    // }

    // For now, simulate signup
    console.log('Sign up data:', formData);
    alert('Backend API not connected yet. Form validation working correctly!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white hover:text-gray-200 transition"
      >
        ← Back to Home
      </button>

      {/* Logo */}
      <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <Logo clickable={true} />
      </div>

      {/* Sign Up Heading */}
      <h1 className="text-5xl font-bold text-white mb-10 text-center">SIGN UP</h1>

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="w-full max-w-2xl">
        {errors.submit && (
          <div className="mb-6 p-3 bg-red-500 text-white rounded-md text-sm text-center">
            {errors.submit}
          </div>
        )}

        {/* First Row: First Name & Last Name */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            error={errors.firstName}
          />

          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            error={errors.lastName}
          />
        </div>

        {/* Second Row: Email & Phone Number */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <FormInput
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            error={errors.phoneNumber}
          />
        </div>

        {/* Third Row: Password & Confirm Password */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />
        </div>

        {/* Sign Up Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="secondary"
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </Button>
        </div>

        {/* Already have account link */}
        <p className="text-center text-gray-100 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-white font-semibold hover:underline"
          >
            Login here
          </button>
        </p>

        {/* Backend Note */}
        <div className="mt-6 p-3 bg-blue-300 bg-opacity-20 border border-blue-200 rounded text-blue-100 text-xs text-center">
          <strong>🔐 Note:</strong> Signup API integration pending. Form validation is working.
        </div>
      </form>
    </div>
  );
}
