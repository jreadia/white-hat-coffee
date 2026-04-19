import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Button from '../components/Button';
import FormTextarea from '../components/FormTextarea';
import { feedbackAPI } from '../services/api';

export default function Feedback() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({ message: '', rating: 5 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.message.trim()) {
      setError('Please enter your feedback');
      return false;
    }
    if (formData.message.trim().length < 10) {
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
      const response = await feedbackAPI.submit({
        message: formData.message,
        rating: formData.rating,
      });

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({ message: '', rating: 5 });

        setTimeout(() => {
          navigate('/menu');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit feedback. Please try again.'
      );
      console.error('Error submitting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Top Banner */}
      <div className="bg-teal-700 text-white py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <Logo white={false} />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">White Hat Coffee</h1>
            <p className="text-sm">start your day right with White Hat.</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="px-4 py-1">
          Sign Out
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-teal-700 mb-2 text-center">FEEDBACK</h1>
        <p className="text-gray-700 text-center mb-8">
          Help us improve by sharing your experience with White Hat Coffee
        </p>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You!</h2>
            <p className="text-gray-700 mb-4">
              Your feedback has been received and will be analyzed to help us improve.
            </p>
            <p className="text-sm text-gray-600">
              Redirecting to menu in 2 seconds...
            </p>
            <Button onClick={() => navigate('/menu')} className="mt-6 bg-green-600 hover:bg-green-700">
              Back to Menu
            </Button>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-400 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block font-bold text-gray-700 mb-3">
                  Rate Your Experience:
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className={`text-4xl transition transform hover:scale-110 ${
                          star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    {formData.rating}/5 stars
                  </span>
                </div>
              </div>

              {/* Feedback Message */}
              <FormTextarea
                label="YOUR FEEDBACK:"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us what you think about our coffee and service..."
                required
              />

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3"
              >
                {isLoading ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
              </Button>
            </form>

            {/* Info Message */}
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="text-sm text-blue-800">
                <strong>💭 Note:</strong> Your feedback will be analyzed using our sentiment analysis
                model to help us understand customer experiences better.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
