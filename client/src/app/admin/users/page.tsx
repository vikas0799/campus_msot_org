'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface UserItem {
  _id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'campus_admin' | 'club_admin' | 'student';
  campus?: string | null;
  profile?: { fullName: string };
}

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.log('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, campus: string | null) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole, campus });
      alert('User role updated successfully!');
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update role.');
    }
  };

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center text-xs text-text-muted">
        Access Denied: Only Super Admins can modify accounts and roles.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <UserCheck className="text-emerald-500" />
          <span>Manage User Accounts & Roles</span>
        </h1>
        <p className="text-text-muted text-xs">
          Promote students to administrative levels (Campus Admin, Club Admin, Super Admin) and allocate campus divisions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-background border border-card-border rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-card-bg p-4 border-b border-card-border font-bold text-xs text-text-muted">
            <div className="col-span-3">Full Name / Username</div>
            <div className="col-span-3">Email Address</div>
            <div className="col-span-3">Role Assignment</div>
            <div className="col-span-3">Campus Boundaries</div>
          </div>

          <div className="divide-y divide-card-border">
            {users.map((item) => (
              <div key={item._id} className="grid grid-cols-12 p-4 items-center hover:bg-card-bg/30 transition">
                <div className="col-span-3 text-xs">
                  <h4 className="font-bold text-foreground">{item.profile?.fullName || item.username}</h4>
                  <p className="text-[10px] text-text-muted">@{item.username}</p>
                </div>
                <div className="col-span-3 text-xs text-text-muted">
                  {item.email}
                </div>
                <div className="col-span-3 text-xs">
                  <select
                    value={item.role}
                    onChange={(e) => handleRoleChange(item._id, e.target.value, item.campus || null)}
                    className="px-2 py-1 border border-card-border rounded bg-card-bg focus:outline-none font-medium"
                  >
                    <option value="student">Student</option>
                    <option value="club_admin">Club Admin</option>
                    <option value="campus_admin">Campus Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="col-span-3 text-xs">
                  <select
                    value={item.campus || ''}
                    onChange={(e) => handleRoleChange(item._id, item.role, e.target.value || null)}
                    className="px-2 py-1 border border-card-border rounded bg-card-bg focus:outline-none"
                  >
                    <option value="">No Campus (Global)</option>
                    <option value="ghaziabad">Ghaziabad</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
