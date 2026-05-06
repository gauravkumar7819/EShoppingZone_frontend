import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { WalletProvider, useWallet } from '../../contexts/WalletContext';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const WalletDashboardContent = () => {
  const { user } = useAuth();
  const { 
    balance, 
    transactions, 
    loading, 
    wallet,
    refreshBalance, 
    loadTransactions,
    initiateRazorpayPayment,
    verifyPayment 
  } = useWallet();
  const [amount, setAmount] = useState('');
  const [addingMoney, setAddingMoney] = useState(false);

  useEffect(() => {
    if (wallet?.walletId) {
      loadTransactions();
    }
  }, [wallet]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async () => {
    console.log('handleAddMoney called with amount:', amount, 'wallet:', wallet);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!wallet?.walletId) {
      alert('Wallet not loaded. Please refresh the page and try again.');
      console.error('Wallet not loaded:', wallet);
      return;
    }

    setAddingMoney(true);
    try {
      console.log('Initiating payment for amount:', amount);
      console.log('Wallet ID:', wallet.walletId);
      const response = await initiateRazorpayPayment(parseFloat(amount), {
        customerName: user?.fullName,
        email: user?.email,
      });
      console.log('Payment initiation response:', response);
      if (!response) {
        console.error('No response from payment initiation');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
        return;
      }

      const options = {
        key: response.keyId,
        amount: response.amount,
        currency: response.currency,
        name: 'EShoppingZone',
        description: `Add ₹${amount} to wallet`,
        order_id: response.razorpayOrderId,
        handler: async (razorpayResponse) => {
          const success = await verifyPayment(
            razorpayResponse.razorpay_order_id,
            razorpayResponse.razorpay_payment_id,
            razorpayResponse.razorpay_signature,
            parseFloat(amount)
          );
          if (success) {
            setAmount('');
            await refreshBalance();
            await loadTransactions();
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        notes: {
          walletId: response.notes?.walletId,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment');
    } finally {
      setAddingMoney(false);
    }
  };

  const getTransactionTypeBadge = (type) => {
    return type === 'CREDIT' 
      ? 'badge-success' 
      : 'badge-danger';
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Digital Wallet</h1>
        <p className="text-gray-500">Manage your funds and track your transactions securely</p>
        {/* Debug info */}
        <div className="mt-2 text-xs text-gray-400">
          Wallet ID: {wallet?.walletId || 'Not loaded'} | User ID: {user?.id || 'Not logged in'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Balance and Add Money */}
        <div className="lg:col-span-1 space-y-8">
          {/* Decorative Balance Card */}
          <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="17" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <button 
                  onClick={refreshBalance}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors active:rotate-180 duration-500"
                >
                  <ArrowPathIcon className="h-6 w-6 opacity-70" />
                </button>
              </div>
              
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Available Balance</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-2xl font-bold opacity-60 italic">₹</span>
                <span className="text-6xl font-black tracking-tighter">
                  {balance?.toLocaleString() || '0'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                <div className="h-1.5 w-12 bg-white/40 rounded-full"></div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          </div>

          {/* Quick Add Money Form */}
          <div className="card-premium p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Top Up Wallet</h2>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
                  className="w-full bg-gray-50 px-8 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 border-2 border-transparent focus:border-primary-500/20 transition-all font-bold text-lg"
                  min="1"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 5000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="p-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors border border-transparent hover:border-primary-100"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddMoney}
                disabled={addingMoney || !amount}
                className="btn-premium w-full flex items-center justify-center gap-3 py-4 shadow-xl shadow-primary-600/20"
              >
                {addingMoney ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5" />
                    Secure Checkout
                  </>
                )}
              </button>
              <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest pt-2">
                Encrypted via Razorpay
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Transaction History */}
        <div className="lg:col-span-2">
          <div className="card-premium h-full overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
              <h2 className="text-xl font-bold text-gray-800">Transaction Pulse</h2>
              <div className="flex gap-2">
                <span className="badge-info scale-90">All Time</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8">
              {loading ? (
                <div className="space-y-4 py-8">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-24">
                  <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
                    <ArrowPathIcon className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-500">Your history is clear.</p>
                  <p className="text-xs text-gray-400 mt-1">Start adding funds to see transactions here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <div key={txn.statementId} className="py-6 flex justify-between items-center group">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${
                          txn.transactionType === 'CREDIT' 
                            ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' 
                            : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                        }`}>
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {txn.transactionType === 'CREDIT' 
                              ? <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/>
                              : <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/>
                            }
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                              {txn.transactionType === 'CREDIT' ? 'Funds Added' : 'Payment Sent'}
                            </span>
                            {txn.orderId && (
                              <span className="bg-gray-100 text-[9px] font-black px-2 py-0.5 rounded text-gray-500 tracking-tighter uppercase">
                                Order #{txn.orderId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-400 tracking-tight mb-2">{txn.transactionRemarks}</p>
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            {new Date(txn.transactionDate).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-black tracking-tight mb-1 ${
                          txn.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.transactionType === 'CREDIT' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-tighter italic">
                          Balance: <span className="text-gray-900 not-italic">₹{txn.balanceAfterTransaction?.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-8 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-normal">
                Your wallet is secured with enterprise-grade SSL encryption and Razorpay's trusted ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletDashboard = () => {
  return (
    <WalletProvider>
      <WalletDashboardContent />
    </WalletProvider>
  );
};

export default WalletDashboard;