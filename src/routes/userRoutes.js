const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, updateProfile, toggleStatus } = require('../controllers/userController');
const { validate, createUserSchema, updateUserSchema, updateProfileSchema } = require('../middlewares/validation');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.use(requireAuth);

router.put('/profile', validate(updateProfileSchema), updateProfile);

router.use(requireRole(['Admin']));

router.post('/', validate(createUserSchema), createUser);
router.get('/', getUsers);
router.put('/:id', validate(updateUserSchema), updateUser);
router.patch('/:id/status', toggleStatus);

module.exports = router;
