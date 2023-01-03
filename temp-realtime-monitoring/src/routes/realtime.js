const router = require('express').Router();
const {body} = require('express-validator');
const apiErrorReporter = require('../utils/apierrorreporter');

router.post(
    '/realtime',
    [
        body().isArray(),
        body('*.siteId').isInt(),
        body('*.dateTime').isInt({ min: 0 }),
        body('*.tempC').isFloat(),
        apiErrorReporter
    ], 
    async (req, res, next) => {
        try {
            return res.status(201).send(req.body);
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;