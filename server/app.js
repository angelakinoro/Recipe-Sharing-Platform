const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection, sequelize } = require('./config/database');
const { User, Recipe } = require('./models');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Test database connection
testConnection();

// Creates table on database
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
};

syncDatabase();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);


// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Recipe Sharing Platform API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});