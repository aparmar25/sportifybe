import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Key, Shield, User, Mail, X } from 'lucide-react';

const API_URL = '/api';

export default function AdminManagement({ token, currentUser }) {
  const [admins, setAdmins] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [isSuperAdmin]);

  const fetchAdmins = () => {
    fetch(`${API_URL}/admin/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(err => console.error('Failed to fetch admins:', err));
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    
    fetch(`${API_URL}/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createForm)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchAdmins();
        setShowCreateForm(false);
        setCreateForm({ username: '', email: '', password: '', role: 'admin' });
        alert('Admin created successfully!');
      } else {
        alert(data.error || 'Failed to create admin');
      }
    })
    .catch(err => {
      console.error('Create admin error:', err);
      alert('Failed to create admin');
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      newPassword: passwordForm.newPassword,
      currentPassword: passwordForm.currentPassword
    };

    if (selectedAdmin && isSuperAdmin) {
      payload.targetAdminId = selectedAdmin._id;
      delete payload.currentPassword;
    }

    fetch(`${API_URL}/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setShowPasswordForm(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSelectedAdmin(null);
        alert('Password changed successfully!');
      } else {
        alert(data.error || 'Failed to change password');
      }
    })
    .catch(err => {
      console.error('Change password error:', err);
      alert('Failed to change password');
    });
  };

  const handleDeleteAdmin = (adminId, username) => {
    if (confirm(`Are you sure you want to delete admin: ${username}?`)) {
      fetch(`${API_URL}/admin/${adminId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchAdmins();
          alert('Admin deleted successfully!');
        } else {
          alert(data.error || 'Failed to delete admin');
        }
      })
      .catch(err => {
        console.error('Delete admin error:', err);
        alert('Failed to delete admin');
      });
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto">
          <Shield size={64} className="mx-auto mb-4 text-orange-500 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 mb-6">
            Admin management is only available to Super Admins
          </p>
          <button
            onClick={() => {
              setShowPasswordForm(true);
              setSelectedAdmin(null);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
          >
            <Key size={20} />
            Change My Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowPasswordForm(true);
              setSelectedAdmin(null);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Key size={20} />
            Change My Password
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Add New Admin
          </button>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Admin</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Username *</label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Password *</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Role *</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button
                onClick={handleCreateAdmin}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedAdmin ? `Change Password for ${selectedAdmin.username}` : 'Change My Password'}
              </h2>
              <button onClick={() => {
                setShowPasswordForm(false);
                setSelectedAdmin(null);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {!selectedAdmin && (
                <div>
                  <label className="block text-slate-300 mb-2">Current Password *</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-2">New Password *</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admins List */}
      <div className="grid gap-4">
        {admins.map((admin) => (
          <div key={admin._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${admin.role === 'super_admin' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                  {admin.role === 'super_admin' ? (
                    <Shield size={24} className="text-orange-500" />
                  ) : (
                    <User size={24} className="text-blue-500" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    {admin.username}
                    {admin._id === currentUser?.id && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">You</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {admin.email}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      admin.role === 'super_admin' 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {admin.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                    {admin.lastLogin && ` • Last login: ${new Date(admin.lastLogin).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setShowPasswordForm(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                  title="Change Password"
                >
                  <Key size={18} />
                </button>
                
                {admin._id !== currentUser?.id && (
                  <button
                    onClick={() => handleDeleteAdmin(admin._id, admin.username)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                    title="Delete Admin"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {admins.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No admins found</p>
          </div>
        )}
      </div>
    </div>
  );
}