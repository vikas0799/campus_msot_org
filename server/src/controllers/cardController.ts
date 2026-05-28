import { Request, Response } from 'express';
import Card from '../models/Card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const { campus, type } = req.query;
    const filter: any = {};

    if (campus) {
      filter.campus = { $in: [campus, 'all'] };
    }
    if (type) {
      filter.type = type;
    }

    const cards = await Card.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(cards);
  } catch (error: any) {
    console.error('Get cards error:', error);
    res.status(500).json({ message: 'Server error fetching cards', error: error.message });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, link, type, campus, order } = req.body;

    if (!title || !type || !campus) {
      return res.status(400).json({ message: 'Title, type, and campus are required' });
    }

    const newCard = new Card({
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      link: link || '',
      type,
      campus,
      order: order || 0,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error: any) {
    console.error('Create card error:', error);
    res.status(500).json({ message: 'Server error creating card', error: error.message });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { title, description, imageUrl, link, type, campus, order } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (title) card.title = title;
    if (description !== undefined) card.description = description;
    if (imageUrl !== undefined) card.imageUrl = imageUrl;
    if (link !== undefined) card.link = link;
    if (type) card.type = type;
    if (campus) card.campus = campus;
    if (order !== undefined) card.order = order;

    await card.save();
    res.json({ message: 'Card updated successfully', card });
  } catch (error: any) {
    console.error('Update card error:', error);
    res.status(500).json({ message: 'Server error updating card', error: error.message });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully', card });
  } catch (error: any) {
    console.error('Delete card error:', error);
    res.status(500).json({ message: 'Server error deleting card', error: error.message });
  }
};
