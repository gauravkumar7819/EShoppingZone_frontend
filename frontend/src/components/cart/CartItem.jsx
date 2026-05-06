import React from 'react';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{item.productName}</h3>
        <p className="text-primary-600 font-semibold">₹{item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(Math.max(0, item.quantity - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 ml-auto text-red-500 hover:bg-red-50 rounded"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CartItem;