const models = require('../models');
const { Op } = require('sequelize');

module.exports = {
  get: async (req, res) => {
    try {
      let { category, paged, postNumber, order, sort, search } = req.query;

      // Sorting
      if (order !== 'views' && order !== 'likes' && order !== 'comments') order = null;
      if (sort !== 'DESC' && sort !== 'ASC' && sort !== 'desc' && sort !== 'asc') sort = null;

      // Pagenation
      isNaN(paged) || Number(paged) < 1 ? paged = 1 : paged = Number(paged);
      isNaN(postNumber) ? postNumber = 9 : postNumber < 1 ? postNumber = 1 : postNumber = Number(postNumber);

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
        attributes: ['post_id', 'post_title', 'post_image', 'post_comments', 'post_likes', 'post_views'],
        include: [
          {
            // categories table Join
            model: models.category,
            attributes: ['category_name'],
            where: category ? { category_name: category  } : {}
          },
          {
            // users table Join
            model: models.user,
            attributes: ['user_nickname', 'user_image']
          }
        ],
        order: [
          order ? sort ? ['post_' + order, sort] : ['post_' + order, 'DESC'] : sort ? ['post_views', sort] : ['post_views', 'DESC']
        ],
        offset: (paged-1)*postNumber, 
        limit: postNumber,
        raw: true
      });

      // Response Posts
      res.status(200).json({ data: { posts } , message: 'ok' });
    } catch (err) {
      console.error(err);
    }
  }
};
