import { Request, Response } from 'express';
import Campus from '../models/Campus';

export const getCampuses = async (req: Request, res: Response) => {
  try {
    const campuses = await Campus.find();
    res.json(campuses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campuses', error: error.message });
  }
};

export const getCampusBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const campus = await Campus.findOne({ slug });
    if (!campus) {
      return res.status(404).json({ message: `Campus ${slug} not found` });
    }
    res.json(campus);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campus details', error: error.message });
  }
};

export const upsertCampus = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { name, bannerUrl, logoUrl, description, facultyCoordinators, campusAmbassadors } = req.body;

    let campus = await Campus.findOne({ slug });

    if (campus) {
      if (name) campus.name = name;
      if (bannerUrl !== undefined) campus.bannerUrl = bannerUrl;
      if (logoUrl !== undefined) campus.logoUrl = logoUrl;
      if (description !== undefined) campus.description = description;
      if (facultyCoordinators) campus.facultyCoordinators = facultyCoordinators;
      if (campusAmbassadors) campus.campusAmbassadors = campusAmbassadors;

      await campus.save();
    } else {
      campus = new Campus({
        slug,
        name: name || slug.charAt(0).toUpperCase() + slug.slice(1),
        bannerUrl: bannerUrl || '',
        logoUrl: logoUrl || '',
        description: description || '',
        facultyCoordinators: facultyCoordinators || [],
        campusAmbassadors: campusAmbassadors || [],
      });
      await campus.save();
    }

    res.json(campus);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating campus details', error: error.message });
  }
};
