var builder = require('xmlbuilder');

/**
 * Represents an eXist-db Query Request.
 * @constructor
 * @param {string} xQuery body
 * @param {*} opts
 */
module.exports = function QueryRequest(query, opts) {
  
  this.query = query;
  this.opts = opts || {};
  this.opts.xmlns = 'http://exist.sourceforge.net/NS/exist';

  /**
  * Generate XML structure for Query Request
  * @returns {string}
  */
  this.build = function() {
    return builder.create('query').att(this.opts)
        .ele('text', {}, this.query)
    .end();
  };

};