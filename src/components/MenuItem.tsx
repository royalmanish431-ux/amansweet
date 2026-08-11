import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from '../data';

interface Props {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
}

const MenuItemComponent: React.FC<Props> = ({ item, addToCart }) => {
  const imageUrl = item.imageName ? `https://raw.githubusercontent.com/royalmanish431-ux/amansweet/main/${item.imageName}` : '';
  
  return (
    <div id={`item-${item.id}`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
      <img 
          src={imageUrl} 
          alt={item.name || 'Menu Item'} 
          style={{width:'100%', height:'280px', objectFit:'cover', borderRadius:'12px'}}
          onError={(e: any) => e.target.src='https://via.placeholder.com/300x280?text=No+Image'}
      />
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {item.category}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800 mt-1">{item.name}</h3>
        <p className="text-xs text-gray-500 font-medium">{item.nativeName}</p>
        {item.offer && (
          <span className="inline-block bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
            {item.offer}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
        <div className="flex flex-col gap-1">
          {item.priceHalf && item.priceHalf !== '-' && (
            <div className="text-xs text-gray-600">Half: <span className="font-bold text-gray-800">₹{item.priceHalf}</span></div>
          )}
          {item.priceFull && item.priceFull !== '-' && (
            <div className="text-xs text-gray-600">Full: <span className="font-bold text-gray-800">₹{item.priceFull}</span></div>
          )}
          {!item.priceHalf && !item.priceFull && (
            <div className="font-bold text-red-600 text-base">N/A</div>
          )}
        </div>
        <button 
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
          aria-label={`Add ${item.name} to cart`}
          onClick={() => addToCart(item)}
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
};

export default MenuItemComponent;
