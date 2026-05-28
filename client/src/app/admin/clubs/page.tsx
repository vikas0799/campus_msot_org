'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Users, Trash2, Edit2, Plus } from 'lucide-react';

interface Club {
  _id: string;
  name: string;
  slug: string;
  campus: string;
  category: string;
  description: string;
  lead: { username: string; profile?: { fullName: string } };
}

export default function ManageClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [campus, setCampus] = useState('ghaziabad');
  const [category, setCategory] = useState('tech');
  const [description, setDescription] = useState('');
  const [leadUsername, setLeadUsername] = useState('');

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await api.get('/clubs');
      setClubs(data);
    } catch (err) {
      console.log('Error fetching clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !leadUsername) return;

    try {
      // Find lead user ID first or let backend look it up
      // We will lookup users from api or send lead ID.
      // To simplify, let's look up user list
      const users = await api.get('/auth/users');
      const targetUser = users.find((u: any) => u.username === leadUsername.toLowerCase().trim());
      if (!targetUser) {
        alert(`Lead user @${leadUsername} not found. Please register this user first!`);
        return;
      }

      const clubData = { name, slug, campus, category, description, lead: targetUser._id };

      if (editingId) {
        await api.put(`/clubs/${editingId}`, clubData);
        alert('Club updated successfully!');
      } else {
        await api.post('/clubs', clubData);
        alert('Club created successfully!');
      }
      resetForm();
      fetchClubs();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleEdit = (club: Club) => {
    setEditingId(club._id);
    setName(club.name);
    setSlug(club.slug);
    setCampus(club.campus);
    setCategory(club.category);
    setDescription(club.description || '');
    setLeadUsername(club.lead?.username || '');
  };

  const handleDelete = async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    try {
      await api.delete(`/clubs/${clubId}`);
      alert('Club deleted successfully!');
      fetchClubs();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCampus('ghaziabad');
    setCategory('tech');
    setDescription('');
    setLeadUsername('');
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <Users className="text-emerald-500" />
          <span>Manage Campus Clubs & Cells</span>
        </h1>
        <p className="text-text-muted text-xs">
          Configure technical societies (NEXCELL, Tech, Sports, Culture) and assign student coordinators as leads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-xl bg-background border border-card-border space-y-4 h-fit">
          <h2 className="text-base font-bold flex items-center space-x-1">
            <Plus size={16} />
            <span>{editingId ? 'Edit Club Details' : 'Register New Club'}</span>
          </h2>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Club Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Club Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="nexcell"
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="tech">Tech</option>
                <option value="nexcell">Nexcell</option>
                <option value="culture">Culture</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Campus</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="ghaziabad">Ghaziabad</option>
                <option value="jaipur">Jaipur</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Lead Username</label>
              <input
                type="text"
                required
                value={leadUsername}
                onChange={(e) => setLeadUsername(e.target.value)}
                placeholder="siddharth_r"
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              rows={3}
            ></textarea>
          </div>

          <div className="flex space-x-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition">
              {editingId ? 'Update Club' : 'Create Club'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-card-border rounded font-semibold text-xs transition">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold">Current Clubs & Societies</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-background rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {clubs.map((club) => (
                <div key={club._id} className="p-4 rounded-lg bg-background border border-card-border flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                      {club.category} Cell
                    </span>
                    <h4 className="font-bold text-xs mt-2">{club.name}</h4>
                    <p className="text-[10px] text-text-muted capitalize">Campus: {club.campus} &bull; Lead: @{club.lead?.username}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(club)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(club._id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {clubs.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted rounded bg-background border border-card-border border-dashed">
                  No clubs listed yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
