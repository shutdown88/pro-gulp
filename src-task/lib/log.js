var R = require('ramda');
var util = require("gulp-util");

function execTimeString(delta) {
    return (delta / 1000).toString();
};

// startTask :: ExecInfo -> Task ExecInfo
exports.startTask = function startTask (execInfo) {
    return new Task(function (rej, res) {
        var start = new Date();
        util.log([
            "Starting '",
            util.colors.cyan(execInfo.name),
            "'..."
        ].join(""));
        res(R.assoc('start', start, execInfo));
    });
};

// endTask :: ExecInfo -> Task ExecInfo
exports.endTask = function endTask (execInfo) {
    return new Task(function (rej, res) {
        var end = new Date();
        util.log([
            "Finished '",
            util.colors.cyan(execInfo.name),
            "' after ",
            util.colors.magenta(execTimeString(execInfo.end - execInfo.start)),
            "s"
        ].join(""));
        res(R.assoc('end', end, execInfo));
    });
};
