var R           = require('ramda');

var progulp     = require('../src/pro-gulp.js');
var progulpTask = require('../task/src/pro-gulp.js');

var tasksUtil   = require('./utils/tasks.js');
var suitesUtil       = require('./utils/suites.js');

// Silence gulp-util log
var gutil = require('gulp-util');
gutil.log = gutil.noop;

// Add creates tasks to implementations
function addTasks(tasks, implementations) {
    var names = [];
    tasks.forEach(function (v, index) {
        var name = 'task_' + index;
        implementations.forEach(
            function (impl) {
                impl.task(name, v);
            }
        );
        names.push(name);
    });
    return names;
};

// Create tasks for a mixed scenario,
// with 3 long async tasks, 7 sync tasks
// and 5 light async tasks
var mixedTasks = R.range(0, 3).map(
    R.always(tasksUtil.createHeavyTask)
).concat(
    R.range(0, 7).map(R.always(tasksUtil.createSyncTask))
).concat(
    R.range(0, 5).map(R.always(tasksUtil.createLightTask))
);

// Add the tasks created for the mixed scenario to
// progulp and progulpTask implementations
var tasksNames = addTasks(mixedTasks, [progulp, progulpTask]);

// Create a benchmark suite in which every implementations
// executes all the tasks of the mixed scenario in a
// sequential way
var suiteSerial = suitesUtil.createSuite('Serial', [
    {
        name: 'Task',
        fn: function (onErr, onOk) {
            progulpTask.sequence(tasksNames)(onErr, onOk);
        }
    },
    {
        name: 'Promise',
        fn: function (onErr, onOk) {
            progulp.sequence(tasksNames)().then(
                onOk
            ).catch(
                onErr
            );
        }
    }
]);

// Create a benchmark suite in which every implementations
// executes all the tasks of the mixed scenario in parallel
var suiteParallel = suitesUtil.createSuite('Parallel', [
    {
        name: 'Task',
        fn: function (onErr, onOk) {
            progulpTask.parallel(tasksNames)(onErr, onOk);
        }
    },
    {
        name: 'Promise',
        fn: function (onErr, onOk) {
            progulp.parallel(tasksNames)().then(
                onOk
            ).catch(
                onErr
            );
        }
    }
]);

// Run benchmark suites
suitesUtil.runSuites([suiteSerial, suiteParallel]);
