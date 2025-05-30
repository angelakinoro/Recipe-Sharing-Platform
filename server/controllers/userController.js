const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password
    });
    
    // Don't send password back in response (omits password and sends back a _)
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

module.exports = {
  registerUser
};