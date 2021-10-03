'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Associations Setting
const { user, post, category, Comment, Like } = sequelize.models;

// one to many
user.hasMany(post, { foreignKey: 'user_id' });
post.belongsTo(user, { foreignKey: 'user_id' });

category.hasMany(post, { foreignKey: 'category_id' });
post.belongsTo(category, { foreignKey: 'category_id' });


// one to many
//User.hasMany(Comment, { foreignKey: 'user_id' });
//Comment.belongsTo(User, { foreignKey: 'user_id' });
//
//// one to many
//Post.hasMany(Comment, { foreignKey: 'post_id' });
//Comment.belongsTo(Post, { foreignKey: 'post_id' });
//
//// one to many
//User.hasMany(Like, { foreignKey: 'user_id' });
//Like.belongsTo(User, { foreignKey: 'user_id' });

// one to many
//Post.hasMany(Like, { foreignKey: 'post_id' });
//Like.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = db;
