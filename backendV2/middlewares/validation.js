const { body, param } = require('express-validator');
const validator = require('validator');

exports.validateTaskInput = [
  body('task').notEmpty().withMessage('Task content is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('reminder').optional().isISO8601().withMessage('Invalid date format'),
  body('remark').optional().isLength({ max: 500 })
];

exports.validateTopicInput = [
  body('topicValue')
    .notEmpty().withMessage('Topic name is required')
    .isLength({ min: 3, max: 100 })
    .trim()
    .escape()
];

exports.validateIdParam = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isString().withMessage('ID must be a string')
];