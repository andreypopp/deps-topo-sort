var assert = require('assert'),
    asStream = require('as-stream'),
    aggregate = require('stream-aggregate'),
    sort = require('./index');

describe('deps-topo-sort', function() {

  it('sorts modules topologically', function(done) {
    var g = asStream(
      {
        id: 'main.css',
        deps: {'./a.css': 'z.css'}
      },
      {
        id: '0.css',
        deps: {'x': 'x.css'}
      },
      {
        id: 'x.css'
      },
      {
        id: 'z.css',
        deps: {}
      }
    );

    aggregate(g.pipe(sort()), function(err, result) {
      if (err) return done(err);
      assert.deepEqual(
        result.map(function(mod) { return mod.id; }),
        ["z.css", "main.css", "x.css", "0.css"]);
      done();
    });
  });
});
