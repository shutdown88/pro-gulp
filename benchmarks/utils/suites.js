var Benchmark = require('benchmark');
var monads    = require('control.monads');
var Task      = require('data.task');
var R         = require('ramda');

/*
    implementation:
     {
        name: "Name",
        fn: function (onErr, onOk)
     }
*/

exports.createSuite = function createSuite(name, implementations) {
    var suite = new Benchmark.Suite(name);

    implementations.forEach(function (impl) {
        suite.add({
            name: impl.name,
            fn: function (def) {
                impl.fn(function () {
                    def.benchmark.abort();
                }, function () {
                    def.resolve();
                });
            },
            defer: true
        });
    });

    suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).on('complete', function () {
        console.log('\nFastest is ' + this.filter('fastest').map('name'));
        console.log('------------------------------------------------');
    });

    return suite;
}

function suiteTask(suite) {
    return new Task(function (rej, res) {
        console.log("\nBenchmark Suite: " + suite.name + "\n");
        suite.on('complete', function () {
            res();
        });
        suite.run({async: true});
    });
};

exports.runSuites = function (suites) {
    monads.sequence(
        Task,
        R.map(suiteTask, suites)
    ).fork(
    function (err) {
        console.log("\nBenchmark ended with error: ", err);
    },
    function () {
        console.log("\nBenchmark ended with success");
    });
};
