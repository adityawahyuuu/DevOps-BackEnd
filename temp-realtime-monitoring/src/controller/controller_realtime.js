const {validationResult} = require('express-validator');
const tsRedisDaos = require('../daos/daos_redis_ts');
const redis = require('../daos/daos_redis_client');
const keyGenerator = require('../daos/daos_redis_key_generator');

const recentKeys = [];
const adUnitasTS = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        };
        recentKeys.splice(deleteCount=0);
        for (const body of req.body){
            recentKeys.push(keyGenerator.getTSKey(body.id, Object.keys(body)[2]));
            recentKeys.push(keyGenerator.getTSKey(body.id, Object.keys(body)[3]));
        };
        await tsRedisDaos.insert(req.body);
        res.status(201).send(req.body);
    } catch (err) {
        res.json(err);
    }
};

const getTSKey = async (req, res) => {
    try{
        const collection = [];
        const client = redis.getClient();
        client.keys('*', async (err, keys) => {
            for (const key of keys){
                for (const recentKey of recentKeys){
                    if (key === recentKey) {
                        // Limit Max 60
                        const data = await tsRedisDaos.getTsData(key, 60);
                        collection.push(data);
                    };
                };
            };
            res.send(collection);
        });
    } catch(e){
        res.send(e);
    }
}

module.exports = {
    adUnitasTS,
    getTSKey
}