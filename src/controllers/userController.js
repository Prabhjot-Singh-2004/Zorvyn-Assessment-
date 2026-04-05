const User = require('../models/User');
const AppError = require('../utils/appError');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { role, status } = req.body;

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.json({ message: 'User updated', user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { name, password } = req.body;

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();

    res.json({
      message: 'Profile updated',
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

const toggleStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.json({ message: `User status updated to ${user.status}`, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers, updateUser, updateProfile, toggleStatus };
