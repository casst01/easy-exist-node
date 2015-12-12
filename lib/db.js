var request = require('request-promise');
var httpErrors = require('request-promise/errors');
var QueryRequest = require('./query-request');
var Promise = require('bluebird');

/**
 * Represents a DB.
 * @constructor
 * @param {string} host
 * @param {*} opts
 */
var DB = function(host, opts) {
  if(opts) {
    _validateOpts.call(this, opts);
  }

  this.host = host + '/exist/rest/db' + (opts.collection || '');
  this.username = opts.username;
  this.password = opts.password;
};

/**
* Stores an XML document at the given URI
* @param {string} uri
* @param {string} document
* @returns {Promise}
*/
DB.prototype.put = function(uri, document) {
  var opts = {
    uri: this.host + uri,
    method: 'PUT',
    body: document,
    headers: {
      "Content-Type": "application/xml"
    }
  };

  return new Promise(function(resolve, reject) {
      if(!_hasPrecedingSlash(uri)) {
        reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
      } else {
        resolve(_makeRequest.call(this, opts));
      }
    }.bind(this));
};

/**
* Retrieves the body of the document at the given URI
* @param {string} uri
* @returns {Promise}
*/
DB.prototype.get = function(uri) {
  var opts = {
    uri: this.host + uri,
    method: 'GET',
    headers: {
      "Accept": "application/xml"
    }
  };

  return new Promise(function(resolve, reject) {
    if(!_hasPrecedingSlash(uri)) {
      reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
    } else {
      resolve(_makeRequest.call(this, opts));
    }
  }.bind(this));
};

/**
* Deletes the document at the given URI
* @param {string} uri
* @returns {Promise}
*/
DB.prototype.delete = function(uri) {
  var opts = {
    uri: this.host + uri,
    method: 'DELETE'
  };

  return new Promise(function(resolve, reject) {
    if(!_hasPrecedingSlash(uri)) {
      reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
    } else {
      _makeRequest.call(this, opts)
        .then(resolve)
        .catch(httpErrors.StatusCodeError, function(err) {
          if(err.response.statusCode === 404) {
            resolve();
          } else {
            reject(err);
          }
        });
    }
  }.bind(this));
};

/**
* Executes given query against store and returns result
* @param {string} xQuery body
* @returns {Promise}
*/
DB.prototype.query = function(query, queryOpts) {
  var requestBody = new QueryRequest(query, queryOpts).build();
  var opts = {
    uri: this.host,
    method: 'POST',
    body: requestBody,
    headers: {
      'Content-Type': 'application/xml'
    }
  };
  return _makeRequest.call(this, opts);
};

/**
* Stores the given xQuery at the specified URI
* @param {string} uri
* @param {string} xQuery body
* @returns {Promise}
*/
DB.prototype.storeQuery = function(uri, query) {
  var opts = {
    uri: this.host + uri,
    method: 'PUT',
    body: query,
    headers: {
      "Content-Type": "application/xquery"
    }
  };

  return new Promise(function(resolve, reject) {
    if(!_hasPrecedingSlash(uri)) {
      reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
    } else {
      resolve(_makeRequest.call(this, opts));
    }
  }.bind(this));
};

/**
* Executes the xQuery stored at the given URI and returns the results
* @param {string} uri
* @returns {Promise}
*/
DB.prototype.executeStoredQuery = function(uri) {
  return this.get(uri);
};

/**
* Determines if a document exists at the given URI
* @param {string} uri
* @returns {Promise}
*/
DB.prototype.exists = function(uri) {
  var opts = {
    uri: this.host + uri,
    method: 'GET'
  };

  return new Promise(function(resolve, reject) {
    if(!_hasPrecedingSlash(uri)) {
      reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
    } else {
      _makeRequest.call(this, opts)
        .then(function(res) {
          resolve(true);
        })
        .catch(httpErrors.StatusCodeError, function(err) {
          if(err.response.statusCode === 404) {
            resolve(false);
          } else {
            reject(err);
          }
        });
    }
  }.bind(this));
};

/**
* Wrapper for request-promise. 
* Adds auth information to opts if it is present in instance
* @private
* @param {*} opts - the request options
* @returns {Promise}
*/
function _makeRequest(opts) {
  if(this.username && this.password) {
    opts.auth = {
      user: this.username,
      pass: this.password
    };
  }

  return request(opts);
}

/**
* Determines if given string has preceding '/'
* @private
* @param {String}
* @returns {boolean}
*/
function _hasPrecedingSlash(string) {
  return string[0] === '/';
}

/**
* Validates given options
* @private
* @param {*} opts
*/
function _validateOpts(opts) {
  if(opts.collection && !_hasPrecedingSlash(opts.collection)) {
    throw new Error('ArgumentError: \"collection\" must contain preceding \'/\'');
  }
}

module.exports = DB;
