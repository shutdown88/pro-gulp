var BPromise = require('bluebird');

exports.createSyncTask = function createSyncTask() {
    return function () {
        return 26;
    }
};

exports.createLightTask = function createLightTask() {
    return new BPromise(function (res, rej) {
        setImmediate(function () {
            res(44);
        })
    });
};

exports.createHeavyTask = function createHeavyTask() {
    return new BPromise(function (res, rej) {
        setTimeout(function () {
            res(18);
        }, 100)
    });
};
