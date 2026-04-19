import { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';
import Button from './Button';

export default function SentimentAnalysis() {
  const [analytics, setAnalytics] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics
      const analyticsRes = await feedbackAPI.getAnalytics();
      setAnalytics(analyticsRes.data);

      // Fetch recent feedback
      const recentRes = await feedbackAPI.getRecent();
      setRecentFeedback(recentRes.data);

      // Check model status
      const statusRes = await feedbackAPI.checkModel();
      setModelStatus(statusRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch sentiment data');
      console.error('Error fetching sentiment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentBadgeColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading sentiment analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Button
          onClick={fetchSentimentData}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Status */}
      {modelStatus && (
        <div className={`p-4 rounded-lg border ${modelStatus.loaded ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className="text-sm font-medium">
            {modelStatus.loaded ? '✓ Sentiment Model Loaded' : '⚠ Sentiment Model Not Ready'}
          </p>
          {modelStatus.loaded && (
            <p className="text-xs text-gray-600 mt-1">Model path: {modelStatus.model_path}</p>
          )}
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Feedback */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Total Feedback</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.total_feedback}</p>
          </div>

          {/* Positive */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Positive</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{analytics.counts.positive}</p>
            <p className="text-xs text-green-600 mt-1">{analytics.percentages.positive.toFixed(1)}%</p>
          </div>

          {/* Negative */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Negative</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{analytics.counts.negative}</p>
            <p className="text-xs text-red-600 mt-1">{analytics.percentages.negative.toFixed(1)}%</p>
          </div>

          {/* Neutral */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Neutral</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{analytics.counts.neutral}</p>
            <p className="text-xs text-yellow-600 mt-1">{analytics.percentages.neutral.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Sentiment Chart (Simple Bar Visualization) */}
      {analytics && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Sentiment Distribution</h3>
          <div className="space-y-4">
            {/* Positive Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Positive</span>
                <span className="text-sm font-semibold text-green-600">
                  {analytics.percentages.positive.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${analytics.percentages.positive}%` }}
                ></div>
              </div>
            </div>

            {/* Negative Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Negative</span>
                <span className="text-sm font-semibold text-red-600">
                  {analytics.percentages.negative.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${analytics.percentages.negative}%` }}
                ></div>
              </div>
            </div>

            {/* Neutral Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Neutral</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {analytics.percentages.neutral.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full transition-all duration-300"
                  style={{ width: `${analytics.percentages.neutral}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Feedback</h3>
          <Button
            onClick={fetchSentimentData}
            className="text-sm bg-gray-600 hover:bg-gray-700"
          >
            Refresh
          </Button>
        </div>

        {recentFeedback.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Feedback</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sentiment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Confidence</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedback.map((feedback) => (
                  <tr key={feedback.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">
                      {feedback.user_email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-2xl">
                      {feedback.message}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {feedback.rating ? (
                        <span className="inline-flex items-center">
                          {'⭐'.repeat(feedback.rating)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getSentimentBadgeColor(
                          feedback.sentiment
                        )}`}
                      >
                        {feedback.sentiment || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {feedback.sentiment_confidence
                        ? (feedback.sentiment_confidence * 100).toFixed(1) + '%'
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No feedback yet</p>
        )}
      </div>
    </div>
  );
}
