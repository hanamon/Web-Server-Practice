const models = require('../models');
const { Op } = require('sequelize');

module.exports = {
  findAll: async (req, res) => {
    try {
      let { category, paged, postNumber, order, sort, search } = req.query;

      // 정렬 : 기본 값은 post_id 기준 DESC이다.
      if (order !== 'views' && order !== 'likes' && order !== 'comments') order = null;
      if (sort !== 'DESC' && sort !== 'ASC' && sort !== 'desc' && sort !== 'asc') sort = null;

      // 페이지네이션 : 기본 값은 9이다.
      isNaN(paged) || Number(paged) < 1 ? paged = 1 : paged = Number(paged);
      isNaN(postNumber) ? postNumber = 9 : postNumber < 1 ? postNumber = 1 : postNumber = Number(postNumber);

      // 모든 게시물 조회한다.
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
            model: models.category, // categories 테이블 조인
            attributes: ['category_name'],
            where: category ? { category_name: category  } : {}
          },
          {
            model: models.user, // users 테이블 조인
            attributes: ['user_login', 'user_nickname', 'user_image']
          }
        ],
        order: [
          order ? sort ? ['post_' + order, sort] : ['post_' + order, 'ASC'] : sort ? ['post_id', sort] : ['post_id', 'DESC']
        ],
        offset: (paged-1)*postNumber, 
        limit: postNumber
      });

      // 모든 게시물 반환한다.
      return res.status(200).json({ data: { posts } , message: 'ok' });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ data: null, message: 'Server error! '});
    }
  },
  findById: async (req, res) => {
    try {
      let postId = req.params.postId;

      // 매개 변수가 숫자가 아니면 다음을 리턴한다.
      if (isNaN(postId)) return res.status(400).json({ data: null, message: 'Bad Request!' });
      else postId = Number(postId);

      // 단일 게시물을 조회한다.
      const post = await models.post.findOne({
        where: { post_id: postId },
        attributes: ['post_id', 'post_title', 'post_content', 'post_image', 'post_comments', 'post_likes', 'post_views', 'created_at', 'updated_at'],
        include: [
          {
            model: models.category, // categories 테이블 조인
            attributes: ['category_name']
          },
          {
            model: models.user, // users 테이블 조인
            attributes: ['user_login', 'user_nickname', 'user_image']
          }
        ]
      });

      // 존재하지 않는 경우 다음을 리턴한다.
      if ( !post ) return res.status(404).json({ data: null, message: 'Not Found!' });

      // 게시물의 조회수를 + 1 한다.
      const updateId = await models.post.update({ post_views: post.dataValues.post_views+1 }, { where: { post_id: postId } });
      
      post.dataValues.post_views = post.dataValues.post_views+1;

      // 단일 게시물을 리턴한다.
      return res.json({ data: updateId, post, message: 'ok' });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ data: null, message: 'Server error! '});
    }
  }
};
