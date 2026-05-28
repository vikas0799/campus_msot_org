'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { CreditCard, Trash2, Edit2, Plus, AlertCircle } from 'lucide-react';

interface Card {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  type: string;
  campus: string;
  order: number;
}

export default function ManageCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('campus_select');
  const [campus, setCampus] = useState('all');
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await api.get('/cards');
      setCards(data);
    } catch (err) {
      console.log('Error fetching cards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) return;

    try {
      if (editingId) {
        await api.put(`/cards/${editingId}`, { title, description, imageUrl, link, type, campus, order });
        alert('Card updated successfully!');
      } else {
        await api.post('/cards', { title, description, imageUrl, link, type, campus, order });
        alert('Card created successfully!');
      }
      resetForm();
      fetchCards();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleEdit = (card: Card) => {
    setEditingId(card._id);
    setTitle(card.title);
    setDescription(card.description || '');
    setImageUrl(card.imageUrl || '');
    setLink(card.link || '');
    setType(card.type);
    setCampus(card.campus);
    setOrder(card.order);
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    try {
      await api.delete(`/cards/${cardId}`);
      alert('Card deleted successfully!');
      fetchCards();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setLink('');
    setType('campus_select');
    setCampus('all');
    setOrder(0);
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <CreditCard className="text-emerald-500" />
          <span>Manage Home & Campus Cards</span>
        </h1>
        <p className="text-text-muted text-xs">
          Dynamically add, edit, or delete information layout cards on landing page and campus portals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-xl bg-background border border-card-border space-y-4 h-fit">
          <h2 className="text-base font-bold flex items-center space-x-1">
            <Plus size={16} />
            <span>{editingId ? 'Edit Card Details' : 'Add New Card info'}</span>
          </h2>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Card Title</label>
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

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Target Link (URL)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Card Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
              >
                <option value="campus_select">Campus Card</option>
                <option value="hero">Hero Card</option>
                <option value="featured_opp">Placement Spotlight</option>
                <option value="hackathon">Hackathon Banner</option>
                <option value="banner">Ad Banner</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Campus</label>
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
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-xs text-text-muted">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-card-border rounded bg-card-bg focus:outline-none"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition">
              {editingId ? 'Update Card' : 'Save Card'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-card-border rounded font-semibold text-xs transition">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Card list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold">Current Cards Directory</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-background rounded"></div>
              <div className="h-10 bg-background rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div key={card._id} className="p-4 rounded-lg bg-background border border-card-border flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                      {card.type}
                    </span>
                    <h4 className="font-bold text-xs mt-2">{card.title}</h4>
                    <p className="text-[10px] text-text-muted capitalize">Campus: {card.campus} &bull; Order: {card.order}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(card)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(card._id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted rounded bg-background border border-card-border border-dashed">
                  No layout cards created yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
