import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';

// Import routes
import authRoutes from './routes/authRoutes';
import campusRoutes from './routes/campusRoutes';
import clubRoutes from './routes/clubRoutes';
import eventRoutes from './routes/eventRoutes';
import blogRoutes from './routes/blogRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import cardRoutes from './routes/cardRoutes';
import uploadRoutes from './routes/uploadRoutes';
import communityRoutes from './routes/communityRoutes';

import bcrypt from 'bcryptjs';

// Import Models for seeding
import Campus from './models/Campus';
import Community from './models/Community';
import Card from './models/Card';
import User from './models/User';
import Club from './models/Club';
import Event from './models/Event';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static uploads
const publicDir = path.join(__dirname, '../public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/communities', communityRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Campus MSOT Centralized API Server is running.');
});

// Database Seeder
const seedDatabase = async () => {
  try {
    // 1. Seed Campuses if empty
    const campusCount = await Campus.countDocuments();
    if (campusCount === 0) {
      console.log('Seeding initial campus data...');
      await Campus.insertMany([
        {
          slug: 'ghaziabad',
          name: 'MSOT Ghaziabad Campus',
          description: 'The flagship MSOT campus in Ghaziabad, driving coding excellence, innovation hubs, and outstanding industry placements.',
          bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
          logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop',
          facultyCoordinators: [
            { name: 'Dr. Ramesh Kumar', role: 'Head of Computer Science Dept.', email: 'ramesh.kumar@msot.org' },
            { name: 'Prof. Anjali Sharma', role: 'Placement Cell Convenor', email: 'anjali.sharma@msot.org' }
          ]
        },
        {
          slug: 'jaipur',
          name: 'MSOT Jaipur Campus',
          description: 'Empowering students in the Pink City with high-end tech communities, startup cells, and state-of-the-art incubation hubs.',
          bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
          logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop',
          facultyCoordinators: [
            { name: 'Dr. Vivek Verma', role: 'Dean of Student Affairs', email: 'vivek.verma@msot.org' }
          ]
        },
        {
          slug: 'bangalore',
          name: 'MSOT Bangalore Campus',
          description: 'Nestled in the Silicon Valley of India, focusing on cloud computing, AI breakthroughs, and extensive company tie-ups.',
          bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
          logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop',
          facultyCoordinators: [
            { name: 'Dr. Sneha Hegde', role: 'Head of Industry Relations', email: 'sneha.hegde@msot.org' }
          ]
        }
      ]);
      console.log('Campus data seeded.');
    }

    // 2. Seed Communities if empty
    const communityCount = await Community.countDocuments();
    if (communityCount === 0) {
      console.log('Seeding initial community data...');
      await Community.insertMany([
        {
          slug: 'open-source',
          name: 'Open Source',
          description: 'A thriving community of developers collaborating on global software, contributing to libraries, and organizing code sprints.',
          mentors: [{ name: 'Amit Pathak', role: 'Senior Architect @ RedHat' }],
          leads: [{ name: 'Ishita Sen', role: 'GitHub Campus Expert' }],
          contributionGuide: '### How to get started with Open Source\n1. Find repository on GitHub.\n2. Look for "good first issue" labels.\n3. Fork, clone, make changes, and push a PR!',
          resources: [
            { title: 'GitHub Git Guide', link: 'https://guides.github.com', category: 'Git' },
            { title: 'First Contributions Guide', link: 'https://firstcontributions.github.io', category: 'General' }
          ]
        },
        {
          slug: 'cp',
          name: 'Competitive Programming',
          description: 'Sharpen your algorithmic thinking, solve complex puzzles, and top the tables on Codeforces and LeetCode.',
          mentors: [{ name: 'Prof. K. K. Verma', role: 'ACM ICPC Coach' }],
          leads: [{ name: 'Rohit Bansal', role: 'Codeforces Master' }],
          contributionGuide: '### CP Roadmap\n1. Study Data Structures and Algorithms.\n2. Practice on LeetCode / Codeforces.\n3. Take part in Weekly Contests.',
          resources: [
            { title: 'USACO Guide', link: 'https://usaco.guide', category: 'Algorithms' },
            { title: 'LeetCode Patterns', link: 'https://seanprashad.com/leetcode-patterns/', category: 'Practice' }
          ]
        },
        {
          slug: 'ai-ml',
          name: 'AI / Machine Learning',
          description: 'Deep dive into neural networks, computer vision, natural language processing, and generative AI research.',
          mentors: [{ name: 'Dr. Suresh Ray', role: 'AI Researcher @ Google' }],
          leads: [{ name: 'Nisha Gupta', role: 'Kaggle Grandmaster' }],
          contributionGuide: '### ML Journey\n1. Learn Python and Calculus.\n2. Master NumPy, Pandas, and Scikit-Learn.\n3. Build projects on TensorFlow/PyTorch!',
          resources: [
            { title: 'Andrew Ng ML Course', link: 'https://www.coursera.org/learn/machine-learning', category: 'Course' }
          ]
        },
        {
          slug: 'gsoc',
          name: 'GSoC (Google Summer of Code)',
          description: 'Mentoring programs helping students make global open-source contributions with stipend opportunities.',
          mentors: [{ name: 'Rahul Dev', role: 'GSoC Mentor @ Apache' }],
          leads: [{ name: 'Pooja Roy', role: 'GSoC 2025 Alumni' }],
          contributionGuide: '### GSoC Application Guide\n1. Review organizations listed.\n2. Join slack/mailing lists.\n3. Draft proposal and submit draft.',
          resources: [
            { title: 'GSoC Student Guide', link: 'https://google.github.io/gsocguides/student/', category: 'Guide' }
          ]
        },
        {
          slug: 'web-dev',
          name: 'Web Development',
          description: 'Create responsive, beautiful, high-performance web applications using modern web technologies.',
          mentors: [{ name: 'Karan Singhal', role: 'Lead Developer @ Vercel' }],
          leads: [{ name: 'Sneha Roy', role: 'Next.js Enthusiast' }],
          contributionGuide: '### Frontend/Backend Pathway\n1. Build layout designs using HTML/CSS.\n2. Understand JavaScript DOM.\n3. Adopt React/Next.js!',
          resources: [
            { title: 'MDN Web Docs', link: 'https://developer.mozilla.org', category: 'Documentation' }
          ]
        },
        {
          slug: 'cyber-security',
          name: 'Cyber Security',
          description: 'Learn ethical hacking, capture the flag contests, cryptography, and server hardening.',
          mentors: [{ name: 'Aditya Sen', role: 'Security Consultant' }],
          leads: [{ name: 'Vikram Pal', role: 'OSCP Certified' }],
          contributionGuide: '### Cyber Sec CTF Guide\n1. Practice CTFs on TryHackMe.\n2. Learn bash scripting and networking.\n3. Take OSCP/CEH credentials.',
          resources: [
            { title: 'TryHackMe Labs', link: 'https://tryhackme.com', category: 'CTF' }
          ]
        },
        {
          slug: 'startup',
          name: 'Startup Community',
          description: 'Incubate ideas, build pitches, connect with angel investors, and drive product management sprints.',
          mentors: [{ name: 'Abhishek Goel', role: 'Founder @ TechLabs VC' }],
          leads: [{ name: 'Aditi Jain', role: 'E-Cell President' }],
          contributionGuide: '### E-Cell Roadmap\n1. Build minimum viable products (MVPs).\n2. Write executive business proposals.\n3. Prepare pitch decks and pitch at Campus E-Summits.',
          resources: [
            { title: 'Y Combinator Library', link: 'https://www.ycombinator.com/library', category: 'Startup' }
          ]
        }
      ]);
      console.log('Community data seeded.');
    }

    // 3. Seed initial Landing Page/Campus Cards if empty
    const cardCount = await Card.countDocuments();
    if (cardCount === 0) {
      console.log('Seeding initial Card cards...');
      await Card.insertMany([
        {
          title: 'Welcome to Campus MSOT Community',
          description: 'A centralized portal for students across all MSOT campuses to collaborate, compete, write blogs, and discover career opportunities.',
          type: 'hero',
          campus: 'all',
          order: 0,
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
        },
        {
          title: 'MSOT Ghaziabad Campus',
          description: 'Flagship coding environment, active technical societies, and strong placement tracks.',
          type: 'campus_select',
          campus: 'all',
          link: '/ghaziabad',
          order: 1,
          imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop'
        },
        {
          title: 'MSOT Jaipur Campus',
          description: 'Rich coding culture, robust incubation hubs, and dynamic startup bootcamps.',
          type: 'campus_select',
          campus: 'all',
          link: '/jaipur',
          order: 2,
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop'
        },
        {
          title: 'MSOT Bangalore Campus',
          description: 'Silicon Valley connections, cloud computing centers, and top IT hubs.',
          type: 'campus_select',
          campus: 'all',
          link: '/bangalore',
          order: 3,
          imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=300&auto=format&fit=crop'
        }
      ]);
      console.log('Card cards seeded.');
    }

    // 4. Seed default lead user if empty
    let leadUser = await User.findOne({ username: 'system_lead' });
    if (!leadUser) {
      console.log('Seeding default lead user...');
      const passwordHash = await bcrypt.hash('msotlead2026', 10);
      leadUser = new User({
        username: 'system_lead',
        email: 'lead@msot.org',
        passwordHash,
        role: 'club_admin',
        profile: {
          fullName: 'System Lead',
          skills: ['Management', 'Development'],
          projects: [],
          certifications: [],
          codingProfiles: {},
          socialLinks: {},
          achievements: ['Central Administrator']
        }
      });
      await leadUser.save();
      console.log('Default lead user seeded.');
    }

    // 5. Seed Clubs if empty
    const clubCount = await Club.countDocuments();
    if (clubCount === 0 && leadUser) {
      console.log('Seeding initial clubs data...');
      const campusesList: Array<'ghaziabad' | 'jaipur' | 'bangalore'> = ['ghaziabad', 'jaipur', 'bangalore'];
      for (const campusSlug of campusesList) {
        await Club.insertMany([
          {
            name: 'Kaizen Tech',
            slug: 'kaizen-tech',
            campus: campusSlug,
            description: 'Central coding club promoting algorithms, full stack development, open source contributions, and competitive programming.',
            category: 'tech',
            lead: leadUser._id,
            mentors: [{ name: 'Dr. Vivek Sharma', role: 'Faculty Coach' }],
            members: [leadUser._id]
          },
          {
            name: 'Nexcell',
            slug: 'nexcell',
            campus: campusSlug,
            description: 'Entrepreneurship cell fostering innovation, business model pitches, startups incubation, and industry connections.',
            category: 'nexcell',
            lead: leadUser._id,
            mentors: [{ name: 'Prof. Anjali Sharma', role: 'Incubation Guide' }],
            members: [leadUser._id]
          },
          {
            name: 'Khel Society',
            slug: 'khel-society',
            campus: campusSlug,
            description: 'Sports club organizing inter-college tournaments, track events, athletics, and promoting a healthy student life.',
            category: 'sports',
            lead: leadUser._id,
            mentors: [{ name: 'Coach Rajveer Singh', role: 'Athletics Coach' }],
            members: [leadUser._id]
          },
          {
            name: 'Malhar',
            slug: 'malhar',
            campus: campusSlug,
            description: 'Cultural society bringing music, theater, dance, art, photography, and creative student showcases to life.',
            category: 'culture',
            lead: leadUser._id,
            mentors: [{ name: 'Dr. Sneha Hegde', role: 'Cultural Coordinator' }],
            members: [leadUser._id]
          }
        ]);
      }
      console.log('Clubs data seeded.');
    }

    // 6. Seed Events if empty
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('Seeding initial events data...');
      const campusesList: Array<'ghaziabad' | 'jaipur' | 'bangalore'> = ['ghaziabad', 'jaipur', 'bangalore'];
      for (const campusSlug of campusesList) {
        await Event.insertMany([
          {
            title: `${campusSlug.toUpperCase()} HackFest 2026`,
            description: 'A 24-hour student-run hackathon bringing together programmers, designers, and innovators to build products solving local challenges.',
            posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop',
            campus: campusSlug,
            registrationLink: 'https://devfolio.co',
            eventDate: new Date(Date.now() + 86400000 * 5),
            expiryDate: new Date(Date.now() + 86400000 * 6),
            category: 'hackathon'
          },
          {
            title: 'Resume Building & Interview Prep',
            description: 'Learn from top alumni on how to polish your resume, construct a strong GitHub profile, and crack MAANG technical interviews.',
            posterUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop',
            campus: campusSlug,
            registrationLink: 'https://unstop.com',
            eventDate: new Date(Date.now() + 86400000 * 10),
            expiryDate: new Date(Date.now() + 86400000 * 11),
            category: 'workshop'
          },
          {
            title: 'Malhar Spring Festival',
            description: 'The annual cultural showcase featuring music battles, stage plays, photography exhibitions, and group dance competitions.',
            posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
            campus: campusSlug,
            registrationLink: 'https://unstop.com',
            eventDate: new Date(Date.now() + 86400000 * 15),
            expiryDate: new Date(Date.now() + 86400000 * 16),
            category: 'cultural'
          },
          {
            title: 'Inter-Campus Sports Meet',
            description: 'Basketball, cricket, and athletic tournaments across Ghaziabad, Jaipur, and Bangalore campuses.',
            posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&auto=format&fit=crop',
            campus: campusSlug,
            registrationLink: 'https://unstop.com',
            eventDate: new Date(Date.now() + 86400000 * 20),
            expiryDate: new Date(Date.now() + 86400000 * 21),
            category: 'sports'
          }
        ]);
      }
      console.log('Events data seeded.');
    }
  } catch (err) {
    console.error('Seeding database error:', err);
  }
};

// Start Server
connectDB().then(() => {
  seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
