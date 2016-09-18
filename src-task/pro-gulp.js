// Rivedere nomi file, processo di build, creazione test + benchmarks
// Impostare meglio il codice, con ramda o pointfree-fantasy
var Task      = require("data.task");
var monads    = require('control.monads');
var Async     = require('control.async')(Task);

var log       = require("./lib/log.js");
var taskify = require("./lib/promisify.js");

var tasks = {};

function noop() {};

// propagateExecutionInfo :: Task () Error -> Task ExecutionInfo Error
function propagateExecutionInfo(task) {
    return function (executionInfo) {
        task.map(executionInfo);
    }
};

function executionFunction(task) {
    return function () {
        task.fork(noop, noop);
    }
};

// Per me tasks[name] può essere un task, e questa funzione può ritornare la funzione
// che wrappa e che chiama fork
exports.task = function task (name, dependency, fn) {
    if (arguments.length !== 1) {
        var executionInfo = {name: name};
        task[name] = Task.of(executionInfo)
                .chain(log.startTask)
                .chain(propagateExecutionInfo(taskify(dependency)))
                .chain(propagateExecutionInfo(taskify(fn || noop)))
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
