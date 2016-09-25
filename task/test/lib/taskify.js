var BPromise = require("bluebird");
var Task     = require("data.task");
var events   = require("events");
var should   = require("should-promised");
var sinon    = require("sinon");

var taskify = require("lib/taskify.js");

describe("The `taskify` function", function () {

    it("should return a Task", function () {
        var ret = taskify(function () {});
        ret.should.be.instanceOf(Task);
    });

});

describe("The Task returned by `taskify`", function () {

    it("should invoke the function supplied to `taskify`, when forked", function () {
        var spy = sinon.spy();
        var tsk = taskify(spy);
        tsk.fork(function () {}, function () {});
        spy.called.should.equal(true);
    });

});

describe("When the supplied function returns a stream, the Task returned", function () {

    it("should be resolved when the stream finishes", function () {

        function noop() {};

        var stream = new events.EventEmitter();
        stream.pipe = noop;
        var tsk = taskify(function () {
            return stream;
        });
        var ret = false;
        tsk.fork(function () {
            ret = false;
        }, function () {
            ret = true;
        });
        stream.emit("finish");
        ret.should.be.equal(true);
    });

    it("should be resolved when the stream ends", function () {
        var stream = new events.EventEmitter();
        stream.pipe = function noop () {};
        var tsk = taskify(function () {
            return stream;
        });
        var ret = false;
        tsk.fork(function () {
            ret = false;
        }, function () {
            ret = true;
        });
        stream.emit("end");
        ret.should.be.equal(true);
    });

    it("should be rejected when the stream errors", function () {
        var stream = new events.EventEmitter();
        stream.pipe = function noop () {};
        var tsk = taskify(function () {
            return stream;
        });
        var ret = false;
        tsk.fork(function () {
            ret = false;
        }, function () {
            ret = true;
        });
        stream.emit("error");
        ret.should.be.equal(false);
    });

});

describe("When the supplied function returns a promise, the Task returned", function () {

    it("should be resolved when the promise is resolved", function () {
        var promise = BPromise.resolve();
        var tsk = taskify(function () {
            return promise;
        });
        var ret = false;
        tsk.fork(function (err) {
            ret = false;
            ret.should.be.equal(true);
        }, function () {
            ret = true;
            ret.should.be.equal(true);
        });
    });

    it("should be rejected when the promise is rejected", function () {
        var promise = BPromise.reject();
        var tsk = taskify(function () {
            return promise;
        });
        var ret = false;
        tsk.fork(function () {
            ret = false;
            ret.should.be.equal(false);
        }, function () {
            ret = true;
            ret.should.be.equal(false);
        });
    });
});

describe("When the supplied function returns a value, the Task returned", function () {

    it("should be a Task wrapper around that value", function () {
        var value = {};
        var tsk = taskify(function () {
            return value;
        });
        tsk.fork(function () {
            ret = false;
            ret.should.be.equal(value);
        }, function (v) {
            ret = v;
            ret.should.be.equal(value);
        });
    });

});


describe("When the supplied function throws, the Task returned", function () {

    it("should be a Task that is rejected with the thrown error", function () {
        var error = new Error();
        var tsk = taskify(function () {
            throw error;
        });
        tsk.fork(function (error) {
            ret = error;
            ret.should.be.equal(error);
        }, function () {
            ret = true;
            ret.should.be.equal(error);
        });
    });

});
