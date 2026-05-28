import { Request, Response } from 'express';
import Blog from '../models/Blog';
import Newsletter from '../models/Newsletter';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// --- BLOG CONTROLLERS ---

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { campus, category, search, trending } = req.query;
    const filter: any = { isPublished: true };

    if (campus) {
      filter.campus = { $in: [campus, 'all'] };
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    let queryBuilder = Blog.find(filter).populate('author', 'username profile.fullName profile.avatarUrl');

    if (trending === 'true') {
      queryBuilder = queryBuilder.sort({ trendingScore: -1, createdAt: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const blogs = await queryBuilder;
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('author', 'username email profile.fullName profile.avatarUrl');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment trending score on view
    blog.trendingScore += 1;
    await blog.save();

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blog details', error: error.message });
  }
};

export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { title, content, campus, category, coverImageUrl, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      author: req.user.id,
      campus: campus || 'all',
      category: category || 'General',
      coverImageUrl: coverImageUrl || '',
      isPublished: isPublished !== undefined ? isPublished : true,
      trendingScore: 0,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error: any) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { blogId } = req.params;
    const { title, content, campus, category, coverImageUrl, isPublished } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership or admin status
    const isAuthor = blog.author.toString() === req.user.id;
    const isAdmin = ['super_admin', 'campus_admin'].includes(req.user.role);
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own blogs' });
    }

    if (title) {
      blog.title = title;
      // Recalculate slug
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const existingBlog = await Blog.findOne({ slug, _id: { $ne: blog._id } });
      if (existingBlog) {
        slug = `${slug}-${Date.now()}`;
      }
      blog.slug = slug;
    }

    if (content) blog.content = content;
    if (campus) blog.campus = campus;
    if (category) blog.category = category;
    if (coverImageUrl !== undefined) blog.coverImageUrl = coverImageUrl;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const isAuthor = blog.author.toString() === req.user.id;
    const isAdmin = ['super_admin', 'campus_admin'].includes(req.user.role);
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own blogs' });
    }

    await Blog.findByIdAndDelete(blogId);
    res.json({ message: 'Blog deleted successfully', blog });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

// --- NEWSLETTER CONTROLLERS ---

export const getNewsletters = async (req: Request, res: Response) => {
  try {
    const { campus } = req.query;
    const filter: any = {};

    if (campus) {
      filter.campus = { $in: [campus, 'all'] };
    }

    const newsletters = await Newsletter.find(filter)
      .sort({ publishedDate: -1, createdAt: -1 })
      .populate('author', 'username profile.fullName');

    res.json(newsletters);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching newsletters', error: error.message });
  }
};

export const createNewsletter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { title, content, campus } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newNewsletter = new Newsletter({
      title,
      content,
      campus: campus || 'all',
      author: req.user.id,
      publishedDate: new Date(),
    });

    await newNewsletter.save();
    res.status(201).json(newNewsletter);
  } catch (error: any) {
    console.error('Create newsletter error:', error);
    res.status(500).json({ message: 'Error creating newsletter', error: error.message });
  }
};

export const deleteNewsletter = async (req: Request, res: Response) => {
  try {
    const { newsletterId } = req.params;
    const newsletter = await Newsletter.findByIdAndDelete(newsletterId);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json({ message: 'Newsletter deleted successfully', newsletter });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting newsletter', error: error.message });
  }
};
