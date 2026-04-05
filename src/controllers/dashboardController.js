const Record = require('../models/Record');

const getDashboardSummary = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const incomeResult = await Record.aggregate([
      { $match: { ...filter, type: 'INCOME' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseResult = await Record.aggregate([
      { $match: { ...filter, type: 'EXPENSE' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpenses = expenseResult.length > 0 ? expenseResult[0].total : 0;
    const netBalance = totalIncome - totalExpenses;

    const categoryBreakdown = await Record.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, type: { $first: '$type' } } },
      { $sort: { total: -1 } }
    ]);

    const recentActivity = await Record.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .limit(10)
      .select('amount type category date notes');

    const monthlyTrend = await Record.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
          },
          expenses: {
            $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance
      },
      categoryBreakdown,
      recentActivity,
      monthlyTrend
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardSummary };
