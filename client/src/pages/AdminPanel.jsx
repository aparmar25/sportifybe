import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Eye, 
  Trash2, 
  Mail, 
  User, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  FileImage, 
  LogOut, 
  Menu, 
  Users,
  CheckCircle,
  AlertCircle,
  Tag as TagIcon,
  FolderPlus,
  Loader
} from 'lucide-react';
import AdminManagement from '../components/AdminManagement';
import EventApprovalManagement from '../components/EventApprovalManagement';

const API_URL = '/api';

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      
      const errorData = await res.json().catch(() => null);
      throw {
        status: res.status,
        message: errorData?.message || `Request failed with status ${res.status}`
      };
    })
    .then(data => {
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      if (err.status) {
        setError(err.message);
      } else {
        setError('Connection error. Please check if the backend is running.');
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Admin Panel</h1>
          <p className="text-slate-400">The Sportify Society</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: '',
    tags: [],
    category: 'All'
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEvents();
      fetchFeedbacks();
      fetchCategories();
      if (currentUser.role === 'super_admin') {
        fetchPendingCount();
      }
    }
  }, [currentUser]);

  const fetchCurrentUser = () => {
    fetch(`${API_URL}/admin/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        return res.json();
      })
      .then(data => setCurrentUser(data))
      .catch(err => {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('adminToken');
        window.location.reload();
      });
  };

  const fetchEvents = () => {
    fetch(`${API_URL}/events/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        return res.json();
      })
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      });
  };

  const fetchPendingCount = () => {
    fetch(`${API_URL}/events/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPendingCount(Array.isArray(data) ? data.length : 0))
      .catch(err => {
        console.error('Failed to fetch pending count:', err);
        setPendingCount(0);
      });
  };

  const fetchFeedbacks = () => {
    fetch(`${API_URL}/feedback`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        return res.json();
      })
      .then(data => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to fetch feedbacks:', err);
        setFeedbacks([]);
      });
  };

  const fetchCategories = () => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        const categoryNames = data.map(cat => cat.name);
        setCategories(['All', ...categoryNames]);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Category created successfully!');
        setNewCategoryName('');
        setShowCategoryModal(false);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Create category error:', error);
      alert('Failed to create category');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventForm({...eventForm, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.date || !eventForm.location || 
        !eventForm.description || !eventForm.image || !eventForm.category) {
      alert('Please fill all required fields');
      return;
    }

    if (eventForm.category && !categories.includes(eventForm.category)) {
      try {
        await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: eventForm.category })
        });
        fetchCategories();
      } catch (err) {
        console.error('Failed to create category:', err);
      }
    }

    const url = editingEvent 
      ? `${API_URL}/events/${editingEvent._id}`
      : `${API_URL}/events`;
    
    const method = editingEvent ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || (editingEvent ? 'Event updated' : 'Event created'));
        fetchEvents();
        if (currentUser?.role === 'super_admin') {
          fetchPendingCount();
        }
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save event');
      }
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async (id, status) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.pending) {
          alert('Delete request submitted for approval');
        } else {
          alert('Event deleted successfully');
        }
        fetchEvents();
        if (currentUser?.role === 'super_admin') {
          fetchPendingCount();
        }
      } else {
        alert(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to delete event');
    }
  };

  const handleDeleteFeedback = (id) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      fetch(`${API_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(() => fetchFeedbacks())
      .catch(err => console.error('Failed to delete feedback:', err));
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      date: '',
      location: '',
      description: '',
      image: '',
      tags: [],
      category: 'All'
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleEditEvent = (event) => {
    if (event.status === 'pending_edit' && event.pendingChanges) {
      setEventForm({
        title: event.pendingChanges.title || event.title,
        date: event.pendingChanges.date || event.date,
        location: event.pendingChanges.location || event.location,
        description: event.pendingChanges.description || event.description,
        image: event.pendingChanges.image || event.image,
        tags: event.pendingChanges.tags || event.tags,
        category: event.pendingChanges.category || event.category
      });
    } else {
      setEventForm({
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        image: event.image,
        tags: event.tags || [],
        category: event.category
      });
    }
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const getStatusBadge = (event) => {
    switch(event.status) {
      case 'approved':
        return <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} />Approved</span>;
      case 'rejected':
        return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><X size={14} />Rejected</span>;
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle size={14} />Pending</span>;
      case 'pending_edit':
        return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle size={14} />Edit Pending</span>;
      case 'pending_delete':
        return <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Trash2 size={14} />Delete Pending</span>;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black flex items-center justify-center">
        <Loader size={48} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950 flex pt-16">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 transition-all duration-300 fixed left-0 top-16 bottom-0 overflow-y-auto z-30`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold text-orange-500">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'events' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar size={20} />
            {sidebarOpen && <span>My Events</span>}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'categories' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FolderPlus size={20} />
            {sidebarOpen && <span>Categories</span>}
          </button>

          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('approval')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
                activeTab === 'approval' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle size={20} />
              {sidebarOpen && (
                <>
                  <span>Event Approval</span>
                  {pendingCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'feedback' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Feedback ({feedbacks.length})</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('admins')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'admins' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Manage Admins</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-8">
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white">Past Events Management</h1>
                  {currentUser.role !== 'super_admin' && (
                    <p className="text-slate-400 text-sm mt-2">
                      ⚠️ Events require super admin approval before publishing
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
                >
                  <Upload size={20} />
                  Add New Event
                </button>
              </div>

              {/* Event Form Modal */}
              {showEventForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                      </h2>
                      <button onClick={resetForm} className="text-slate-400 hover:text-white">
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitEvent} className="space-y-6">
                      <div>
                        <label className="block text-slate-300 mb-2">Event Title *</label>
                        <input
                          type="text"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 mb-2">Date *</label>
                          <input
                            type="text"
                            placeholder="e.g., 23 October 2024"
                            value={eventForm.date}
                            onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-2">Location *</label>
                          <input
                            type="text"
                            value={eventForm.location}
                            onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2">Category *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            list="categories"
                            value={eventForm.category}
                            onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                            className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Select or type new category"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition flex items-center gap-2"
                            title="Manage Categories"
                          >
                            <FolderPlus size={20} />
                          </button>
                        </div>
                        <datalist id="categories">
                          {categories.map((cat, i) => (
                            <option key={i} value={cat} />
                          ))}
                        </datalist>
                        <p className="text-slate-500 text-xs mt-1">
                          Select existing or type a new category name
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2">Description *</label>
                        <textarea
                          value={eventForm.description}
                          onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2">Event Image *</label>
                        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-orange-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="imageUpload"
                          />
                          <label htmlFor="imageUpload" className="cursor-pointer">
                            {eventForm.image ? (
                              <img src={eventForm.image} alt="Preview" className="max-h-48 mx-auto rounded" />
                            ) : (
                              <div>
                                <FileImage size={48} className="mx-auto text-slate-500 mb-2" />
                                <p className="text-slate-400">Click to upload image</p>
                                <p className="text-slate-500 text-xs mt-2">Max size: 5MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2">Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g., Hockey, Meetup, Live Event"
                          value={eventForm.tags.join(', ')}
                          onChange={(e) => setEventForm({...eventForm, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                          className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                        >
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Category Creation Modal */}
              {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Create New Category</h2>
                      <button onClick={() => {
                        setShowCategoryModal(false);
                        setNewCategoryName('');
                      }} className="text-slate-400 hover:text-white">
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-300 mb-2">Category Name *</label>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., Basketball"
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                        />
                      </div>

                      <div className="bg-slate-900 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2">Existing Categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {categories.filter(c => c !== 'All').map((cat, i) => (
                            <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                              {cat}
                            </span>
                          ))}
                          {categories.length === 1 && (
                            <span className="text-slate-500 text-sm">No categories yet</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleCreateCategory}
                        disabled={!newCategoryName.trim()}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Create Category
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Events List */}
              <div className="grid gap-6">
                {events.map((event, index) => (
                  <div
                    key={event._id}
                    className={`bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    } flex`}
                  >
                    <div className="w-1/3 relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    
                    <div className="w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                              {getStatusBadge(event)}
                            </div>
                            <div className="flex gap-4 text-slate-400 text-sm mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={16} />
                                {event.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <TagIcon size={16} />
                                {event.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {event.status !== 'pending_delete' && (
                              <>
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                                  title="Edit Event"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event._id, event.status)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                                  title="Delete Event"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-slate-300 mb-4">{event.description}</p>
                        
                        {event.status === 'pending_edit' && event.pendingChanges && (
                          <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-3 py-2 rounded-lg mb-4 text-sm">
                            <strong>⚠️ Pending Changes:</strong> Your edits are awaiting super admin approval
                          </div>
                        )}
                        
                        {event.status === 'pending_delete' && (
                          <div className="bg-purple-500/20 border border-purple-500 text-purple-300 px-3 py-2 rounded-lg mb-4 text-sm">
                            <strong>⚠️ Delete Request:</strong> Awaiting super admin approval
                          </div>
                        )}
                        
                        {event.rejectionReason && (
                          <div className="bg-red-500/20 border border-red-500 text-red-300 px-3 py-2 rounded-lg mb-4 text-sm">
                            <strong>Rejection Reason:</strong> {event.rejectionReason}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {event.tags && event.tags.map((tag, i) => (
                            <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No events created yet. Click "Add New Event" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white">Category Management</h1>
                  <p className="text-slate-400 text-sm mt-2">
                    Manage event categories for better organization
                  </p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
                >
                  <FolderPlus size={20} />
                  Create Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(c => c !== 'All').map((category, index) => (
                  <div 
                    key={index}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-orange-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-500/20 p-3 rounded-full">
                          <FolderPlus className="text-orange-500" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{category}</h3>
                          <p className="text-slate-400 text-sm">
                            {events.filter(e => e.category === category).length} events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {categories.length === 1 && (
                  <div className="col-span-full text-center py-12 text-slate-400">
                    <FolderPlus size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No categories created yet. Click "Create Category" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'approval' && currentUser.role === 'super_admin' && (
            <EventApprovalManagement token={token} currentUser={currentUser} onUpdate={() => {
              fetchEvents();
              fetchPendingCount();
            }} />
          )}

          {activeTab === 'feedback' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">User Feedback</h1>
              
              <div className="grid gap-6">
                {feedbacks.map((feedback) => (
                  <div key={feedback._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2 text-white">
                            <User size={20} className="text-orange-500" />
                            <span className="font-semibold">{feedback.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail size={16} />
                            <span className="text-sm">{feedback.email}</span>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 bg-slate-900 p-4 rounded-lg">{feedback.message}</p>
                        
                        <p className="text-slate-500 text-sm mt-3">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition ml-4"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {feedbacks.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No feedback received yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <AdminManagement token={token} currentUser={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  return isAuthenticated ? (
    <AdminDashboard token={token} onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );

}

