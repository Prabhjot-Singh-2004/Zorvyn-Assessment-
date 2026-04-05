const Record = require('../models/Record');
const AppError = require('../utils/appError');

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Record created', record });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const records = await Record.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await Record.countDocuments(filter);

    res.json({
      records,
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

const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'name email');

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    res.json({ record });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });
    if (!record) {
      throw new AppError('Record not found', 404);
    }

    const { amount, type, category, date, notes } = req.body;

    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (notes !== undefined) record.notes = notes;

    await record.save();

    res.json({ message: 'Record updated', record });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });
    if (!record) {
      throw new AppError('Record not found', 404);
    }

    record.isDeleted = true;
    await record.save();

    res.json({ message: 'Record deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
