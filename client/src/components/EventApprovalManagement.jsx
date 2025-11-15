import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar, 
  MapPin, 
  User,
  Tag,
  AlertCircle,
  Loader,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';

const API_URL = '/api';

export default function EventApprovalManagement({ token, currentUser, onUpdate }) {
  const [pendingEvents, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchPendingEvents();
    }
  }, [isSuperAdmin]);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/events/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch pending events');
      
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
      alert('Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId, type = 'create') => {
    const confirmMsg = type === 'delete' 
      ? 'Are you sure you want to approve this delete request?'
      : 'Are you sure you want to approve this event?';
      
    if (!confirm(confirmMsg)) return;

    try {
      setProcessing(true);
      
      let url, method;
      if (type === 'delete') {
        url = `${API_URL}/events/${eventId}/approve-delete`;
        method = 'DELETE';
      } else {
        url = `${API_URL}/events/${eventId}/approve`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert(type === 'delete' ? 'Event deleted successfully!' : 'Event approved successfully!');
        fetchPendingEvents();
        if (onUpdate) onUpdate();
        setShowPreview(false);
        setSelectedEvent(null);
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedEvent) return;
    
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      
      const url = selectedEvent.status === 'pending_delete'
        ? `${API_URL}/events/${selectedEvent._id}/reject-delete`
        : `${API_URL}/events/${selectedEvent._id}/reject`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();

      if (data.success) {
        alert('Request rejected');
        fetchPendingEvents();
        if (onUpdate) onUpdate();
        setShowRejectModal(false);
        setShowPreview(false);
        setSelectedEvent(null);
        setRejectionReason('');
      } else {
        alert(data.error || 'Failed to reject');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
  };

  const getEventTypeLabel = (event) => {
    switch(event.status) {
      case 'pending':
        return { label: 'New Event', icon: Clock, color: 'yellow' };
      case 'pending_edit':
        return { label: 'Edit Request', icon: Edit, color: 'blue' };
      case 'pending_delete':
        return { label: 'Delete Request', icon: Trash2, color: 'purple' };
      default:
        return { label: 'Pending', icon: Clock, color: 'yellow' };
    }
  };

  const renderEventData = (event) => {
    if (event.status === 'pending_edit' && event.pendingChanges) {
      return {
        title: event.pendingChanges.title,
        date: event.pendingChanges.date,
        location: event.pendingChanges.location,
        description: event.pendingChanges.description,
        image: event.pendingChanges.image,
        tags: event.pendingChanges.tags,
        category: event.pendingChanges.category
      };
    }
    return event;
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto border border-slate-700">
          <AlertCircle size={64} className="mx-auto mb-4 text-orange-500 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400">
            Event approval management is only available to Super Admins
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-slate-400">Loading pending events...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Approval</h1>
          <p className="text-slate-400 mt-2">
            Review and approve pending event submissions
          </p>
        </div>
        <div className="bg-orange-500/20 border border-orange-500 px-4 py-2 rounded-lg">
          <span className="text-orange-400 font-semibold">
            {pendingEvents.length} Pending
          </span>
        </div>
      </div>

      {/* Event Preview Modal */}
      {showPreview && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Event Preview</h2>
              <button 
                onClick={() => {
                  setShowPreview(false);
                  setSelectedEvent(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Type Badge */}
              {(() => {
                const typeInfo = getEventTypeLabel(selectedEvent);
                const IconComponent = typeInfo.icon;
                return (
                  <div className={`bg-${typeInfo.color}-500/20 border border-${typeInfo.color}-500 text-${typeInfo.color}-400 px-4 py-2 rounded-lg flex items-center gap-2`}>
                    <IconComponent size={20} />
                    <span className="font-semibold">{typeInfo.label}</span>
                  </div>
                );
              })()}

              {/* Show comparison for edits */}
              {selectedEvent.status === 'pending_edit' && selectedEvent.pendingChanges && (
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">📝 Changes Requested:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Original:</p>
                      <div className="bg-slate-900 p-2 rounded">
                        <p className="text-slate-300">{selectedEvent.title}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">New:</p>
                      <div className="bg-green-900/20 p-2 rounded border border-green-500">
                        <p className="text-green-300">{selectedEvent.pendingChanges.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Image */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={renderEventData(selectedEvent).image} 
                  alt={renderEventData(selectedEvent).title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {renderEventData(selectedEvent).title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar size={20} className="text-orange-500" />
                      <span>{renderEventData(selectedEvent).date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={20} className="text-orange-500" />
                      <span>{renderEventData(selectedEvent).location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Tag size={20} className="text-orange-500" />
                      <span>{renderEventData(selectedEvent).category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={20} className="text-orange-500" />
                      <span>By: {selectedEvent.createdBy?.username}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Description:</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {renderEventData(selectedEvent).description}
                  </p>
                </div>

                {renderEventData(selectedEvent).tags && renderEventData(selectedEvent).tags.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {renderEventData(selectedEvent).tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-slate-500 text-sm">
                  <p>Submitted: {new Date(selectedEvent.createdAt).toLocaleString()}</p>
                  <p>Email: {selectedEvent.createdBy?.email}</p>
                  {selectedEvent.deleteRequestedBy && (
                    <p>Delete requested by: {selectedEvent.deleteRequestedBy.username}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleApprove(selectedEvent._id, selectedEvent.status === 'pending_delete' ? 'delete' : 'create')}
                  disabled={processing}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle size={20} />
                  {processing ? 'Processing...' : selectedEvent.status === 'pending_delete' ? 'Approve Delete' : 'Approve Event'}
                </button>
                <button
                  onClick={() => openRejectModal(selectedEvent)}
                  disabled={processing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <XCircle size={20} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-red-500" size={28} />
              <h2 className="text-2xl font-bold text-white">Rejection Reason</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">
                  Please provide a reason for rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                  placeholder="Explain why this request is being rejected..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-3 rounded-lg font-semibold transition"
                >
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  disabled={processing}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Events List */}
      <div className="grid gap-6">
        {pendingEvents.map((event) => {
          const typeInfo = getEventTypeLabel(event);
          const IconComponent = typeInfo.icon;
          const displayData = renderEventData(event);
          
          return (
            <div 
              key={event._id} 
              className="bg-slate-800 rounded-lg border border-slate-700 hover:border-orange-500 transition overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                <div className="md:w-1/3">
                  <img 
                    src={displayData.image} 
                    alt={displayData.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Event Info */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            {displayData.title}
                          </h3>
                          <span className={`bg-${typeInfo.color}-500/20 text-${typeInfo.color}-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                            <IconComponent size={14} />
                            {typeInfo.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {displayData.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {displayData.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag size={16} />
                            {displayData.category}
                          </span>
                        </div>

                        <p className="text-slate-300 mb-3 line-clamp-2">
                          {displayData.description}
                        </p>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <User size={16} />
                          <span>
                            Submitted by: <span className="text-slate-400">{event.createdBy?.username}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowPreview(true);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Eye size={18} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleApprove(event._id, event.status === 'pending_delete' ? 'delete' : 'create')}
                      disabled={processing}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(event)}
                      disabled={processing}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {pendingEvents.length === 0 && (
          <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-500 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              All Caught Up!
            </h3>
            <p className="text-slate-400">
              No pending events to review at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}