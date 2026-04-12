// backend/controllers/BlogController.js
const Blog    = require('../models/Blog');
const Comment = require('../models/Comment');

// ── GET /api/blogs/readall ──
// Public: anyone can read all blogs
exports.readAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortField = 'createdAt',
      sortOrder = 'desc',
      search = '',
      tag = '',
    } = req.query;

    const filter = {};

    // Search by title or content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { authorHandle: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by tag
    if (tag) {
      filter.tags = tag;
    }

    const allowedSortFields = ['createdAt', 'title', 'updatedAt'];
    const field = allowedSortFields.includes(sortField) ? sortField : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ [field]: order })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Blog.countDocuments(filter),
    ]);

    // Add like/dislike/comment counts
    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blogId: blog._id });
        return {
          ...blog,
          likeCount:    blog.likes?.length    || 0,
          dislikeCount: blog.dislikes?.length  || 0,
          commentCount,
          // Send content preview (first 200 chars)
          contentPreview: blog.content.substring(0, 200) + (blog.content.length > 200 ? '...' : ''),
        };
      })
    );

    res.json({
      blogs: blogsWithCounts,
      total,
      page:  parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });

  } catch (err) {
    console.error('Blog readAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/blogs/read/:id ──
// Public: anyone can read a single blog
exports.read = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const commentCount = await Comment.countDocuments({ blogId: blog._id });

    res.json({
      ...blog,
      likeCount:    blog.likes?.length    || 0,
      dislikeCount: blog.dislikes?.length  || 0,
      commentCount,
    });

  } catch (err) {
    console.error('Blog read error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/blogs/byuser/:userhandle ──
// Public: anyone can view a user's blogs
exports.byUser = async (req, res) => {
  try {
    const { userhandle } = req.params;

    const blogs = await Blog.find({ authorHandle: userhandle })
      .sort({ createdAt: -1 })
      .lean();

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blogId: blog._id });
        return {
          ...blog,
          likeCount:    blog.likes?.length    || 0,
          dislikeCount: blog.dislikes?.length  || 0,
          commentCount,
          contentPreview: blog.content.substring(0, 200) + (blog.content.length > 200 ? '...' : ''),
        };
      })
    );

    res.json(blogsWithCounts);

  } catch (err) {
    console.error('Blog byUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/blogs/create ──
// Auth: user or admin
exports.create = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const authorHandle = req.signedCookies?.token?.userhandle;

    if (!authorHandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title too long (max 200 characters)' });
    }

    // Process tags: trim, lowercase, remove empty
    const processedTags = tags
      ? tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
      : [];

    const blog = await Blog.create({
      title:        title.trim(),
      content,
      authorHandle,
      tags:         processedTags,
    });

    res.status(201).json({ success: true, blog });

  } catch (err) {
    console.error('Blog create error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/blogs/update/:id ──
// Auth: owner or admin
exports.update = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userhandle = req.signedCookies?.token?.userhandle;
    const userRole   = req.user?.role;

    if (!userhandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Only owner or admin can edit
    if (blog.authorHandle !== userhandle && userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this blog' });
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Process tags
    const processedTags = tags
      ? (Array.isArray(tags) ? tags : tags.split(','))
          .map(t => t.trim().toLowerCase())
          .filter(t => t.length > 0)
      : blog.tags;

    blog.title     = title.trim();
    blog.content   = content;
    blog.tags      = processedTags;
    blog.updatedAt = new Date();
    await blog.save();

    res.json({ success: true, blog });

  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/blogs/delete/:id ──
// Auth: owner or admin
exports.delete = async (req, res) => {
  try {
    const userhandle = req.signedCookies?.token?.userhandle;
    const userRole   = req.user?.role;

    if (!userhandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Only owner or admin can delete
    if (blog.authorHandle !== userhandle && userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    // Delete all comments on this blog too
    await Comment.deleteMany({ blogId: blog._id });

    // Delete the blog
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Blog and its comments deleted' });

  } catch (err) {
    console.error('Blog delete error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/blogs/like/:id ──
// Auth: user or admin — toggle like
exports.like = async (req, res) => {
  try {
    const userhandle = req.signedCookies?.token?.userhandle;

    if (!userhandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const alreadyLiked    = blog.likes.includes(userhandle);
    const alreadyDisliked = blog.dislikes.includes(userhandle);

    if (alreadyLiked) {
      // Remove like (unlike)
      blog.likes = blog.likes.filter(h => h !== userhandle);
    } else {
      // Add like
      blog.likes.push(userhandle);

      // Remove dislike if exists (can't like and dislike at same time)
      if (alreadyDisliked) {
        blog.dislikes = blog.dislikes.filter(h => h !== userhandle);
      }
    }

    await blog.save();

    res.json({
      success:      true,
      likeCount:    blog.likes.length,
      dislikeCount: blog.dislikes.length,
      liked:        !alreadyLiked,
      disliked:     false,
    });

  } catch (err) {
    console.error('Blog like error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/blogs/dislike/:id ──
// Auth: user or admin — toggle dislike
exports.dislike = async (req, res) => {
  try {
    const userhandle = req.signedCookies?.token?.userhandle;

    if (!userhandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const alreadyDisliked = blog.dislikes.includes(userhandle);
    const alreadyLiked    = blog.likes.includes(userhandle);

    if (alreadyDisliked) {
      // Remove dislike
      blog.dislikes = blog.dislikes.filter(h => h !== userhandle);
    } else {
      // Add dislike
      blog.dislikes.push(userhandle);

      // Remove like if exists
      if (alreadyLiked) {
        blog.likes = blog.likes.filter(h => h !== userhandle);
      }
    }

    await blog.save();

    res.json({
      success:      true,
      likeCount:    blog.likes.length,
      dislikeCount: blog.dislikes.length,
      liked:        false,
      disliked:     !alreadyDisliked,
    });

  } catch (err) {
    console.error('Blog dislike error:', err);
    res.status(500).json({ error: err.message });
  }
};