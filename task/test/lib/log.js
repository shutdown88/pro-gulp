var Task   = require("data.task");
var util   = require("gulp-util");
var should = require("should-promised");
var sinon  = require("sinon");

var log = require("lib/log.js");

describe("The `log.startTask` function", function () {

    beforeEach(function () {
        sinon.stub(util, "log");
    });

    afterEach(function () {
        util.log.restore();
    });

    it("should return a Task", function () {
        var ret = log.startTask({});
        ret.should.be.instanceOf(Task);
    });

    it("should return a Task that attach a Date object to the property `start` of its input", function () {
        var ctx = {};
        var ret = log.startTask(ctx);
        ret.fork(function () {
            // Fail
            (true).should.be.false();
        }, function (newCtx) {
            newCtx.start.should.be.instanceOf(Date);
        });
    });

    it("should call the `gulp-util.log` function", function () {
        log.startTask({}).fork(function () {}, function () {});
        util.log.calledWithMatch(/Starting/).should.equal(true);
    });

});

describe("The `log.endTask` function", function () {

    beforeEach(function () {
        sinon.stub(util, "log");
    });

    afterEach(function () {
        util.log.restore();
    });

    it("should attach a Date object to the property `end` of its context", function () {
        var ctx = {
            start: new Date()
        };
        var ret = log.endTask(ctx).fork(function () {
            // Fail
            (true).should.be.false();
        }, function (newCtx) {
            newCtx.end.should.be.instanceOf(Date);
        });
    });

    it("should call the `gulp-util.log` function", function () {
        log.endTask({}).fork(function () {}, function () {});
        util.log.calledWithMatch(/Finished/).should.equal(true);
    });


});
