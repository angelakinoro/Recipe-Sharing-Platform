const { Recipe, User } = require('../models');

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, servings, difficulty, cuisine } = req.body;
    
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      cuisine,
      userId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create recipe',
      error: error.message
    });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      recipes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

// Get single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    res.json({
      success: true,
      recipe
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe',
      error: error.message
    });
  }
};

// Update recipe (only by owner)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Check if user owns the recipe
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }
    
    const updatedRecipe = await recipe.update(req.body);
    
    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update recipe',
      error: error.message
    });
  }
};

// Delete recipe (only by owner)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Check if user owns the recipe
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }
    
    await recipe.destroy();
    
    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message
    });
  }
};

// Upload recipe image
const uploadRecipeImage = async (req, res) => {
  try {
    if (!req.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: req.imageUrl
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};

// Search recipes
const searchRecipes = async (req, res) => {
  try {
    const { q, cuisine, difficulty, maxTime } = req.query;
    
    let whereClause = {};
    
    // Text search in title and description
    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }
    
    // Filter by cuisine
    if (cuisine) {
      whereClause.cuisine = { [Op.iLike]: `%${cuisine}%` };
    }
    
    // Filter by difficulty
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    
    // Filter by cooking time
    if (maxTime) {
      whereClause.cookingTime = { [Op.lte]: parseInt(maxTime) };
    }
    
    const recipes = await Recipe.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: recipes.length,
      recipes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
  searchRecipes
};