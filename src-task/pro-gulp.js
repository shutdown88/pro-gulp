// Rivedere nomi file, processo di build, creazione test + benchmarks
// Impostare meglio il codice, con ramda o pointfree-fantasy
var Task   = require("data.task");
var monads = require('control.monads');
var Async  = require('control.async')(Task);

var log     = require("./lib/log.js");
var taskify = require("./lib/taskify.js");

var tasks = {};

function noop() {};

// propagateExecutionInfo :: Task () Error -> Task ExecutionInfo Error
function propagateExecutionInfo(task) {
    return function (executionInfo) {
        task.map(executionInfo);
    }
};

// Return a function that when called executes the task
// executionFunction Task a n -> (() -> ())
function executionFunction(task) {
    return function () {
        // task.fork(noop, noop);
        console.log('About to fork task');
        task.fork(logresult('Error: '), logresult('Result: '));
    }
};

function logresult(prefix) {
    return function(a) {
        console.log(prefix, a);
    }
}

exports.task = function task (name, dependency, fn) {
    if (arguments.length !== 1) {
        var executionInfo = {name: name};
        tasks[name] = Task.of(executionInfo)
                .chain(log.startTask)
                .chain(
                    // executionInfo -> Task execinfo
                    propagateExecutionInfo(
                            // Task a Error
                            taskify(dependency)
                        )
                )
                /*.chain(propagateExecutionInfo(taskify(fn || noop)))*/
                .chain(log.endTask);
    }
    return executionFunction(tasks[name]);
};

exports.parallel = function parallel (taskList) {
    executionFunction(
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
    executionFunction(
        monads.sequence(
           taskList.map(
                function (name) {
                    return tasks[name];
                }
            )
        )
    );
};
