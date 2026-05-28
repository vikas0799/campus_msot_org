import { Request, Response } from 'express';
import Event from '../models/Event';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { campus, category, activeOnly } = req.query;
    const filter: any = {};

    if (campus) {
      filter.campus = { $in: [campus, 'all'] };
    }
    if (category) {
      filter.category = category;
    }
    if (activeOnly === 'true') {
      filter.expiryDate = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .sort({ eventDate: 1 })
      .populate('club', 'name slug logoUrl');

    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('club', 'name slug logoUrl');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, posterUrl, campus, club, registrationLink, eventDate, expiryDate, category } = req.body;

    if (!title || !description || !registrationLink || !eventDate || !expiryDate) {
      return res.status(400).json({ message: 'Title, description, registration link, event date, and expiry date are required' });
    }

    const newEvent = new Event({
      title,
      description,
      posterUrl: posterUrl || '',
      campus: campus || 'all',
      club: club || null,
      registrationLink,
      eventDate: new Date(eventDate),
      expiryDate: new Date(expiryDate),
      category: category || 'workshop',
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error: any) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { title, description, posterUrl, campus, club, registrationLink, eventDate, expiryDate, category } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (posterUrl !== undefined) event.posterUrl = posterUrl;
    if (campus) event.campus = campus;
    if (club !== undefined) event.club = club;
    if (registrationLink) event.registrationLink = registrationLink;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (expiryDate) event.expiryDate = new Date(expiryDate);
    if (category) event.category = category;

    await event.save();
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully', event });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};
