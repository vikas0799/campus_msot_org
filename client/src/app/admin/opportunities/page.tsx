'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Briefcase, Trash2, Edit2, Plus } from 'lucide-react';

interface Opportunity {
  _id: string;
  title: string;
  company: string;
  type: string;
  link: string;
  skillsRequired: string[];
  salary?: string;
  campus?: string | null;
  description: string;
}

export default function ManageOpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('job');
  const [link, setLink] = useState('');
  const [skills, setSkills] = useState('');
  const [salary, setSalary] = useState('');
  const [campus, setCampus] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpps();
  }, []);

  const fetchOpps = async () => {
    try {
      const data = await api.get('/opportunities');
      setOpps(data);
    } catch (err) {
      console.log('Error fetching opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !link) return;

    try {
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      const oppData = {
        title,
        company,
        type,
        link,
        skillsRequired: parsedSkills,
        salary,
        campus: campus || null,
        description
      };

      if (editingId) {
        await api.put(`/opportunities/${editingId}`, oppData);
        alert('Opportunity updated successfully!');
      } else {
        await api.post('/opportunities', oppData);
        alert('Opportunity created successfully!');
      }
      resetForm();
      fetchOpps();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingId(opp._id);
    setTitle(opp.title);
    setCompany(opp.company);
    setType(opp.type);
    setLink(opp.link);
    setSkills(opp.skillsRequired?.join(', ') || '');
    setSalary(opp.salary || '');
    setCampus(opp.campus || '');
    setDescription(opp.description || '');
  };

  const handleDelete = async (oppId: string) => {
    if (!confirm('Are you sure you want to delete this placement listing?')) return;
    try {
      await api.delete(`/opportunities/${oppId}`);
      alert('Opportunity deleted successfully!');
      fetchOpps();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCompany('');
    setType('job');
    setLink('');
    setSkills('');
    setSalary('');
    setCampus('');
    setDescription('');
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <Briefcase className="text-emerald-500" />
          <span>Manage Placements & Internships</span>
        </h1>
        <p className="text-text-muted text-xs">
          Post new job listings, startup hiring, or referral links across all campuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-xl bg-background border border-card-border space-y-4 h-fit">
          <h2 className="text-base font-bold flex items-center space-x-1">
            <Plus size={16} />
            <span>{editingId ? 'Edit Opportunity Details' : 'Post New Opening'}</span>
          </h2>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Job / Internship Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Company Name</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Listing Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
                <option value="referral">Referral Opportunity</option>
                <option value="startup">Startup Hiring</option>
                <option value="remote">Remote Job</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Target Campus</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="">All Campuses</option>
                <option value="ghaziabad">Ghaziabad</option>
                <option value="jaipur">Jaipur</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Application / Referral Link</label>
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Skills Required (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, C++"
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Compensation Package / Stipend</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. ₹12 LPA or ₹40,000/mo"
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

          <div className="flex space-x-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition">
              {editingId ? 'Update Opening' : 'Post Opening'}
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
          <h2 className="text-base font-bold">Current Opportunities Listings</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-background rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {opps.map((opp) => (
                <div key={opp._id} className="p-4 rounded-lg bg-background border border-card-border flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                      {opp.type}
                    </span>
                    <h4 className="font-bold text-xs mt-2">{opp.title}</h4>
                    <p className="text-[10px] text-text-muted capitalize">Company: {opp.company} &bull; Salary: {opp.salary || 'Competitive'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(opp)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(opp._id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {opps.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted rounded bg-background border border-card-border border-dashed">
                  No opportunities listed yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
