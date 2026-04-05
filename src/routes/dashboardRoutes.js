const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.use(requireAuth);
router.use(requireRole(['Admin', 'Analyst', 'Viewer']));

router.get('/summary', getDashboardSummary);

module.exports = router;
