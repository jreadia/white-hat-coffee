import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Products state
  const [products, setProducts] = useState([
    { id: 1, name: 'Matcha Frappuccino', price: 160.00, available: true },
    { id: 2, name: 'Mango Frappuccino', price: 130.00, available: false },
    { id: 3, name: 'Green Apple Frappuccino', price: 130.00, available: true },
    { id: 4, name: 'Oreo Frappuccino', price: 160.00, available: false },
  ]);

  // Orders state
  const [orders, setOrders] = useState([
    { id: 1, customerName: 'Juan Dela Cruz', totalPrice: 450, items: [{ name: 'Blueberry Frappuccino', quantity: 1 }, { name: 'Oreo Frappuccino', quantity: 2 }], paymentMethod: 'Cash On Delivery', status: 'pending' },
    { id: 2, customerName: 'Jane Doe', totalPrice: 480, items: [{ name: 'Matcha Frappuccino', quantity: 3 }], paymentMethod: 'GCash', status: 'pending' },
  ]);

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
        // TODO: Uncomment when backend is ready
        // const productsResponse = await productAPI.getAll();
        // setProducts(productsResponse.data);
        
        // const ordersResponse = await orderAPI.getAll();
        // setOrders(ordersResponse.data);

        // For now, use sample data above
        console.log('Products and orders loaded from local state (sample data)');
      } catch (err) {
        setError('Failed to load data. Using sample data for now.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    // TODO: Uncomment when auth is implemented
    // if (!isAuthenticated) {
    //   navigate('/login');
    // }
  }, [isAuthenticated, navigate]);

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
        image: file.name,
      }));
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await productAPI.create({
      //   name: formData.name,
      //   price: parseFloat(formData.price),
      //   image: formData.image,
      // });
      // setProducts([...products, response.data]);

      const newProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        name: formData.name,
        price: parseFloat(formData.price),
        available: true,
      };

      setProducts([...products, newProduct]);
      setFormData({ name: '', price: '', image: null });
      alert('Product added successfully!');
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
      // TODO: Replace with actual API call when backend is ready
      // await productAPI.update(editingProduct, {
      //   name: formData.name,
      //   price: parseFloat(formData.price),
      // });

      setProducts(
        products.map((p) =>
          p.id === editingProduct
            ? { ...p, name: formData.name, price: parseFloat(formData.price) }
            : p
        )
      );
      setEditingProduct(null);
      setFormData({ name: '', price: '', image: null });
      alert('Product updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await productAPI.delete(id);

        setProducts(products.filter((p) => p.id !== id));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to delete product');
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await productAPI.update(id, { available: !product.available });

      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, available: !p.available } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update availability');
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await orderAPI.updateStatus(orderId, 'ready');

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: 'ready' } : order
        )
      );
      alert('Order marked as ready!');
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Top Banner */}
      <div className="bg-teal-700 text-white py-3 px-4 flex justify-between items-center">
        <p className="text-center flex-1">
          start your day right with <span className="underline">White Hat.</span>
        </p>
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
                  <p className="text-sm text-green-600 mt-2">✓ {formData.image}</p>
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
                      <th className="px-3 py-2 text-left font-bold">Product Name</th>
                      <th className="px-3 py-2 text-left font-bold">Price</th>
                      <th className="px-3 py-2 text-left font-bold">Status</th>
                      <th className="px-3 py-2 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2">PHP {product.price.toFixed(2)}</td>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Orders</h2>
            {orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(order => order.status === 'pending').map((order) => (
                  <div key={order.id} className="border-2 border-gray-400 rounded-lg p-6 bg-yellow-50">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-yellow-300 text-gray-800 text-xs font-bold rounded">
                        Processing
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{order.customerName.toUpperCase()}</h3>
                    <p className="text-lg font-bold text-gray-700 mb-4">PHP {order.totalPrice.toFixed(2)}</p>
                    <div className="mb-4">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">
                          <span className="font-bold">›</span> {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-6">{order.paymentMethod}</p>
                    <Button 
                      variant="dark" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleMarkAsReady(order.id)}
                    >
                      <span>✓</span> Mark as Ready
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No pending orders</p>
            )}

            {/* Backend Note */}
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="text-sm text-blue-800">
                <strong>📦 Note:</strong> Orders are fetched from sample data. Once backend API is ready, orders will be loaded dynamically and "Mark as Ready" will update order status in the database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
