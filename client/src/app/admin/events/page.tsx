'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Calendar, Trash2, Edit2, Plus } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  campus: string;
  registrationLink: string;
  eventDate: string;
  expiryDate: string;
  category: string;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campus, setCampus] = useState('all');
  const [registrationLink, setRegistrationLink] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('workshop');

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.get('/events');
      setEvents(data);
    } catch (err) {
      console.log('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !registrationLink || !eventDate || !expiryDate) return;

    try {
      const eventData = { title, description, campus, registrationLink, eventDate, expiryDate, category };
      if (editingId) {
        await api.put(`/events/${editingId}`, eventData);
        alert('Event updated successfully!');
      } else {
        await api.post('/events', eventData);
        alert('Event created successfully!');
      }
      resetForm();
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event._id);
    setTitle(event.title);
    setDescription(event.description || '');
    setCampus(event.campus);
    setRegistrationLink(event.registrationLink);
    setEventDate(new Date(event.eventDate).toISOString().slice(0, 16));
    setExpiryDate(new Date(event.expiryDate).toISOString().slice(0, 16));
    setCategory(event.category);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      alert('Event deleted successfully!');
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCampus('all');
    setRegistrationLink('');
    setEventDate('');
    setExpiryDate('');
    setCategory('workshop');
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <Calendar className="text-emerald-500" />
          <span>Manage Events & Hackathons</span>
        </h1>
        <p className="text-text-muted text-xs">
          Schedule new coding competitions, seminars, and webinars campus-wise. Passes automatically handled by expiry timestamps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-xl bg-background border border-card-border space-y-4 h-fit">
          <h2 className="text-base font-bold flex items-center space-x-1">
            <Plus size={16} />
            <span>{editingId ? 'Edit Event Details' : 'Create New Event'}</span>
          </h2>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              rows={2}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Target Campus</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="all">All Campuses</option>
                <option value="ghaziabad">Ghaziabad</option>
                <option value="jaipur">Jaipur</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="coding">Coding Contest</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Registration Link</label>
            <input
              type="url"
              required
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Event Start Date</label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Registration Expiry</label>
              <input
                type="datetime-local"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition">
              {editingId ? 'Update Event' : 'Schedule Event'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-card-border rounded font-semibold text-xs transition">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Event List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold">Current Events Directory</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-background rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const isExpired = new Date(event.expiryDate).getTime() < Date.now();
                return (
                  <div key={event._id} className="p-4 rounded-lg bg-background border border-card-border flex justify-between items-center shadow-sm">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                          {event.category}
                        </span>
                        {isExpired && (
                          <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/5 border border-red-500/10">
                            Expired
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs mt-2">{event.title}</h4>
                      <p className="text-[10px] text-text-muted capitalize">Campus: {event.campus} &bull; Date: {new Date(event.eventDate).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(event)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {events.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted rounded bg-background border border-card-border border-dashed">
                  No events listed yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
