/**
 * Created by rHermes on 04.11.2014.
 *
 * Returns cfu
 */
/*global define, require, exports, module */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
// AMD. Register as an anonymous module.
    define(['crossfilter'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('crossfilter'));
  } else {
    // Browser globals (root is window)
    root.cfu = factory(root.crossfilter);
  }
}(this, function (crossfilter) {
  'use strict';

  var returns = {};

  returns.reduceAddAvg = function (attr) {
    return function (p, v) {
      p.count += 1;
      p.sum += v[attr];
      p.avg = p.sum / p.count;
      return p;
    };
  };

  returns.reduceRemoveAvg = function (attr) {
    return function (p, v) {
      p.count -= 1;
      p.sum -= v[attr];
      p.avg = p.sum / p.count;
      return p;
    };
  };

  returns.reduceInitAvg = function () {
    return {count: 0, sum: 0, avg: 0};
  };


  // Generates function to get a certain attribute
  returns.getKey = function (attr) {
    return function (x) {
      return x[attr];
    };
  };

  return returns;
}));