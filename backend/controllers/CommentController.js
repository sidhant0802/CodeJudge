// backend/controllers/CommentController.js
const Comment = require('../models/Comment');
const Blog    = require('../models/Blog');

// ── GET /api/comments/byblog/:blogId ──
exports.byBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);

  } catch (err) {
    console.error('Comment byBlog error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/comments/create ──
exports.create = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const authorHandle = req.signedCookies?.token?.userhandle;

    if (!authorHandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    if (!blogId || !content) {
      return res.status(400).json({ error: 'Blog ID and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Comment too long (max 2000 characters)' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comment = await Comment.create({
      blogId,
      authorHandle,
      content: content.trim(),
    });

    res.status(201).json({ success: true, comment });

  } catch (err) {
    console.error('Comment create error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/comments/delete/:id ──
exports.delete = async (req, res) => {
  try {
    const userhandle = req.signedCookies?.token?.userhandle;
    const userRole   = req.user?.role;

    if (!userhandle) {
      return res.status(401).json({ error: 'Login required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorHandle !== userhandle && userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Comment deleted' });

  } catch (err) {
    console.error('Comment delete error:', err);
    res.status(500).json({ error: err.message });
  }
};