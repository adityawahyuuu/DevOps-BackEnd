const {validationResult} = require('express-validator');
const tsRedisDaos = require('../daos/daos_redis_ts.js');
const redis = require('../daos/daos_redis_client.js');
const keyGenerator = require('../daos/daos_redis_key_generator.js');
const helper = require('../helpers/arrayToObject');

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
        const tempCollection = [];
        const humidityCollection = [];
        const client = redis.getClient();
        client.keys('*', async (err, keys) => {
            for (const key of keys){
                for (const recentKey of recentKeys){
                    if (key === recentKey) {
                        await tsRedisDaos.getTsData(key);
                        const data = await tsRedisDaos.getTsData(key);
                        collection.push(data);

                        if (key === "IoT:ts:3:temperature") tempCollection.push(collection[0]);
                        else if (key === "IoT:ts:3:humidity") humidityCollection.push(collection[1]);
                    };
                };
            };
            const tempObj = helper.arrayToObject(tempCollection, "temperature");
            const humidityObj = helper.arrayToObject(humidityCollection, "humidity");
            // console.log(tempObj);
            // console.log(humidityObj);
            // console.log(collection[0].length);
            res.render('../views/graph', {tempObj, humidityObj});
        });
    } catch(e){
        console.log(e);
    }
};


module.exports = {
    adUnitasTS,
    getTSKey,
}