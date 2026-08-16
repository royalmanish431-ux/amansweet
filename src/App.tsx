/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { useMenuData } from './hooks/useMenuData';
import MenuItemComponent from './components/MenuItem';
import { Search, ShoppingCart, MessageCircle, X, Trash2, Mic } from 'lucide-react';
import { MenuItem, CartItem } from './data';
import 'swiper/element/bundle';

export default function App() {
  const { data: menuData, loading, error } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = ['All', ...Array.from(new Set(menuData.map(item => item.category)))];

  const filteredData = menuData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.nativeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        showNotification(`${item.name} added to cart`);
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      showNotification(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const openCart = () => {
    const password = prompt("Please enter the password to open the cart:");
    if (password === "Aman") {
      setIsCartOpen(true);
    } else if (password !== null) {
      alert("Incorrect password!");
    }
  };

  const shareOnWhatsApp = async () => {
    const message = cart.map(item => `${item.name} (${item.quantity})${item.offer ? ` - Offer: ${item.offer}` : ''} - ₹${item.priceFull || item.priceHalf}`).join('\n');
    const total = cart.reduce((sum, item) => sum + (parseInt(item.priceFull || item.priceHalf || '0') * item.quantity), 0);
    const text = `*Aman Sweet* - Order Request:\n\n${message}\n\n*Total: ₹${total}*\n\n_Thank you for ordering with us!_`;
    
    if (navigator.canShare && navigator.canShare({ files: selectedFile ? [selectedFile] : [] })) {
      try {
        await navigator.share({
          title: 'Aman Sweet Order',
          text: text,
          files: selectedFile ? [selectedFile] : []
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event: any) => {
        setSearchQuery(event.results[0][0].transcript);
      };
    } else {
      alert('Voice search not supported in this browser.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-600">Loading menu...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-600">Error loading menu: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="relative p-6 text-white text-center overflow-hidden">
        <img 
          src="/src/assets/images/header_3d_sweets_bg_1786805389446.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-blue-900/90"></div>
        <div className="relative z-10">
          {notification && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-teal-600 text-white py-3 px-6 rounded-xl shadow-2xl animate-pulse">
              {notification}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-1">Aman Sweet</h1>
          <p className="opacity-90">Live Digital Menu & Catalogue</p>
          
          <button
            className="absolute top-6 right-6 flex items-center gap-1 bg-white text-teal-900 px-3 py-1 rounded-full font-bold text-sm shadow-sm"
            onClick={openCart}
          >
            <ShoppingCart size={18} />
            <span>{cart.length}</span>
          </button>

          <div className="mt-4 relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search item (e.g. Samosa, Chowmein, Pizza)..."
              className="w-full pl-10 pr-10 py-2 rounded-full text-gray-900 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <button
              onClick={startVoiceSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-teal-600"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(item => (
            <MenuItemComponent key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>
      </div>

      {/* Floating button removed as cart is now in header */}


      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}><X /></button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name} x {item.quantity}</span>
                  <div className="flex items-center gap-4">
                    <span>₹{parseInt(item.priceFull || item.priceHalf || '0') * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:border-green-500" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
              <p className="text-sm text-gray-500">{selectedFile ? selectedFile.name : 'Attach Payment/Photo (Optional)'}</p>
            </div>

            <button
              onClick={shareOnWhatsApp}
              className="w-full mt-6 bg-teal-600 text-white py-3 rounded-full flex items-center justify-center gap-2"
            >
              <MessageCircle /> Share Order on WhatsApp
            </button>
          </div>
        </div>
      )}
      <footer className="border-t border-gray-200 mt-10 p-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Aman Sweet. All rights reserved.
      </footer>
    </div>
  );
}
