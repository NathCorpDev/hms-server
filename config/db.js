const chalk = require('chalk');
const config = require('config');

// setting console color.
var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

let DB_URL = "mongodb://localhost:27017/hms";

// if (config.has('DATABASE.DB_HOST')) {
//     DB_URL = "mongodb://" + config.get('DATABASE.DB_HOST') + ":" + config.get('DATABASE.DB_PORT') + "/" + config.get('DATABASE.DB_NAME');
// }

module.exports = function (mongoose) {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection;

    db.on('connected', () => {
        console.log(connected("Mongoose default connection is open to ", DB_URL));
    });

    db.on('error', (err) => {
        console.log(error("Mongoose connection error has occured " + err + " error"));
    });

    db.on('disconnected', () => {
        console.log(disconnected("Mongoose default connection is disconnected."));
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(function () {
            console.log(termination("Mongoose default connection is disconnected due to application termination."));
            process.exit(0)
        });
    });
}