/**
 * Represents an eXist-db Query Request.
 * @constructor
 * @param {string} xQuery body
 * @param {*} opts
 */
module.exports = function QueryRequest(query, opts) {
  
  this.query = query;
  this.opts = opts;

  /**
  * Generate XML structure for Query Request
  * @returns {string}
  */
  this.build = function() {
    return [
      '<query xmlns="http://exist.sourceforge.net/NS/exist">',
        // 'start="[first item to be returned]" ',
        // 'max="[maximum number of items to be returned]">',
        '<text>' + this.query + '</text>',
        '</query>'
    ].join('\n');
  };

};