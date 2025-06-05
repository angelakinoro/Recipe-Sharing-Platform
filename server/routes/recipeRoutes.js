const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes
} = require('../controllers/recipeController');
const { authenticateToken } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const { uploadRecipeImage } = require('../controllers/recipeController');


const router = express.Router();

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Protected routes
router.post('/', authenticateToken, createRecipe);
router.put('/:id', authenticateToken, updateRecipe);
router.delete('/:id', authenticateToken, deleteRecipe);
router.post('/upload-image', authenticateToken, upload.single('image'), uploadToCloudinary, uploadRecipeImage);
router.get('/search', searchRecipes);


module.exports = router;