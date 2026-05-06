import React, { createContext, useState, useContext, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      console.log('Loading wallet for user:', user.id);
      const walletData = await walletService.getWalletByCustomer(user.id);
      console.log('Wallet data loaded:', walletData);
      setWallet(walletData);
      setBalance(walletData.currentBalance);
    } catch (error) {
      console.error('Error loading wallet:', error);
      if (error.response?.status === 404) {
        console.log('Wallet not found, creating new wallet');
        await createWallet();
      } else {
        console.error('Failed to load wallet:', error.response?.data || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      const newWallet = await walletService.createWallet(user.id, 0);
      console.log('New wallet created:', newWallet);
      setWallet(newWallet.wallet);
      setBalance(0);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const loadTransactions = async (pageNumber = 1) => {
    if (!wallet?.walletId) return;
    try {
      const statements = await walletService.getStatements(wallet.walletId, pageNumber);
      setTransactions(statements);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const refreshBalance = async () => {
    if (!wallet?.walletId) return;
    try {
      const balanceData = await walletService.getBalance(wallet.walletId);
      setBalance(balanceData.currentBalance);
      return balanceData.currentBalance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      return balance;
    }
  };

  const initiateRazorpayPayment = async (amount, paymentMetadata = {}) => {
    if (!wallet?.walletId) {
      console.error('No wallet ID available');
      return null;
    }
    try {
      const amountValue = Number(amount);
      const payload = {
        walletId: wallet.walletId,
        customerId: wallet.customerId ?? user?.id,
        amount: amountValue,
        amountPaise: Math.round(amountValue * 100),
        customerName: paymentMetadata.customerName ?? user?.fullName ?? '',
        email: paymentMetadata.email ?? user?.email ?? '',
      };
      console.log('Calling initiateRazorpayPayment with payload:', payload);
      const response = await walletService.initiateRazorpayPayment(payload);
      console.log('initiateRazorpayPayment response:', response);
      return response;
    } catch (error) {
      console.error('initiateRazorpayPayment error:', error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      const detail = backendMessage || error.message || 'Unknown payment initialization error';
      toast.error('Failed to initiate payment: ' + detail);
      return null;
    }
  };

  const verifyPayment = async (orderId, paymentId, signature, amount) => {
    if (!wallet?.walletId) return false;
    try {
      const response = await walletService.verifyRazorpayPayment({
        orderId,
        paymentId,
        signature,
        walletId: wallet.walletId,
        amount,
      });
      if (response.success) {
        await refreshBalance();
        await loadTransactions();
        toast.success('Money added to wallet successfully');
        return true;
      } else {
        toast.error(response.message || 'Payment verification failed');
        return false;
      }
    } catch (error) {
      toast.error('Payment verification failed');
      return false;
    }
  };

  const makePayment = async (amount, orderId, remarks) => {
    if (!wallet?.walletId) return false;
    try {
      console.log('Making payment:', { walletId: wallet.walletId, amount, orderId, remarks });
      const response = await walletService.processPayment(wallet.walletId, amount, orderId, remarks);
      console.log('Payment response:', response);
      if (response.success) {
        await refreshBalance();
        await loadTransactions();
        return true;
      } else {
        toast.error(response.message || 'Insufficient balance');
        return false;
      }
    } catch (error) {
      console.error('Payment failed:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Payment failed');
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      balance,
      loading,
      transactions,
      loadWallet,
      loadTransactions,
      refreshBalance,
      initiateRazorpayPayment,
      verifyPayment,
      makePayment,
    }}>
      {children}
    </WalletContext.Provider>
  );
};