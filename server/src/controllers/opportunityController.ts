import { Request, Response } from 'express';
import Opportunity from '../models/Opportunity';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const { type, campus, search, company } = req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (campus) filter.campus = { $in: [campus, null] };
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching opportunities', error: error.message });
  }
};

export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    const opp = await Opportunity.findById(opportunityId);
    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opp);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching opportunity', error: error.message });
  }
};

export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const { title, company, logoUrl, description, type, link, skillsRequired, salary, deadline, campus } = req.body;

    if (!title || !company || !type || !link || !description) {
      return res.status(400).json({ message: 'Title, company, type, link, and description are required' });
    }

    const opp = new Opportunity({
      title,
      company,
      logoUrl: logoUrl || '',
      description,
      type,
      link,
      skillsRequired: skillsRequired || [],
      salary: salary || '',
      deadline: deadline ? new Date(deadline) : undefined,
      campus: campus || null,
    });

    await opp.save();
    res.status(201).json(opp);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating opportunity', error: error.message });
  }
};

export const updateOpportunity = async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    const { title, company, logoUrl, description, type, link, skillsRequired, salary, deadline, campus } = req.body;

    const opp = await Opportunity.findById(opportunityId);
    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (title) opp.title = title;
    if (company) opp.company = company;
    if (logoUrl !== undefined) opp.logoUrl = logoUrl;
    if (description) opp.description = description;
    if (type) opp.type = type;
    if (link) opp.link = link;
    if (skillsRequired) opp.skillsRequired = skillsRequired;
    if (salary !== undefined) opp.salary = salary;
    if (deadline !== undefined) opp.deadline = deadline ? new Date(deadline) : undefined;
    if (campus !== undefined) opp.campus = campus;

    await opp.save();
    res.json(opp);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating opportunity', error: error.message });
  }
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    const opp = await Opportunity.findByIdAndDelete(opportunityId);
    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted successfully', opp });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting opportunity', error: error.message });
  }
};

export const toggleBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { opportunityId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oppIdObj = opportunityId as any;
    const index = user.bookmarks.indexOf(oppIdObj);
    let bookmarked = false;

    if (index === -1) {
      user.bookmarks.push(oppIdObj);
      bookmarked = true;
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    res.json({ message: bookmarked ? 'Opportunity bookmarked' : 'Bookmark removed', bookmarked });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating bookmark', error: error.message });
  }
};

export const getBookmarkedOpportunities = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id).populate('bookmarks');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.bookmarks);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
  }
};
