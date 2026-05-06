import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const cartData = await cartService.getCartByUserId(user.id);
      setCart(cartData);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to load cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, productName, price, quantity = 1, imageUrl = '', merchantId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    setLoading(true);
    try {
      const result = await cartService.addToCart({
        userId: user.id,
        productId,
        productName,
        price,
        quantity,
        imageUrl,
        merchantId,
      });
      setCart(result.cart);
      toast.success('Item added to cart');
      setIsOpen(true);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (!cart) return;

    setLoading(true);
    try {
      const result = await cartService.updateCartItem({
        cartId: cart.cartId,
        cartItemId,
        quantity,
      });
      setCart(result.cart);
      if (quantity === 0) {
        toast.success('Item removed from cart');
      }
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    await updateQuantity(cartItemId, 0);
  };

  const clearCart = async () => {
    if (!cart) return;

    setLoading(true);
    try {
      await cartService.clearCart(cart.cartId);
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isOpen,
      setIsOpen,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getCartTotal,
      getTotalItems,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};