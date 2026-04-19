import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';

const Menu = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample product data - Replace with API call once backend is ready
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        // const response = await productAPI.getAll();
        // setProducts(response.data);

        // Sample data for testing
        const sampleProducts = [
          { id: 1, name: 'Matcha Frappuccino', price: 160, category: 'Frappes', image: 'matcha.jpg' },
          { id: 2, name: 'Strawberry Frappuccino', price: 130, category: 'Frappes', image: 'strawberry.jpg' },
          { id: 3, name: 'Green Apple Frappuccino', price: 130, category: 'Frappes', image: 'green-apple.jpg' },
          { id: 4, name: 'Blueberry Frappuccino', price: 130, category: 'Frappes', image: 'blueberry.jpg' },
          { id: 5, name: 'Oreo Frappuccino', price: 160, category: 'Frappes', image: 'oreo.jpg' },
          { id: 6, name: 'Java Chip Frappuccino', price: 160, category: 'Frappes', image: 'java-chip.jpg' },
        ];
        setProducts(sampleProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Handle Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  // Handle Logout
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-teal-800 text-white py-2 px-6 text-center">
        <p className="text-sm">start your day right with <span className="font-bold">White Hat</span>.</p>
      </div>

      {/* Navigation Bar */}
      <div className="bg-amber-50 px-6 py-4 flex justify-between items-center border-b-2 border-gray-300">
        <div className="flex gap-8">
          <button onClick={() => navigate('/')} className="text-gray-800 font-semibold hover:text-teal-700">
            HOME
          </button>
          <button onClick={() => window.scrollTo(0, 0)} className="text-gray-800 font-semibold hover:text-teal-700">
            ABOUT US
          </button>
        </div>
        <button onClick={handleLogout} className="text-gray-800 font-semibold hover:text-teal-700">
          LOG OUT
        </button>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen bg-amber-50">
        {/* Left Sidebar */}
        <div className="w-1/4 p-6 bg-amber-50">
          {/* Sidebar Menu */}
          <div className="border-2 border-gray-400 rounded-lg p-6 bg-white">
            {/* Drinks Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-teal-800 mb-4 uppercase">Drinks</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <button
                    onClick={() => setSelectedCategory('Frappes')}
                    className={`hover:text-teal-700 font-semibold ${selectedCategory === 'Frappes' ? 'text-teal-700' : ''}`}
                  >
                    Frappes
                  </button>
                </li>
                <li>
                  <button className="hover:text-teal-700 font-semibold">
                    Espresso
                  </button>
                </li>
                <li>
                  <button className="hover:text-teal-700 font-semibold">
                    Tea Series
                  </button>
                </li>
                <li>
                  <button className="hover:text-teal-700 font-semibold">
                    Non-Coffee
                  </button>
                </li>
              </ul>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Food Menu Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-teal-800 mb-4 uppercase">Food Menu</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <button className="hover:text-teal-700 font-semibold">
                    All Day Favorites
                  </button>
                </li>
                <li>
                  <button className="hover:text-teal-700 font-semibold">
                    Ala-Carte
                  </button>
                </li>
              </ul>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Checkout Button */}
            <div className="pt-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                CHECK OUT →
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area - Products Grid */}
        <div className="w-3/4 p-8">
          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border-2 border-gray-400 rounded-lg p-6 bg-white flex flex-col items-center text-center hover:shadow-lg transition"
              >
                {/* Product Image Placeholder */}
                <div className="w-40 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4 border border-gray-300">
                  <div className="text-6xl">☕</div>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>

                {/* Price */}
                <p className="text-teal-700 font-bold text-lg mb-4">PHP {product.price}</p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <span>Add to Cart</span>
                  <span>🛒</span>
                </button>
              </div>
            ))}
          </div>

          {/* Backend Note */}
          <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📦 Note:</strong> This is the menu/shop page structure. Product images, categories, cart persistence, and checkout payment integration will be connected to the backend once the API is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
