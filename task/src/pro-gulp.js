var Task   = require("data.task");
var Async  = require('control.async')(Task);
var monads = require('control.monads');
var R      = require('ramda');

var log     = require("./lib/log.js");
var taskify = require("./lib/taskify.js");

var tasks = {};

function noop() {};

// propagateInfo :: Task a Error -> b -> Task b Error
function propagateInfo(task) {
    return R.compose(
        R.flip(R.map)(task),
        R.always
    );
};

// Return a function that when called executes the task
function executionFunction(task) {
    return function (rej, res) {
        task.fork(rej || noop, res || noop);
    }
};

exports.task = function task (name, dependency, fn) {
    if (arguments.length !== 1) {
        tasks[name] = R.pipe(
            Task.of,
            R.chain(log.startTask),
            R.chain(
                propagateInfo(taskify(dependency))
            ),
            R.when(
                R.always(
                    R.not(R.isNil(fn))
                ),
                R.chain(
                    propagateInfo(taskify(fn))
                )
            ),
            R.chain(log.endTask)
        )({name: name});
    }
    return executionFunction(tasks[name]);
};

exports.parallel = function parallel (taskList) {
    return executionFunction(
        Async.parallel(
            taskList.map(
                function (name) {
                    return tasks[name];
                }
            )
        )
    );
};

exports.sequence = function sequence (taskList) {
    return executionFunction(
        monads.sequence(
            Task,
            taskList.map(
                function (name) {
                    return tasks[name];
                }
            )
        )
    );
};
