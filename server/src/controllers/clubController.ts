import { Request, Response } from 'express';
import Club from '../models/Club';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getClubs = async (req: Request, res: Response) => {
  try {
    const { campus, category } = req.query;
    const filter: any = {};

    if (campus) filter.campus = campus;
    if (category) filter.category = category;

    const clubs = await Club.find(filter).populate('lead', 'username profile.fullName');
    res.json(clubs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching clubs', error: error.message });
  }
};

export const getClubBySlug = async (req: Request, res: Response) => {
  try {
    const { campus, slug } = req.params;
    const club = await Club.findOne({ campus, slug })
      .populate('lead', 'username email profile.fullName profile.avatarUrl')
      .populate('members', 'username profile.fullName profile.avatarUrl profile.codingProfiles');

    if (!club) {
      return res.status(404).json({ message: `Club ${slug} not found in ${campus}` });
    }
    res.json(club);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching club details', error: error.message });
  }
};

export const createClub = async (req: Request, res: Response) => {
  try {
    const { name, slug, campus, description, logoUrl, category, lead, mentors } = req.body;

    if (!name || !slug || !campus || !lead) {
      return res.status(400).json({ message: 'Name, slug, campus, and lead are required' });
    }

    const existingClub = await Club.findOne({ slug, campus });
    if (existingClub) {
      return res.status(400).json({ message: `Club slug ${slug} already exists for campus ${campus}` });
    }

    const newClub = new Club({
      name,
      slug,
      campus,
      description: description || '',
      logoUrl: logoUrl || '',
      category: category || 'tech',
      lead,
      mentors: mentors || [],
      members: [],
    });

    await newClub.save();
    res.status(201).json(newClub);
  } catch (error: any) {
    console.error('Create club error:', error);
    res.status(500).json({ message: 'Error creating club', error: error.message });
  }
};

export const updateClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { name, slug, description, logoUrl, category, lead, mentors } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (name) club.name = name;
    if (slug) club.slug = slug;
    if (description !== undefined) club.description = description;
    if (logoUrl !== undefined) club.logoUrl = logoUrl;
    if (category) club.category = category;
    if (lead) club.lead = lead;
    if (mentors) club.mentors = mentors;

    await club.save();
    res.json(club);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating club', error: error.message });
  }
};

export const deleteClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findByIdAndDelete(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json({ message: 'Club deleted successfully', club });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting club', error: error.message });
  }
};

export const toggleClubMembership = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { clubId } = req.params;
    const userId = req.user.id as any;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const index = club.members.indexOf(userId);
    let joined = false;
    if (index === -1) {
      club.members.push(userId);
      joined = true;
    } else {
      club.members.splice(index, 1);
    }

    await club.save();
    res.json({ message: joined ? 'Joined club successfully' : 'Left club successfully', joined });
  } catch (error: any) {
    res.status(500).json({ message: 'Error toggling membership', error: error.message });
  }
};
