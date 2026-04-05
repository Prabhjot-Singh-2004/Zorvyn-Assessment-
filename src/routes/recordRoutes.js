const express = require('express');
const router = express.Router();
const { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require('../controllers/recordController');
const { validate, recordSchema, updateRecordSchema, paginationSchema } = require('../middlewares/validation');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', requireRole(['Admin', 'Analyst']), validate(paginationSchema), getRecords);
router.get('/:id', requireRole(['Admin', 'Analyst']), getRecordById);
router.post('/', requireRole(['Admin']), validate(recordSchema), createRecord);
router.put('/:id', requireRole(['Admin']), validate(updateRecordSchema), updateRecord);
router.delete('/:id', requireRole(['Admin']), deleteRecord);

module.exports = router;
