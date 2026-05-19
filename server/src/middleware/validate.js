const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = (error.issues || []).map((issue) => ({
        field: issue.path.slice(1).join('.'),
        message: issue.message,
      }));
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: formattedErrors,
      });
    }
    next(error);
  }
};

module.exports = validate;
