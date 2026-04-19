import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productAPI } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';

const Menu = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productAPI.getAll();
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts = products;

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

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header with logout button */}
      <Header />

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

            {/* Orders and Checkout Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                MY ORDERS
              </button>
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
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border-2 border-gray-400 rounded-lg p-6 bg-white flex flex-col items-center text-center hover:shadow-lg transition"
                  >
                    {/* Product Image - Standardized 160x160px */}
                    <div className="w-40 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4 border border-gray-300 flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-40 h-40 object-cover rounded-lg" />
                      ) : (
                        <div className="text-6xl">☕</div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>

                    {/* Product Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {/* Price */}
                    <p className="text-teal-700 font-bold text-lg mb-4">PHP {parseFloat(product.price).toFixed(2)}</p>

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


            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
