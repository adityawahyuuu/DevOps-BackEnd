const router = require('express').Router();
const {body} = require('express-validator');
const controller = require('../controller/controller_realtime');

router.post(
    '/realtime',
    [
        body().isArray(),
        body('*.id').isInt(),
        body('*.dateTime').isInt({ min: 0 }),
        body('*.humidity').isFloat({max: 100}),
        body('*.tempC').isFloat(),
    ],
    controller.adUnitasTS
);

module.exports = router;