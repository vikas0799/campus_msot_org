import { Request, Response } from 'express';
import Community from '../models/Community';

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const list = await Community.find();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching communities', error: error.message });
  }
};

export const getCommunityBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const comm = await Community.findOne({ slug }).populate('events');
    if (!comm) {
      return res.status(404).json({ message: `Community ${slug} not found` });
    }
    res.json(comm);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching community detail', error: error.message });
  }
};

export const upsertCommunity = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { name, description, mentors, leads, resources, contributionGuide } = req.body;

    let comm = await Community.findOne({ slug });

    if (comm) {
      if (name) comm.name = name;
      if (description) comm.description = description;
      if (mentors) comm.mentors = mentors;
      if (leads) comm.leads = leads;
      if (resources) comm.resources = resources;
      if (contributionGuide !== undefined) comm.contributionGuide = contributionGuide;
      await comm.save();
    } else {
      comm = new Community({
        name: name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        slug,
        description: description || '',
        mentors: mentors || [],
        leads: leads || [],
        resources: resources || [],
        contributionGuide: contributionGuide || '',
      });
      await comm.save();
    }

    res.json(comm);
  } catch (error: any) {
    res.status(500).json({ message: 'Error upserting community detail', error: error.message });
  }
};
