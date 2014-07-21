var sort = require('../');
var test = require('tape');
var through = require('through2');

test('dedupe index', function (t) {
    t.plan(1);
    var s = sort({ dedupe: true, index: true });
    var rows = [];
    function write (row, enc, next) { rows.push(row); next() }
    function end () {
        t.deepEqual(rows, [
            {
                id: '/bar.js',
                deps: {},
                source: 'TWO',
                dedupe: 1,
                index: 1,
                indexDeps: {}
            },
            {
                id: '/foo.js',
                deps: {},
                source: 'TWO',
                dedupe: 1,
                index: 2,
                indexDeps: {}
            },
            {
                id: '/main.js',
                deps: { './foo': '/foo.js', './bar': '/bar.js' },
                source: 'ONE',
                index: 3,
                indexDeps: { './foo': 2, './bar': 1 },
            }
        ]);
    }
    s.pipe(through.obj(write, end));
    
    s.write({
        id: '/main.js',
        deps: { './foo': '/foo.js', './bar': '/bar.js' },
        source: 'ONE'
    });
    s.write({
        id: '/foo.js',
        deps: {},
        source: 'TWO'
    });
    s.write({
        id: '/bar.js',
        deps: {},
        source: 'TWO'
    });
    s.end();
});