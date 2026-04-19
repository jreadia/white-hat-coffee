import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import FormTextarea from '../components/FormTextarea';

export default function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return false;
    }
    if (feedback.trim().length < 10) {
      setError('Feedback must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call once backend is ready
      // const response = await feedbackAPI.submit({ feedback });
      // if (response.status === 201) {
      //   alert('Thank you for your feedback!');
      //   setFeedback('');
      //   navigate('/');
      // }

      // Simulate API call
      console.log('Feedback submitted:', feedback);
      setTimeout(() => {
        alert('Thank you for your feedback!');
        setFeedback('');
        navigate('/');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-yellow-50">
      {/* Top Banner */}
      <div className="bg-teal-700 text-white py-4 text-center">
        <p className="text-lg">start your day right with <span className="underline">White Hat.</span></p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-gray-700 hover:text-gray-900 transition"
        >
          ← Back to Home
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo clickable={true} white={true} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
          THANK YOU FOR CHOOSING WHITE HAT COFFEE!
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-800 text-center mb-12">
          Your insights matter to us. Let us know what you think about our products and services by submitting your feedback.
        </p>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-300">
              {error}
            </div>
          )}

          {/* Feedback Textarea */}
          <FormTextarea
            label="Your Feedback"
            name="feedback"
            value={feedback}
            onChange={handleInputChange}
            placeholder="Insert Text Here"
            error={error && error.includes('at least') ? error : ''}
            rows={8}
            required={true}
          />

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <Button
              type="submit"
              variant="dark"
              disabled={isLoading}
              className="uppercase tracking-wider"
            >
              {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
