/**
 * Created by rHermes on 03.11.2014.
 */
/*global fallback*/
fallback.load({
  // Include your stylesheets, this can be an array of stylesheets or a string!
  page_css: 'css/ignreview.css',
  //global_css: ['public.css', 'members.css'],

  // JavaScript library. THE KEY MUST BE THE LIBARIES WINDOW VARIABLE!
  crossfilter: [
    '//cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter.min.js',
    '../vendors/crossfilter/v1.3.11/crossfilter.min.js'
  ],
  _: [
    '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js',
    '../vendors/lodash/v2.4.1/lodash.min.js'
  ],
  d3: [
    '//cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min.js',
    '../vendors/d3/v3.4.13/d3.min.js'
  ],
  cfu: '../js/lib/crossfilter-utils.js',
  $: [
    '//cdnjs.cloudflare.com/ajax/libs/zepto/1.1.4/zepto.min.js',
    '../vendors/zepto/v1.1.4/zepto.min.js'
  ],
  velocity: [
    '//cdnjs.cloudflare.com/ajax/libs/velocity/1.1.0/velocity.min.js',
    '../vendors/velocity/v1.1.0/velocity.min.js'
  ]
}, {
  // Shim jQuery UI so that it will only load after jQuery has completed!
  shim: {
    velocity: {
      deps: [ "$" ]
    }
  },

  callback: function (success, failed) {
    'use strict';
    // success - object containing all libraries that loaded successfully.
    // failed - object containing all libraries that failed to load.

    if (!failed.length) {
      console.log("All dependencies loaded!");
    } else {
      console.log("Succeeded to load: [%s]", Object.keys(success).join(', '));
      console.log("Failed to load: [%s]", Object.keys(failed).join(', '));
    }
  }
});