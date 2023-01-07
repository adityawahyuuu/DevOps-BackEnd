const redis = require('./daos_redis_client.js');
const keyGenerator = require('./daos_redis_key_generator.js');

const maxUnitRetentionDays = 30;
const daySeconds = 24 * 60 * 60;
const timeSeriesUnitRetention = maxUnitRetentionDays * daySeconds * 1000;

/**
 * Fungsi untuk insert data dalam format ts
 * dengan redis
 *
 * @param {number} id - nomor unik, penanda data.
 * @param {number} unitValue - nilai data.
 * @param {number} unitName - jenis data.
 * @param {number} timestamp - waktu dalam format unix.
 * @returns {Promise} - Promise that resolves when the operation is completed..
 */
const insertUnit = async (id, unitValue, unitName, timestamp) => {
    const client = redis.getClient();

    await client.ts_addAsync(
        keyGenerator.getTSKey(id, unitName),
        timestamp * 1000,
        unitValue,
        'RETENTION',
        timeSeriesUnitRetention
    );
};

const insert = async (unitReading) => {
    for (const unit of unitReading){
        await Promise.all([
            insertUnit(unit.id, unit.humidity, "humidity", unit.dateTime),
            insertUnit(unit.id, unit.temperature, "temperature", unit.dateTime),
        ]);
    }
};


/**
 * Fungsi untuk get data dari format ts
 * dalam redis
 *
 */
const getTsData = async (key, limit) => {
    // const value = [];
    const client = redis.getClient();
    // Tentukan limitnya
    const latestData = await client.ts_getAsync(key);
    const toMillis = latestData[0];
    const fromMillis = toMillis - 2310000;
    let data = await client.ts_rangeAsync(key, fromMillis, toMillis);
    // for (let i=0; i<=data.length; i++){
    //     if (data[i] != undefined){
    //         for (let j=0; j<=data[i].length; j++){
    //             value.push(parseInt(data[i][1]));
    //         }
    //     }
    // }
    // console.log(data.length);
    // console.log(value.length);
    // const removedValue = value.splice(data.length, value.length-(data.length*2));
    // console.log(removedValue.length);
    // return removedValue;
    return data;
}

module.exports = {
    insert,
    getTsData
};