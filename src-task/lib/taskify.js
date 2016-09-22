var Task  = require("data.task");
var Async = require('control.async')(Task);

var isStream = function (thing) {
    return !!(
        thing &&
        thing.pipe &&
        typeof thing.pipe === "function"
    );
};

var isPromise = function (thing) {
    return !!(
        thing &&
        thing.then &&
        typeof thing.then === "function"
    );
};

var isTask = function (thing) {
    return thing instanceof Task;
}

// taskify :: (() -> a) -> Task a Error
module.exports = function taskify (fn) {
    return new Task(function (rej, res) {
        try {
            var ret = fn();
            if (isPromise(ret)) {
                ret.then(res, rej);
            } else if (isStream(ret)) {
                ret.on("end", res)
                   .on("finish", res)
                   .on("error", rej);
                return;
            } else {
                res(ret);
            }
        } catch (err) {
            rej(err);
        }
    });
};
