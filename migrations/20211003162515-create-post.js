'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      post_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER(11),
        references:{ model: 'users', key: 'user_id' }
      },
      post_title: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      post_image: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      post_content: {
        type: Sequelize.TEXT('long')
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER(11),
        references:{ model: 'categories', key: 'category_id' }
      },
      post_comments: {
        type: Sequelize.INTEGER(11)
      },
      post_likes: {
        type: Sequelize.INTEGER(11)
      },
      post_views: {
        type: Sequelize.INTEGER(11)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};