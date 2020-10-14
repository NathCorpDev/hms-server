const {
    client
} = require('../config/redis');

module.exports = {
    getPrescriptionFromCache: function (req, res, next) {
        let CacheTime = Date.now()
        client.get(req.params.patientId, (err, data) => {
            if (err) throw err;

            if (data) {
                console.log('sending data from cache ...');
                console.log('Cache request took', Date.now() - CacheTime, 'Milliseconds');
                res.send(JSON.parse(data));
            } else {
                next();
            }
        });
    }
}