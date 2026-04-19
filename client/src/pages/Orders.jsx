import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { orderAPI } from '../services/api';

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await orderAPI.getAll();
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 border-yellow-600 text-gray-800';
      case 'confirmed':
        return 'bg-blue-200 border-blue-600 text-gray-800';
      case 'preparing':
        return 'bg-purple-200 border-purple-600 text-gray-800';
      case 'ready':
        return 'bg-green-200 border-green-600 text-gray-800';
      case 'completed':
        return 'bg-teal-200 border-teal-600 text-gray-800';
      case 'cancelled':
        return 'bg-red-200 border-red-600 text-gray-800';
      default:
        return 'bg-gray-200 border-gray-600 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <p className="text-2xl text-teal-700 font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Top Banner */}
      <div className="bg-teal-700 text-white py-4 px-4 flex justify-between items-center">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-4 flex-1">
          <Logo white={false} />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">White Hat Coffee</h1>
            <p className="text-sm">start your day right with White Hat.</p>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/menu')} 
            className="px-4 py-1"
          >
            Menu
          </Button>
          <Button variant="outline" onClick={handleLogout} className="px-4 py-1">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-teal-700 mb-8">MY ORDERS</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded text-red-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto border-2 border-gray-400 rounded-lg bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-200 border-2 border-gray-400">
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-left">Order ID</th>
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Items</th>
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-right">Total</th>
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-left">Status</th>
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Payment Method</th>
                  <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Date Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-2 border-gray-300 hover:bg-yellow-50">
                    <td className="border-2 border-gray-300 px-4 py-3 font-bold text-teal-700">
                      #{order.id}
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-right font-bold">
                      PHP {parseFloat(order.total_price || 0).toFixed(2)}
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3">
                      <span className={`px-3 py-1 font-bold rounded border-2 text-sm inline-block ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-gray-700">
                      {order.payment_method || 'N/A'}
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm text-gray-600">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-2 border-gray-400 rounded-lg p-12 bg-white text-center">
            <p className="text-gray-600 text-lg mb-4">No orders yet</p>
            <Button 
              variant="dark"
              onClick={() => navigate('/menu')}
            >
              Start Shopping
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
          <p className="text-sm text-blue-800">
            <strong>📦 Order Status:</strong> Track your orders here. Status updates from Pending → Confirmed → Preparing → Ready → Completed
          </p>
        </div>
      </div>
    </div>
  );
}
