const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const clearCache = require('../middlewares/clearCache');

const Blog = mongoose.model('Blog');
// console.log('THREEEE', mongoose.Query.prototype.exec);

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    console.log('REQUEST ME BLOGS');
    const blogs = await Blog.find({ _user: req.user.id })
      .cache({ key: req.user.id });
    // console.log('WAIIIIT LIST', blogs);
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, clearCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
