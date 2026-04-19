import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load customer profile on mount
  useEffect(() => {
    const loadCustomerProfile = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call once backend is ready
        // const response = await customerAPI.getProfile();
        // setCustomer(response.data);

        // Sample customer data for testing
        const sampleCustomer = {
          name: 'Juan Dela Cruz',
          phone: '09122234566',
          buildingNumber: '123',
          streetName: 'Remedios Street',
          streetAddress: 'Remedios Circle',
          state: 'Metro Manila',
          city: 'Manila',
        };
        setCustomer(sampleCustomer);
      } catch (err) {
        setError('Failed to load customer profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomerProfile();
  }, []);

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

    try {
      // TODO: Replace with actual API call once backend is ready
      // const orderData = {
      //   items: cartItems,
      //   totalPrice: sumTotal,
      //   paymentMethod: selectedPayment,
      //   customerId: customer.id,
      // };
      // const response = await orderAPI.create(orderData);
      // if (response.status === 201) {
      //   clearCart();
      //   alert('Order placed successfully!');
      //   navigate('/');
      // }

      // Simulate order submission
      console.log('Order submitted:', {
        items: cartItems,
        totalPrice: sumTotal,
        paymentMethod: selectedPayment,
      });
      alert(`Order placed with ${selectedPayment}! Total: PHP ${sumTotal}\nBackend integration coming soon!`);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
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
                <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b-2 border-gray-400">
                  <h3 className="text-lg font-bold text-gray-800">Product</h3>
                  <h3 className="text-lg font-bold text-gray-800 text-center">Quantity</h3>
                  <h3 className="text-lg font-bold text-gray-800 text-right">TOTAL</h3>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-300">
                      <p className="text-gray-700 font-semibold">{item.name}</p>
                      <p className="text-gray-700 text-center font-semibold">{item.quantity}</p>
                      <p className="text-gray-700 text-right font-semibold">PHP {item.price * item.quantity}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                )}

                {/* Sum Total */}
                {cartItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-400">
                    <p className="text-lg font-bold text-gray-800">SUM TOTAL</p>
                    <p></p>
                    <p className="text-lg font-bold text-gray-800 text-right">PHP {sumTotal}</p>
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
              {/* Customer Profile */}
              {customer && (
                <div className="border-2 border-gray-400 rounded-lg p-8 bg-white">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Profile</h2>
                  
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <p className="font-bold text-gray-800">{customer.name}</p>
                      <p className="text-gray-700">{customer.phone}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-300">
                      <p className="font-bold text-gray-800 mb-2">Building Number: <span className="font-normal">{customer.buildingNumber}</span></p>
                      <p className="font-bold text-gray-800 mb-2">Street Name: <span className="font-normal">{customer.streetName}</span></p>
                      <p className="font-bold text-gray-800 mb-2">Street Address: <span className="font-normal">{customer.streetAddress}</span></p>
                      <p className="font-bold text-gray-800 mb-2">State: <span className="font-normal">{customer.state}</span></p>
                      <p className="font-bold text-gray-800">City: <span className="font-normal">{customer.city}</span></p>
                    </div>
                  </div>
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

              {/* Backend Note */}
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded">
                <p className="text-sm text-blue-800">
                  <strong>📦 Note:</strong> Cart is persisted in localStorage. Customer profile and payment processing will be connected to backend APIs once ready.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
