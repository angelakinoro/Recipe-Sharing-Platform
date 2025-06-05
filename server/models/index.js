const User = require('./User');
const Recipe = require('./Recipe');

// Define associations
User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = {
  User,
  Recipe
};