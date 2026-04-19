import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { customerAPI, orderAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, removeFromCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    building_number: '',
    street_name: '',
    street_address: '',
    state: '',
    city: '',
  });

  // Load customer profile from API on mount
  useEffect(() => {
    const loadCustomerProfile = async () => {
      setIsLoading(true);
      try {
        const response = await customerAPI.getProfile();
        if (response.data.success) {
          const profile = response.data.profile;
          setCustomer(profile);
          // Convert API response to form data
          const formattedData = {
            name: profile.first_name || '',
            phone: profile.phone_number || '',
            building_number: profile.building_number || '',
            street_name: profile.street_name || '',
            street_address: profile.street_address || '',
            state: profile.state || '',
            city: profile.city || '',
          };
          setFormData(formattedData);
          // Only show edit form if address fields are empty
          const hasCompleteAddress = profile.first_name && profile.phone_number && profile.building_number && profile.street_name && profile.street_address && profile.state && profile.city;
          setIsEditingAddress(!hasCompleteAddress);
        }
      } catch (err) {
        console.error('Failed to load customer profile:', err);
        // Initialize empty form if API call fails
        const emptyProfile = {
          name: '',
          phone: '',
          building_number: '',
          street_name: '',
          street_address: '',
          state: '',
          city: '',
        };
        setCustomer({ first_name: '', last_name: '', phone_number: '', building_number: '', street_name: '', street_address: '', state: '', city: '' });
        setFormData(emptyProfile);
        setIsEditingAddress(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomerProfile();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.building_number || !formData.street_name || !formData.street_address || !formData.state || !formData.city) {
      alert('Please fill in all address fields');
      return;
    }

    // Convert formData to snake_case for API
    const apiData = {
      first_name: formData.name,
      phone_number: formData.phone,
      building_number: formData.building_number,
      street_name: formData.street_name,
      street_address: formData.street_address,
      state: formData.state,
      city: formData.city,
    };

    setIsLoading(true);
    customerAPI.updateProfile(apiData)
      .then((response) => {
        if (response.data.success) {
          // Use API response directly for customer display
          const profileData = response.data.profile;
          setCustomer(profileData);
          // Update form data
          const formattedFormData = {
            name: profileData.first_name || '',
            phone: profileData.phone_number || '',
            building_number: profileData.building_number || '',
            street_name: profileData.street_name || '',
            street_address: profileData.street_address || '',
            state: profileData.state || '',
            city: profileData.city || '',
          };
          setFormData(formattedFormData);
          setIsEditingAddress(false);
        }
      })
      .catch((err) => {
        console.error('Failed to save address:', err);
        setError('Failed to save address. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Calculate totals
  const sumTotal = getTotalPrice();

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Verify customer has complete address
    if (!customer || !customer.building_number || !customer.street_name || !customer.street_address) {
      alert('Please complete your delivery address before checkout');
      setIsEditingAddress(true);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare order data for API
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price.toString()
        })),
        payment_method: selectedPayment,
        total_price: sumTotal.toString()
      };

      const response = await orderAPI.createFromCart(orderData);
      if (response.data.success) {
        const order = response.data.order;
        clearCart();
        alert(`Order #${order.id} placed successfully!\nTotal: PHP ${order.total_price}\nWe are preparing your order!`);
        navigate('/menu');
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-teal-800 text-white py-3 px-6 text-center">
        <p className="text-sm">start your day right with <span className="font-bold">White Hat</span>.</p>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/menu')}
          className="mb-6 text-teal-700 hover:text-teal-900 font-semibold transition flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div className="border-2 border-gray-400 rounded-lg p-8 bg-white">
              {/* Order Items Table */}
              <div className="mb-8">
                {/* Table Headers */}
                <div className="grid grid-cols-4 gap-4 mb-6 pb-4 border-b-2 border-gray-400">
                  <h3 className="text-lg font-bold text-gray-800">Product</h3>
                  <h3 className="text-lg font-bold text-gray-800 text-center">Quantity</h3>
                  <h3 className="text-lg font-bold text-gray-800 text-right">TOTAL</h3>
                  <h3 className="text-lg font-bold text-gray-800 text-right">Action</h3>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-300 items-center">
                      <p className="text-gray-700 font-semibold">{item.name}</p>
                      <p className="text-gray-700 text-center font-semibold">{item.quantity}</p>
                      <p className="text-gray-700 text-right font-semibold">PHP {item.price * item.quantity}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-right text-red-600 hover:text-red-800 font-bold transition"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                )}

                {/* Sum Total */}
                {cartItems.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t-2 border-gray-400">
                    <p className="text-lg font-bold text-gray-800">SUM TOTAL</p>
                    <p></p>
                    <p className="text-lg font-bold text-gray-800 text-right">PHP {sumTotal}</p>
                    <p></p>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              {cartItems.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-6">SELECT PAYMENT</h3>
                  <div className="flex justify-center gap-8">
                    {/* GCash Button */}
                    <button
                      onClick={() => setSelectedPayment('GCash')}
                      className={`px-8 py-3 rounded-lg font-bold text-white transition border-2 ${
                        selectedPayment === 'GCash'
                          ? 'bg-blue-600 border-blue-800'
                          : 'bg-blue-500 border-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      💳 GCash
                    </button>

                    {/* Cash On Delivery Button */}
                    <button
                      onClick={() => setSelectedPayment('Cash On Delivery')}
                      className={`px-8 py-3 rounded-lg font-bold text-white transition border-2 ${
                        selectedPayment === 'Cash On Delivery'
                          ? 'bg-yellow-700 border-yellow-900'
                          : 'bg-yellow-600 border-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      🚚 CASH ON DELIVERY
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Customer Profile & Checkout */}
            <div className="flex flex-col gap-8">
              {/* Customer Profile / Address Form */}
              {customer && (
                <div className="border-2 border-gray-400 rounded-lg p-8 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Delivery Address</h2>
                    <button
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-sm text-teal-700 hover:text-teal-900 font-semibold underline"
                    >
                      {isEditingAddress ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    // Address Form
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-gray-800 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="Juan Dela Cruz"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="09122234566"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">Building Number *</label>
                        <input
                          type="text"
                          name="building_number"
                          value={formData.building_number}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="123"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">Street Name *</label>
                        <input
                          type="text"
                          name="street_name"
                          value={formData.street_name}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="Remedios Street"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">Street Address *</label>
                        <input
                          type="text"
                          name="street_address"
                          value={formData.street_address}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="Remedios Circle"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">State/Province *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="Metro Manila"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-800 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleFormChange}
                          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                          placeholder="Manila"
                        />
                      </div>

                      <button
                        onClick={handleSaveAddress}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        Save Address
                      </button>
                    </div>
                  ) : (
                    // Display Profile
                    <div className="space-y-4 text-gray-700">
                      <div>
                        <p className="font-bold text-gray-800">{customer.first_name} {customer.last_name}</p>
                        <p className="text-gray-700">{customer.phone_number}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-300">
                        <p className="font-bold text-gray-800 mb-2">Building Number: <span className="font-normal">{customer.building_number}</span></p>
                        <p className="font-bold text-gray-800 mb-2">Street Name: <span className="font-normal">{customer.street_name}</span></p>
                        <p className="font-bold text-gray-800 mb-2">Street Address: <span className="font-normal">{customer.street_address}</span></p>
                        <p className="font-bold text-gray-800 mb-2">State: <span className="font-normal">{customer.state}</span></p>
                        <p className="font-bold text-gray-800">City: <span className="font-normal">{customer.city}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Checkout Button */}
              {cartItems.length > 0 && (
                <button
                  onClick={handleCheckout}
                  className="bg-yellow-700 hover:bg-yellow-800 text-gray-800 font-bold py-4 px-6 rounded-lg text-xl transition disabled:opacity-50"
                  disabled={cartItems.length === 0}
                >
                  CHECK OUT →
                </button>
              )}


            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
