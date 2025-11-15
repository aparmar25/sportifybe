// server.js - FIXED: Category UI + Edit/Delete Approval + 403 Error
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ====== CORS Configuration ======
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ====== MongoDB Connection ======
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportify';

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Check: IP whitelist, credentials, network connection');
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected');
});

connectDB();

// ==================== SCHEMAS ====================

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

// UPDATED: Added fields for edit/delete tracking
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  category: { type: String, required: true, default: 'All' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'pending_edit', 'pending_delete'], 
    default: 'pending' 
  },
  // Track original data for edit approval
  pendingChanges: {
    title: String,
    date: String,
    location: String,
    description: String,
    image: String,
    tags: [String],
    category: String
  },
  deleteRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  deleteRequestedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedAt: { type: Date }
});

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Admin = mongoose.model('Admin', adminSchema);
const Category = mongoose.model('Category', categorySchema);
const Event = mongoose.model('Event', eventSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// ==================== MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // FIXED: Verify user still exists in database
    try {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(403).json({ error: 'User no longer exists' });
      }
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role || admin.role
      };
      next();
    } catch (error) {
      console.error('User verification error:', error);
      return res.status(403).json({ error: 'Authentication failed' });
    }
  });
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

// ==================== ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sportify API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// ==================== ADMIN ROUTES ====================

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password required' 
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username,
        role: admin.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', username, '- Role:', admin.role);
    res.json({ 
      success: true, 
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

app.get('/api/admin/me', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/list', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/create', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password required' 
      });
    }

    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ 
      username, 
      email,
      password: hashedPassword,
      role: role || 'admin',
      createdBy: req.user.id
    });
    
    await admin.save();

    res.json({ 
      success: true, 
      message: 'Admin created successfully',
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, targetAdminId } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password required' });
    }

    let adminToUpdate;

    if (targetAdminId && targetAdminId !== req.user.id) {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }
      adminToUpdate = await Admin.findById(targetAdminId);
    } else {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required' });
      }
      
      adminToUpdate = await Admin.findById(req.user.id);
      const validPassword = await bcrypt.compare(currentPassword, adminToUpdate.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    if (!adminToUpdate) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    adminToUpdate.password = await bcrypt.hash(newPassword, 10);
    await adminToUpdate.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/:id', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ 
      success: true, 
      message: 'Admin deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CATEGORY ROUTES ====================

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name required' });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({
      name: trimmedName,
      slug,
      createdBy: req.user.id
    });

    await category.save();
    console.log('✅ Category created:', category.name);
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category (Super Admin only)
app.delete('/api/categories/:id', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== EVENT ROUTES ====================

// Get all APPROVED events (public)
app.get('/api/events', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { status: 'approved' };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all events for admin
app.get('/api/events/admin', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'super_admin' 
      ? {} 
      : { createdBy: req.user.id };
    
    const events = await Event.find(query)
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username')
      .populate('rejectedBy', 'username')
      .populate('deleteRequestedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error('Fetch admin events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending events (Super Admin only)
app.get('/api/events/pending', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const events = await Event.find({ 
      status: { $in: ['pending', 'pending_edit', 'pending_delete'] } 
    })
      .populate('createdBy', 'username email')
      .populate('deleteRequestedBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error('Fetch pending events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const status = req.user.role === 'super_admin' ? 'approved' : 'pending';
    
    const event = new Event({
      ...req.body,
      createdBy: req.user.id,
      status,
      approvedBy: req.user.role === 'super_admin' ? req.user.id : null,
      approvedAt: req.user.role === 'super_admin' ? new Date() : null
    });
    
    await event.save();
    
    console.log(`✅ Event created: ${event._id} (Status: ${status})`);
    
    res.status(201).json({
      ...event.toObject(),
      message: req.user.role === 'super_admin' 
        ? 'Event published successfully' 
        : 'Event submitted for approval'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATED: Update event - requires approval for regular admins
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check permissions
    if (req.user.role !== 'super_admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this event' });
    }

    // Super admin can edit directly
    if (req.user.role === 'super_admin') {
      Object.assign(event, req.body);
      event.updatedAt = new Date();
      await event.save();
      
      console.log('✅ Event updated by super admin:', event._id);
      return res.json({ 
        ...event.toObject(), 
        message: 'Event updated successfully' 
      });
    }

    // Regular admin: store changes for approval
    if (event.status === 'approved') {
      event.status = 'pending_edit';
      event.pendingChanges = {
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        tags: req.body.tags,
        category: req.body.category
      };
      event.updatedAt = new Date();
      await event.save();
      
      console.log('✅ Event edit submitted for approval:', event._id);
      return res.json({ 
        ...event.toObject(), 
        message: 'Changes submitted for approval' 
      });
    }

    // If still pending, update pending data
    Object.assign(event, req.body);
    event.updatedAt = new Date();
    await event.save();
    
    console.log('✅ Pending event updated:', event._id);
    res.json({ 
      ...event.toObject(), 
      message: 'Event updated' 
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Approve event edit
app.put('/api/events/:id/approve-edit', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'pending_edit') {
      return res.status(400).json({ error: 'No pending changes to approve' });
    }

    // Apply pending changes
    if (event.pendingChanges) {
      event.title = event.pendingChanges.title;
      event.date = event.pendingChanges.date;
      event.location = event.pendingChanges.location;
      event.description = event.pendingChanges.description;
      event.image = event.pendingChanges.image;
      event.tags = event.pendingChanges.tags;
      event.category = event.pendingChanges.category;
      event.pendingChanges = undefined;
    }

    event.status = 'approved';
    event.approvedBy = req.user.id;
    event.approvedAt = new Date();
    event.updatedAt = new Date();
    
    await event.save();
    
    console.log('✅ Event edit approved:', event._id);
    res.json({ 
      success: true, 
      message: 'Changes approved successfully',
      event 
    });
  } catch (error) {
    console.error('Approve edit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve event (create or edit)
app.put('/api/events/:id/approve', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If pending edit, apply changes
    if (event.status === 'pending_edit' && event.pendingChanges) {
      event.title = event.pendingChanges.title;
      event.date = event.pendingChanges.date;
      event.location = event.pendingChanges.location;
      event.description = event.pendingChanges.description;
      event.image = event.pendingChanges.image;
      event.tags = event.pendingChanges.tags;
      event.category = event.pendingChanges.category;
      event.pendingChanges = undefined;
    }

    event.status = 'approved';
    event.approvedBy = req.user.id;
    event.approvedAt = new Date();
    event.rejectedBy = null;
    event.rejectionReason = null;
    event.rejectedAt = null;
    event.updatedAt = new Date();
    
    await event.save();
    
    console.log('✅ Event approved:', event._id);
    res.json({ 
      success: true, 
      message: 'Event approved successfully',
      event 
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject event
app.put('/api/events/:id/reject', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If rejecting edit, revert to approved with original data
    if (event.status === 'pending_edit') {
      event.status = 'approved';
      event.pendingChanges = undefined;
      event.rejectionReason = reason || 'Changes rejected';
      event.updatedAt = new Date();
    } else {
      event.status = 'rejected';
      event.rejectedBy = req.user.id;
      event.rejectionReason = reason || 'No reason provided';
      event.rejectedAt = new Date();
      event.approvedBy = null;
      event.approvedAt = null;
    }
    
    await event.save();
    
    console.log('✅ Event rejected:', event._id);
    res.json({ 
      success: true, 
      message: 'Event rejected',
      event 
    });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATED: Delete event - requires approval for regular admins
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check permissions
    if (req.user.role !== 'super_admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    // Super admin can delete directly
    if (req.user.role === 'super_admin') {
      await Event.findByIdAndDelete(req.params.id);
      console.log('✅ Event deleted by super admin:', req.params.id);
      return res.json({ success: true, message: 'Event deleted' });
    }

    // Regular admin: mark for deletion approval if approved
    if (event.status === 'approved') {
      event.status = 'pending_delete';
      event.deleteRequestedBy = req.user.id;
      event.deleteRequestedAt = new Date();
      await event.save();
      
      console.log('✅ Event deletion submitted for approval:', req.params.id);
      return res.json({ 
        success: true, 
        message: 'Delete request submitted for approval',
        pending: true 
      });
    }

    // If not approved yet, regular admin can delete directly
    await Event.findByIdAndDelete(req.params.id);
    console.log('✅ Pending event deleted:', req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Approve delete request
app.delete('/api/events/:id/approve-delete', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'pending_delete') {
      return res.status(400).json({ error: 'No pending delete request' });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    console.log('✅ Event deletion approved:', req.params.id);
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Approve delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Reject delete request
app.put('/api/events/:id/reject-delete', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'pending_delete') {
      return res.status(400).json({ error: 'No pending delete request' });
    }

    event.status = 'approved';
    event.deleteRequestedBy = null;
    event.deleteRequestedAt = null;
    await event.save();
    
    console.log('✅ Event deletion rejected:', event._id);
    res.json({ 
      success: true, 
      message: 'Delete request rejected',
      event 
    });
  } catch (error) {
    console.error('Reject delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== FEEDBACK ROUTES ====================

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'All fields required' 
      });
    }

    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    
    console.log('✅ Feedback submitted:', feedback._id);
    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted' 
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/feedback/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    console.log('✅ Feedback deleted:', req.params.id);
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Sportify Backend Server');
  console.log('=================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/admin/login`);
  console.log(`📅 Events: http://localhost:${PORT}/api/events`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});