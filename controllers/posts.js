const models = require('../models');
const { Op } = require('sequelize');

module.exports = {
  findAll: async (req, res) => {
    try {
      // Query Parameters
      let { category, paged, postNumber, order, sort, search } = req.query;

      // Sorting
      if (order !== 'views' && order !== 'likes' && order !== 'comments') order = null;
      if (sort !== 'DESC' && sort !== 'ASC' && sort !== 'desc' && sort !== 'asc') sort = null;

      // Pagenation
      isNaN(paged) || Number(paged) < 1 ? paged = 1 : paged = Number(paged);
      isNaN(postNumber) ? postNumber = 9 : postNumber < 1 ? postNumber = 1 : postNumber = Number(postNumber);

      // Find All Posts
      const posts = await models.post.findAndCountAll({
        where: {
          [Op.and]: [
            search ? { 
              [Op.or]: [
                { post_title: { [Op.like]: '%' + search + '%' } }, 
                { post_content: { [Op.like]: '%' + search + '%' } }
              ]
            } : null
          ]
        },
        attributes: ['post_id', 'post_title', 'post_image', 'post_comments', 'post_likes', 'post_views', 'created_at', 'updated_at'],
        include: [
          {
            model: models.category, // categories table Join
            attributes: ['category_name'],
            where: category ? { category_name: category  } : {}
          },
          {
            model: models.user, // users table Join
            attributes: ['user_login', 'user_nickname', 'user_image']
          }
        ],
        order: [
          order ? sort ? ['post_' + order, sort] : ['post_' + order, 'ASC'] : sort ? ['post_id', sort] : ['post_id', 'DESC']
        ],
        offset: (paged-1)*postNumber, 
        limit: postNumber
      });

      // Response Posts
      res.status(200).json({ data: { posts } , message: 'ok' });
    } catch (err) {
      console.error(err);
    }
  },
  findById: async (req, res) => {
    try {
      let postId = req.params.postId;

      // Parameter validation
      if (isNaN(postId)) return res.status(400).json({ data: null, message: 'Bad Request!' });
      else postId = Number(postId);

      // Find Post
      const post = await models.post.findOne({
        where: { post_id: postId },
        attributes: ['post_id', 'post_title', 'post_content', 'post_image', 'post_comments', 'post_likes', 'post_views', 'created_at', 'updated_at'],
        include: [
          {
            model: models.category, // categories table Join
            attributes: ['category_name']
          },
          {
            model: models.user, // users table Join
            attributes: ['user_login', 'user_nickname', 'user_image']
          }
        ]
      });

      // Not Found
      if ( !post ) return res.status(404).json({ data: null, message: 'Not Found!' });

      // Update Post Views
      const updateId = await models.post.update({ post_views: post.dataValues.post_views+1 }, { where: { post_id: postId } });
      
      post.dataValues.post_views = post.dataValues.post_views+1;

      // Single post response
      res.json({ data: updateId, post, message: 'ok' });
    } catch (err) {
      console.error(err);
    }
  }
};
