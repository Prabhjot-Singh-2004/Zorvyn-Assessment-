const User = require('../models/User');
const { generateToken } = require('../utils/token');
const AppError = require('../utils/appError');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status !== 'Active') {
      throw new AppError('Account is inactive', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Viewer',
      status: 'Active'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup };
