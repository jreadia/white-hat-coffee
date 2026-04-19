import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { productAPI, orderAPI, apiClient } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);

  // Orders state
  const [orders, setOrders] = useState([]);

  // Form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null,
  });

  // Load products and orders on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsResponse = await productAPI.getAdminList();
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.products);
        }
        
        const ordersResponse = await orderAPI.getAll();
        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.orders);
        }

        console.log('Products and orders loaded from API');
      } catch (err) {
        setError('Failed to load data from API.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Redirect if not authenticated (but wait for auth to load first)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', parseFloat(formData.price));
      data.append('available', true);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await apiClient.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setProducts([...products, response.data.product]);
        setFormData({ name: '', price: '', image: null });
        alert('Product added successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: null,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', parseFloat(formData.price));
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await apiClient.patch(`/products/${editingProduct}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct
              ? { ...response.data.product }
              : p
          )
        );
        setEditingProduct(null);
        setFormData({ name: '', price: '', image: null });
        alert('Product updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await productAPI.delete(id);
        
        // Handle 204 NO_CONTENT response (standard for successful delete)
        if (response.status === 204 || response.data?.success) {
          setProducts(products.filter((p) => p.id !== id));
          alert('Product deleted successfully!');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete product');
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const product = products.find((p) => p.id === id);
      const response = await productAPI.update(id, { available: !product.available });
      
      if (response.data.success) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, available: !p.available } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update availability');
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      const response = await orderAPI.updateStatus(orderId, 'ready');
      
      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: 'ready' } : order
          )
        );
        alert('Order marked as ready!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, newStatus);
      
      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await orderAPI.cancel(orderId);
        
        if (response.data.success) {
          setOrders(
            orders.map((order) =>
              order.id === orderId ? { ...order, status: 'cancelled' } : order
            )
          );
          alert('Order cancelled successfully');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to cancel order');
      }
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
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
        {/* Sign Out Button */}
        <Button variant="outline" onClick={handleSignOut} className="px-4 py-1">
          Sign Out
        </Button>
      </div>

      {/* Admin Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-teal-700 mb-8">ADMIN DASHBOARD</h1>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 font-bold rounded border-2 transition ${
              activeTab === 'products'
                ? 'bg-yellow-200 border-teal-700 text-teal-700'
                : 'bg-white border-gray-400 text-gray-700 hover:border-teal-700'
            }`}
          >
            Product Editor
          </button>
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-6 py-2 font-bold rounded border-2 transition ${
              activeTab === 'sentiment'
                ? 'bg-yellow-200 border-teal-700 text-teal-700'
                : 'bg-white border-gray-400 text-gray-700 hover:border-teal-700'
            }`}
          >
            Sentiment Analysis
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 font-bold rounded border-2 transition ${
              activeTab === 'orders'
                ? 'bg-yellow-200 border-teal-700 text-teal-700'
                : 'bg-white border-gray-400 text-gray-700 hover:border-teal-700'
            }`}
          >
            Pending Orders
          </button>
        </div>

        {/* Product Editor Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 gap-8">
            {/* Product Form */}
            <div className="border-2 border-gray-400 rounded-lg p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingProduct ? 'EDIT PRODUCT' : formData.name || 'NEW PRODUCT'}
              </h2>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block font-bold text-gray-700 mb-2">NAME:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* Price Input */}
              <div className="mb-6">
                <label className="block font-bold text-gray-700 mb-2">PRICE:</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold">PHP</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block font-bold text-gray-700 mb-2">
                  IMPORT PICTURE:
                </label>
                <label className="flex items-center justify-center cursor-pointer gap-2">
                  <span className="text-xl">📁</span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="text-sm text-gray-600">ADD PICTURE</span>
                </label>
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-sm text-green-600">✓ {formData.image.name}</p>
                    <img 
                      src={URL.createObjectURL(formData.image)} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  variant="dark"
                  onClick={editingProduct ? handleSaveEdit : handleAddProduct}
                  className="flex-1"
                >
                  {editingProduct ? 'SAVE EDIT' : 'ADD PRODUCT'}
                </Button>
                {editingProduct && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ name: '', price: '', image: null });
                    }}
                    className="flex-1"
                  >
                    CANCEL
                  </Button>
                )}
              </div>

              {editingProduct && (
                <Button
                  onClick={() => {
                    handleDeleteProduct(editingProduct);
                    setEditingProduct(null);
                    setFormData({ name: '', price: '', image: null });
                  }}
                  className="w-full !bg-red-500 !text-white hover:!bg-red-600"
                >
                  DELETE PRODUCT
                </Button>
              )}
            </div>

            {/* Products List */}
            <div className="border-2 border-gray-400 rounded-lg p-6 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-yellow-200">
                      <th className="px-3 py-2 text-left font-bold">Image</th>
                      <th className="px-3 py-2 text-left font-bold">Product Name</th>
                      <th className="px-3 py-2 text-left font-bold">Price</th>
                      <th className="px-3 py-2 text-left font-bold">Status</th>
                      <th className="px-3 py-2 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <span className="text-2xl">☕</span>
                          )}
                        </td>
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2">PHP {parseFloat(product.price).toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold text-white ${
                              product.available ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {product.available ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-2 py-1 border border-gray-400 rounded text-xs font-bold hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(product.id)}
                            className={`px-2 py-1 rounded text-xs font-bold text-white ${
                              product.available ? 'bg-red-500' : 'bg-green-500'
                            } hover:opacity-90`}
                          >
                            {product.available ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-2 py-1 rounded text-xs font-bold text-white bg-red-700 hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sentiment Analysis Tab */}
        {activeTab === 'sentiment' && (
          <div className="border-2 border-gray-400 rounded-lg p-8 bg-white">
            <div className="grid grid-cols-3 gap-8">
              {/* Left Side - Overall Sentiment Feedback */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-gray-800 writing-vertical">
                  OVERALL SENTIMENT FEEDBACK
                </h3>
                
                {/* Positive Card */}
                <div className="border-4 border-green-500 rounded-lg p-6 bg-green-50 text-center">
                  <div className="text-5xl mb-2">😊</div>
                  <p className="text-sm font-bold text-gray-800 mb-2">Overall Positive</p>
                  <p className="text-sm text-gray-700 mb-2">Feedback</p>
                  <p className="text-4xl font-bold text-green-600">67%</p>
                </div>

                {/* Neutral Card */}
                <div className="border-4 border-yellow-500 rounded-lg p-6 bg-yellow-50 text-center">
                  <div className="text-5xl mb-2">😐</div>
                  <p className="text-sm font-bold text-gray-800 mb-2">Overall Neutral</p>
                  <p className="text-sm text-gray-700 mb-2">Feedback</p>
                  <p className="text-4xl font-bold text-yellow-600">24%</p>
                </div>

                {/* Negative Card */}
                <div className="border-4 border-red-500 rounded-lg p-6 bg-red-50 text-center">
                  <div className="text-5xl mb-2">😞</div>
                  <p className="text-sm font-bold text-gray-800 mb-2">Overall Negative</p>
                  <p className="text-sm text-gray-700 mb-2">Feedback</p>
                  <p className="text-4xl font-bold text-red-600">12%</p>
                </div>
              </div>

              {/* Middle - Sentiment Keywords */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-6">Sentiment Feedback Keywords</h3>
                
                {/* Positive Keywords */}
                <div className="border-4 border-green-500 rounded-lg p-4 mb-4 bg-green-50">
                  <h4 className="font-bold text-green-700 mb-3">POSITIVE</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Good</li>
                    <li>Best</li>
                    <li>Favorite</li>
                    <li>Delicious</li>
                  </ol>
                </div>

                {/* Neutral Keywords */}
                <div className="border-4 border-yellow-500 rounded-lg p-4 mb-4 bg-yellow-50">
                  <h4 className="font-bold text-yellow-700 mb-3">NEUTRAL</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Okay</li>
                    <li>Nice</li>
                    <li>Clean</li>
                  </ol>
                </div>

                {/* Negative Keywords */}
                <div className="border-4 border-red-500 rounded-lg p-4 bg-red-50">
                  <h4 className="font-bold text-red-700 mb-3">NEGATIVE</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Horrible</li>
                    <li>Bitter</li>
                    <li>Expensive</li>
                    <li>Bad</li>
                  </ol>
                </div>
              </div>

              {/* Right Side - Empty for layout */}
              <div></div>
            </div>

            {/* Sentiment Trends Chart */}
            <div className="mt-12 pt-8 border-t-2 border-gray-300">
              <h3 className="text-lg font-bold text-gray-800 mb-8">Sentiment Trends for the Last 5 Days</h3>
              
              <div className="flex justify-between items-end gap-8 h-48">
                {/* Monday */}
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-40 mb-2">
                    <div className="bg-green-500 w-8 h-20" style={{ height: '55%' }}></div>
                    <div className="bg-yellow-400 w-8 h-12" style={{ height: '30%' }}></div>
                    <div className="bg-red-500 w-8 h-6" style={{ height: '15%' }}></div>
                  </div>
                  <div className="text-xs font-bold text-gray-600 text-center mb-2">55% | 30% | 15%</div>
                  <div className="text-xs text-gray-600 text-center">Pos | Neu | Neg</div>
                  <div className="text-xs font-bold text-gray-700 text-center mt-2">Mon</div>
                </div>

                {/* Tuesday */}
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-40 mb-2">
                    <div className="bg-green-500 w-8" style={{ height: '65%' }}></div>
                    <div className="bg-yellow-400 w-8" style={{ height: '25%' }}></div>
                    <div className="bg-red-500 w-8" style={{ height: '10%' }}></div>
                  </div>
                  <div className="text-xs font-bold text-gray-600 text-center mb-2">65% | 25% | 10%</div>
                  <div className="text-xs text-gray-600 text-center">Pos | Neu | Neg</div>
                  <div className="text-xs font-bold text-gray-700 text-center mt-2">Tue</div>
                </div>

                {/* Wednesday */}
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-40 mb-2">
                    <div className="bg-green-500 w-8" style={{ height: '40%' }}></div>
                    <div className="bg-yellow-400 w-8" style={{ height: '45%' }}></div>
                    <div className="bg-red-500 w-8" style={{ height: '15%' }}></div>
                  </div>
                  <div className="text-xs font-bold text-gray-600 text-center mb-2">40% | 45% | 15%</div>
                  <div className="text-xs text-gray-600 text-center">Pos | Neu | Neg</div>
                  <div className="text-xs font-bold text-gray-700 text-center mt-2">Wed</div>
                </div>

                {/* Thursday */}
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-40 mb-2">
                    <div className="bg-green-500 w-8" style={{ height: '70%' }}></div>
                    <div className="bg-yellow-400 w-8" style={{ height: '20%' }}></div>
                    <div className="bg-red-500 w-8" style={{ height: '10%' }}></div>
                  </div>
                  <div className="text-xs font-bold text-gray-600 text-center mb-2">70% | 20% | 10%</div>
                  <div className="text-xs text-gray-600 text-center">Pos | Neu | Neg</div>
                  <div className="text-xs font-bold text-gray-700 text-center mt-2">Thu</div>
                </div>

                {/* Friday */}
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-40 mb-2">
                    <div className="bg-green-500 w-8" style={{ height: '80%' }}></div>
                    <div className="bg-yellow-400 w-8" style={{ height: '10%' }}></div>
                    <div className="bg-red-500 w-8" style={{ height: '10%' }}></div>
                  </div>
                  <div className="text-xs font-bold text-gray-600 text-center mb-2">80% | 10% | 10%</div>
                  <div className="text-xs text-gray-600 text-center">Pos | Neu | Neg</div>
                  <div className="text-xs font-bold text-gray-700 text-center mt-2">Fri</div>
                </div>
              </div>
            </div>

            {/* Backend Note */}
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="text-sm text-blue-800">
                <strong>📊 Note:</strong> This is the UI design. Backend integration with SVM, k-NN, and Naive Bayes sentiment analysis models will process actual feedback data and populate these charts dynamically.
              </p>
            </div>
          </div>
        )}

        {/* Pending Orders Tab */}
        {activeTab === 'orders' && (
          <div className="border-2 border-gray-400 rounded-lg p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ORDER MANAGEMENT</h2>
            
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-200 border-2 border-gray-400">
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-left">Order ID</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-left">Customer</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Items</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-right">Total</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-left">Status</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Date</th>
                      <th className="border-2 border-gray-400 px-4 py-3 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-2 border-gray-300 hover:bg-yellow-50">
                        <td className="border-2 border-gray-300 px-4 py-3 font-bold text-teal-700">#{order.id}</td>
                        <td className="border-2 border-gray-300 px-4 py-3">{order.user?.email || 'Unknown'}</td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-center">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-right font-bold">
                          PHP {parseFloat(order.total_price || 0).toFixed(2)}
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={order.status === 'cancelled' || order.status === 'completed'}
                            className={`px-3 py-1 font-bold rounded border-2 text-sm cursor-pointer ${
                              order.status === 'pending'
                                ? 'bg-yellow-200 border-yellow-600 text-gray-800'
                                : order.status === 'confirmed'
                                ? 'bg-blue-200 border-blue-600 text-gray-800'
                                : order.status === 'preparing'
                                ? 'bg-purple-200 border-purple-600 text-gray-800'
                                : order.status === 'ready'
                                ? 'bg-green-200 border-green-600 text-gray-800'
                                : order.status === 'completed'
                                ? 'bg-teal-200 border-teal-600 text-gray-800'
                                : 'bg-red-200 border-red-600 text-gray-800'
                            } ${order.status === 'cancelled' || order.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-sm text-gray-600">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-center">
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded hover:bg-red-600 transition"
                            >
                              Cancel
                            </button>
                          )}
                          {order.status === 'cancelled' && (
                            <span className="text-red-600 font-bold">Cancelled</span>
                          )}
                          {order.status === 'completed' && (
                            <span className="text-green-600 font-bold">✓ Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}

            {/* Backend Note */}
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="text-sm text-blue-800">
                <strong>📦 Status Levels:</strong> Pending → Confirmed → Preparing → Ready → Completed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
