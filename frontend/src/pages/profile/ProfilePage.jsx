import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    about: '',
    dateOfBirth: '',
    gender: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    streetName: '',
    colonyName: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    loadProfile();
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await authService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        about: data.about || '',
        dateOfBirth: data.dateOfBirth?.split('T')[0] || '',
        gender: data.gender || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await authService.addAddress(addressForm);
      toast.success('Address added successfully');
      setAddressForm({
        houseNumber: '',
        streetName: '',
        colonyName: '',
        city: '',
        state: '',
        pincode: '',
      });
      setShowAddressForm(false);
      loadAddresses();
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await authService.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await authService.setDefaultAddress(addressId);
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
      toast.error('Failed to set default address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your account settings and personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="card-premium p-8 text-center bg-white relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-600 to-primary-400 opacity-10"></div>
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-md">
                  <UserIcon className="h-20 w-20 text-primary-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.fullName}</h2>
              <span className="inline-block mt-2 badge-info px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {profile?.role}
              </span>
              
              <div className="mt-8 space-y-4 text-left border-t border-gray-100 pt-8">
                <div className="flex items-center gap-3 text-gray-600 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email Address</p>
                    <p className="text-sm font-medium">{profile?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                    <PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Phone Number</p>
                    <p className="text-sm font-medium">{profile?.mobileNumber}</p>
                  </div>
                </div>

                {profile?.dateOfBirth && (
                  <div className="flex items-center gap-3 text-gray-600 group">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                      <CalendarIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Date of Birth</p>
                      <p className="text-sm font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Forms Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Information Section */}
          <div className="card-premium p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
              {!editing && (
                <button 
                  onClick={() => setEditing(true)} 
                  className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-xl transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">About (Optional)</label>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      rows="3"
                      className="input-field"
                      placeholder="Share a bit about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="input-field py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="input-field py-3 appearance-none cursor-pointer"
                    >
                      <option value="">Choose Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">Save Changes</button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)} 
                    className="btn-secondary flex-1"
                  >
                    Discard
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                <div className="md:col-span-2 p-6 bg-gray-50 rounded-2xl">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Biography</label>
                  <p className="text-gray-700 leading-relaxed italic">{profile?.about || 'No biography added yet. Click edit to tell your story!'}</p>
                </div>
                <div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Gender</label>
                    <p className="font-bold text-gray-700">{profile?.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Join Date</label>
                    <p className="font-bold text-gray-700">{new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security / Password Section */}
          <div className="card-premium p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-50">Security Settings</h2>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field py-3"
                    required
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field py-3"
                      required
                      placeholder="Minimum 6 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field py-3"
                      required
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full md:w-auto px-10">Update Security Key</button>
              </form>
            </div>
          </div>

          {/* Address Management Section */}
          <div className="card-premium p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)} 
                className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-xl transition-all"
              >
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-4 mb-6 p-6 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">House Number</label>
                    <input
                      type="text"
                      value={addressForm.houseNumber}
                      onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Name</label>
                    <input
                      type="text"
                      value={addressForm.streetName}
                      onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Colony/Area</label>
                    <input
                      type="text"
                      value={addressForm.colonyName}
                      onChange={(e) => setAddressForm({ ...addressForm, colonyName: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="input-field py-3"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="btn-primary flex-1">Save Address</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)} 
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No addresses saved yet</p>
                <p className="text-sm text-gray-400 mt-1">Add an address to use during checkout</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {addr.houseNumber}, {addr.streetName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.colonyName}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {(addr.isDefault || addr.isDefaultAddress || addr.default) && (
                          <span className="badge badge-success text-xs mt-2 inline-block">Default</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50"
                          disabled={addr.isDefault || addr.isDefaultAddress || addr.default}
                        >
                          Set Default
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;