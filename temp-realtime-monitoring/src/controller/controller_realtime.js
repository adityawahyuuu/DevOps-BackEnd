const {validationResult} = require('express-validator');
const tsRedisDaos = require('../daos/daos_redis_ts');

const adUnitasTS = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Handle duplicate value (error)
        await tsRedisDaos.insert(req.body);
        return res.status(201).send("OK");
    } catch (err) {
        return res.json(err);
    }
}

module.exports = {
    adUnitasTS
}