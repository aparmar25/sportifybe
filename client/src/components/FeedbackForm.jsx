import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// FIXED: Use Vite proxy instead of direct URL
const API_URL = '/api';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'success', 'error', 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (err) {
      console.error('Feedback error:', err);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 py-12 bg-gradient-to-br from-black via-[#1a1a1a68] to-black rounded-xl shadow-2xl border border-orange-500/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Send us Feedback</h2>
        <p className="text-slate-400">We'd love to hear from you!</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Name <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Email <span className="text-orange-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Message <span className="text-orange-500">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition h-32 resize-none"
            placeholder="Tell us what you think..."
            required
          />
        </div>

        {status === 'success' && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
            <CheckCircle size={20} />
            <span>Feedback submitted successfully! Thank you.</span>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to submit feedback. Please try again.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !formData.name || !formData.email || !formData.message}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {status === 'loading' ? (
            <>
              <Loader size={20} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;