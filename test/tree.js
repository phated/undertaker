'use strict';

var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;

var Undertaker = require('../');

var simple = require('./fixtures/taskTree/simple');
var singleLevel = require('./fixtures/taskTree/singleLevel');
var doubleLevel = require('./fixtures/taskTree/doubleLevel');
var tripleLevel = require('./fixtures/taskTree/tripleLevel');
var depth1OfTripleLevel = require('./fixtures/taskTree/depth1OfTripleLevel');
var depth2OfTripleLevel = require('./fixtures/taskTree/depth2OfTripleLevel');
var depth3OfTripleLevel = require('./fixtures/taskTree/depth3OfTripleLevel');
var depth4OfTripleLevel = require('./fixtures/taskTree/depth4OfTripleLevel');
var aliasSimple = require('./fixtures/taskTree/aliasSimple');
var aliasNested = require('./fixtures/taskTree/aliasNested');
var tripleLevelWithDescAndFlag = require('./fixtures/taskTree/tripleLevelWithDescAndFlag');

function noop(done) {
  done();
}

describe('tree', function() {

  var taker;

  beforeEach(function(done) {
    taker = new Undertaker();
    done();
  });

  it('should return a simple tree by default', function(done) {
    taker.task('test1', function(cb) {
      cb();
    });
    taker.task('test2', function(cb) {
      cb();
    });
    taker.task('test3', function(cb) {
      cb();
    });
    taker.task('error', function(cb) {
      cb();
    });

    var ser = taker.series('test1', 'test2');
    var anon = function(cb) {
      cb();
    };
    anon.displayName = '<display name>';

    taker.task('ser', taker.series('test1', 'test2'));
    taker.task('par', taker.parallel('test1', 'test2', 'test3'));
    taker.task('serpar', taker.series('ser', 'par'));
    taker.task('serpar2', taker.series(ser, anon));
    taker.task(anon);

    var tree = taker.tree();

    expect(tree).to.deep.equal(simple);
    done();
  });

  it('should form a 1 level tree', function(done) {
    taker.task('fn1', function(cb) {
      cb();
    });
    taker.task('fn2', function(cb) {
      cb();
    });

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(singleLevel);
    done();
  });

  it('should form a 2 level nested tree', function(done) {
    taker.task('fn1', function(cb) {
      cb();
    });
    taker.task('fn2', function(cb) {
      cb();
    });
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(doubleLevel);
    done();
  });

  it('should form a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(tripleLevel);
    done();
  });

  it('should use the proper labels for aliased tasks (simple)', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task(noop);
    taker.task('fn1', noop);
    taker.task('fn2', taker.task('noop'));
    taker.task('fn3', anon);
    taker.task('fn4', taker.task('fn3'));

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(aliasSimple);
    done();
  });

  it('should use the proper labels for aliased tasks (nested)', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task(noop);
    taker.task('fn1', noop);
    taker.task('fn2', taker.task('noop'));
    taker.task('fn3', anon);
    taker.task('ser', taker.series(noop, anon, 'fn1', 'fn2', 'fn3'));
    taker.task('par', taker.parallel(noop, anon, 'fn1', 'fn2', 'fn3'));

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(aliasNested);
    done();
  });

  it('specify depth 1 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 1 });

    expect(tree).to.deep.equal(depth1OfTripleLevel);
    done();
  });

  it('specify depth 2 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 2 });

    expect(tree).to.deep.equal(depth2OfTripleLevel);
    done();
  });

  it('specify depth 3 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 3 });

    expect(tree).to.deep.equal(depth3OfTripleLevel);
    done();
  });

  it('specify depth 4 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 4 });

    expect(tree).to.deep.equal(depth4OfTripleLevel);
    done();
  });

  it('specify depth 5 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 5 });

    expect(tree).to.deep.equal(tripleLevel);
    done();
  });

  it('specify depth 6 to a 3 level nested tree', function(done) {
    var anon = function(cb) {
      cb();
    };
    taker.task('fn1', taker.parallel(anon, noop));
    taker.task('fn2', taker.parallel(anon, noop));
    taker.task('fn3', taker.series('fn1', 'fn2'));

    var tree = taker.tree({ deep: true, depth: 6 });

    expect(tree).to.deep.equal(tripleLevel);
    done();
  });

  it('get description and flag from a registered function', function(done) {
    var anon = function(cb) {
      cb();
    };

    var f1 = taker.parallel(anon, noop);
    f1.description = 'Task #1.';
    f1.flag = {
      '--opt1': 'Option 1.',
      '--opt2': 'Option 2.',
    };
    taker.task('fn1', f1);

    var f2 = taker.parallel(anon, noop);
    f2.description = 'Task #2.';
    taker.task('fn2', f2);

    var f3 = taker.series('fn1', 'fn2');
    f3.flag = {
      '--opt3': 'Option 3.',
      '--opt4': 'Option 4.',
    };
    taker.task('fn3', f3);

    var tree = taker.tree({ deep: true });

    expect(tree).to.deep.equal(tripleLevelWithDescAndFlag);
    done();
  });
});
