'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { User, Code, Edit2, Plus, GitBranch, ExternalLink, Globe, FileText, Award, Layers } from 'lucide-react';

export default function StudentProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, login, updateUser } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Edit fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  // Handles
  const [github, setGithub] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [codechef, setCodechef] = useState('');
  const [hackerrank, setHackerrank] = useState('');

  // Socials
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Projects/Certifications
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', githubLink: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '', credentialUrl: '' });
  const [newAchievement, setNewAchievement] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const data = await api.get(`/auth/profile/${username}`);
      setProfile(data);
      
      // Initialize edit fields
      setFullName(data.profile?.fullName || '');
      setBio(data.profile?.bio || '');
      setSkills(data.profile?.skills?.join(', ') || '');
      setResumeUrl(data.profile?.resumeUrl || '');
      
      // Handles
      setGithub(data.profile?.codingProfiles?.github || '');
      setLeetcode(data.profile?.codingProfiles?.leetcode || '');
      setCodeforces(data.profile?.codingProfiles?.codeforces || '');
      setCodechef(data.profile?.codingProfiles?.codechef || '');
      setHackerrank(data.profile?.codingProfiles?.hackerrank || '');

      // Socials
      setLinkedin(data.profile?.socialLinks?.linkedin || '');
      setTwitter(data.profile?.socialLinks?.twitter || '');
      setPortfolio(data.profile?.socialLinks?.portfolio || '');
    } catch (err) {
      console.log('Error fetching student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      const data = await api.put('/auth/profile/update', {
        fullName,
        bio,
        skills: parsedSkills,
        resumeUrl,
        codingProfiles: { github, leetcode, codeforces, codechef, hackerrank },
        socialLinks: { linkedin, twitter, portfolio }
      });
      alert('Profile updated successfully!');
      setEditMode(false);
      updateUser(data.user);
      fetchProfile();
    } catch (err: any) {
      alert(err.message || 'Profile update failed.');
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) return;
    try {
      const updatedProjects = [...(profile.profile.projects || []), newProject];
      const data = await api.put('/auth/profile/update', { projects: updatedProjects });
      updateUser(data.user);
      setProfile(data.user);
      setNewProject({ title: '', description: '', link: '', githubLink: '' });
      alert('Project added!');
    } catch (err) {
      alert('Add project failed');
    }
  };

  const handleAddCert = async () => {
    if (!newCert.name || !newCert.issuer) return;
    try {
      const updatedCerts = [...(profile.profile.certifications || []), newCert];
      const data = await api.put('/auth/profile/update', { certifications: updatedCerts });
      updateUser(data.user);
      setProfile(data.user);
      setNewCert({ name: '', issuer: '', date: '', credentialUrl: '' });
      alert('Certification added!');
    } catch (err) {
      alert('Add certification failed');
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement) return;
    try {
      const updatedAchievements = [...(profile.profile.achievements || []), newAchievement];
      const data = await api.put('/auth/profile/update', { achievements: updatedAchievements });
      updateUser(data.user);
      setProfile(data.user);
      setNewAchievement('');
      alert('Achievement added!');
    } catch (err) {
      alert('Add achievement failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Student profile not found</h1>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-sm">
      {/* Profile Overview Card */}
      <div className="relative p-8 rounded-xl bg-card-bg border border-card-border shadow flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center space-x-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/20">
            <User size={48} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{profile.profile?.fullName}</h1>
            <p className="text-text-muted text-sm">@{profile.username} &bull; <span className="capitalize">{profile.campus} Campus</span></p>
            <p className="text-text-muted text-xs italic mt-2 max-w-xl">{profile.profile?.bio || 'No biography written yet.'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.profile?.resumeUrl && (
            <a
              href={profile.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-card-border rounded bg-background hover:bg-card-bg transition flex items-center space-x-1 font-semibold text-xs"
            >
              <FileText size={14} />
              <span>View Resume</span>
            </a>
          )}
          {isOwnProfile && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded transition flex items-center space-x-1 font-semibold text-xs"
            >
              <Edit2 size={14} />
              <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <form onSubmit={handleUpdateProfile} className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4">
          <h2 className="text-lg font-bold">Edit Profile Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Resume Link (URL)</label>
              <input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="col-span-full space-y-1">
              <label className="font-semibold text-xs text-text-muted">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" rows={3}></textarea>
            </div>
            <div className="col-span-full space-y-1">
              <label className="font-semibold text-xs text-text-muted">Skills (comma separated)</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, Python, MongoDB" className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>

            <h3 className="col-span-full font-bold text-sm border-b border-card-border pb-1 pt-2">Coding Handles</h3>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">GitHub Username</label>
              <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">LeetCode Username</label>
              <input type="text" value={leetcode} onChange={(e) => setLeetcode(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Codeforces Username</label>
              <input type="text" value={codeforces} onChange={(e) => setCodeforces(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">CodeChef Username</label>
              <input type="text" value={codechef} onChange={(e) => setCodechef(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">HackerRank Username</label>
              <input type="text" value={hackerrank} onChange={(e) => setHackerrank(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>

            <h3 className="col-span-full font-bold text-sm border-b border-card-border pb-1 pt-2">Socials</h3>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">LinkedIn URL</label>
              <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-xs text-text-muted">Twitter URL</label>
              <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
            <div className="space-y-1 col-span-full">
              <label className="font-semibold text-xs text-text-muted">Portfolio URL</label>
              <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="w-full px-3 py-1.5 border border-card-border rounded bg-background focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-semibold text-xs hover:bg-primary-hover transition">
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: coding profiles & stats */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4">
            <h3 className="font-bold text-sm border-b border-card-border pb-2 flex items-center space-x-1.5">
              <Layers size={16} className="text-primary" />
              <span>Skills Directory</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.profile?.skills?.map((skill: string, idx: number) => (
                <span key={idx} className="px-3 py-1 rounded bg-background border border-card-border font-semibold text-xs text-foreground">
                  {skill}
                </span>
              ))}
              {(!profile.profile?.skills || profile.profile.skills.length === 0) && (
                <span className="text-xs text-text-muted">No skills listed yet.</span>
              )}
            </div>
          </div>

          {/* Socials & Coding handles */}
          <div className="p-6 rounded-xl bg-card-bg border border-card-border space-y-4">
            <h3 className="font-bold text-sm border-b border-card-border pb-2 flex items-center space-x-1.5">
              <Code size={16} className="text-primary" />
              <span>Profiles & Handles</span>
            </h3>
            <div className="space-y-3">
              {profile.profile?.codingProfiles?.github && (
                <a
                  href={`https://github.com/${profile.profile.codingProfiles.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs hover:text-primary transition"
                >
                  <span className="flex items-center space-x-1.5 font-medium">
                    <GitBranch size={16} />
                    <span>GitHub</span>
                  </span>
                  <span className="font-mono text-text-muted">@{profile.profile.codingProfiles.github}</span>
                </a>
              )}
              {profile.profile?.socialLinks?.linkedin && (
                <a
                  href={profile.profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs hover:text-primary transition"
                >
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Globe size={16} className="text-blue-500" />
                    <span>LinkedIn</span>
                  </span>
                  <span className="text-text-muted">Visit Profile</span>
                </a>
              )}
              {profile.profile?.socialLinks?.twitter && (
                <a
                  href={profile.profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs hover:text-primary transition"
                >
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Globe size={16} className="text-blue-400" />
                    <span>Twitter</span>
                  </span>
                  <span className="text-text-muted">Visit Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right column: projects, certs, achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-card-border pb-2">
              <h3 className="font-bold text-sm flex items-center space-x-1.5">
                <Code size={16} className="text-primary" />
                <span>Projects Showcase</span>
              </h3>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <input type="text" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="px-2 py-1 text-xs border border-card-border rounded bg-card-bg" />
                  <input type="text" placeholder="Desc" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="px-2 py-1 text-xs border border-card-border rounded bg-card-bg" />
                  <button onClick={handleAddProject} className="p-1 rounded bg-primary text-white"><Plus size={14} /></button>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {profile.profile?.projects?.map((proj: any, idx: number) => (
                <div key={idx} className="p-5 rounded-lg bg-card-bg border border-card-border space-y-2">
                  <h4 className="font-bold text-sm">{proj.title}</h4>
                  <p className="text-xs text-text-muted">{proj.description}</p>
                  <div className="flex space-x-4 pt-1">
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center space-x-1 hover:underline"><span>Live Link</span><ExternalLink size={10} /></a>}
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center space-x-1 hover:underline"><GitBranch size={12} /><span>GitHub Repo</span></a>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-card-border pb-2">
              <h3 className="font-bold text-sm flex items-center space-x-1.5">
                <Award size={16} className="text-primary" />
                <span>Certifications</span>
              </h3>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <input type="text" placeholder="Name" value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} className="px-2 py-1 text-xs border border-card-border rounded bg-card-bg" />
                  <input type="text" placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} className="px-2 py-1 text-xs border border-card-border rounded bg-card-bg" />
                  <button onClick={handleAddCert} className="p-1 rounded bg-primary text-white"><Plus size={14} /></button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {profile.profile?.certifications?.map((cert: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-card-bg border border-card-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs">{cert.name}</h4>
                    <p className="text-text-muted text-[10px]">{cert.issuer} &bull; {cert.date || 'Active'}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center space-x-1 hover:underline">
                      <span>View Credential</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
