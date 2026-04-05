const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Viewer', 'Analyst', 'Admin']).optional().default('Viewer'),
    status: z.enum(['Active', 'Inactive']).optional().default('Active')
  })
});

const updateUserSchema = z.object({
  body: z.object({
    role: z.enum(['Viewer', 'Analyst', 'Admin']).optional(),
    status: z.enum(['Active', 'Inactive']).optional()
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional()
  })
});

const recordSchema = z.object({
  body: z.object({
    amount: z.number().min(0, 'Amount cannot be negative'),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1, 'Category is required'),
    date: z.coerce.date(),
    notes: z.string().optional().default('')
  })
});

const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1, 'Category is required').optional(),
    date: z.coerce.date().optional(),
    notes: z.string().optional()
  })
});

const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  })
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
    }
  };
};

module.exports = {
  loginSchema,
  signupSchema,
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  recordSchema,
  updateRecordSchema,
  paginationSchema,
  validate
};
