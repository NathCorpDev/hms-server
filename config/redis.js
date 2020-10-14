const config = require('config');
const redis = require('redis');

const client = redis.createClient(config.get('RedisConfig.PORT'), config.get('RedisConfig.HOST'), {
    auth_pass: config.get('RedisConfig.KEY'),
    tls: {
        servername: config.get('RedisConfig.HOST')
    }
});

client.on('error', (err) => {
    console.log("Error " + err);
});

exports.client = client;