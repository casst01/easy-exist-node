var request = require('request-promise');
var httpErrors = require('request-promise/errors');
var QueryRequest = require('./query-request');

/**
 * Represents a DB.
 * @constructor
 * @param {string} host
 * @param {*} opts
 */
module.exports = function DB(host, opts) {
  var self = this;

  if(opts) {
    _validateOpts(opts);
  }

  self.host = host + '/exist/rest/db' + (opts.collection || '');
  self.username = opts.username;
  self.password = opts.password;

  /**
  * Stores an XML document at the given URI
  * @param {string} uri
  * @param {string} document
  * @returns {Promise}
  */
  self.put = function(uri, document) {
    var opts = {
      uri: self.host + uri,
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
        resolve(_makeRequest(opts));
      }
    });
  };

  /**
  * Retrieves the body of the document at the given URI
  * @param {string} uri
  * @returns {Promise}
  */
  self.get = function(uri) {
    var opts = {
      uri: self.host + uri,
      method: 'GET',
      headers: {
        "Accept": "application/xml"
      }
    };

    return new Promise(function(resolve, reject) {
      if(!_hasPrecedingSlash(uri)) {
        reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
      } else {
        resolve(_makeRequest(opts));
      }
    });
  };

  /**
  * Deletes the document at the given URI
  * @param {string} uri
  * @returns {Promise}
  */
  self.delete = function(uri) {
    var opts = {
      uri: self.host + uri,
      method: 'DELETE'
    };

    return new Promise(function(resolve, reject) {
      if(!_hasPrecedingSlash(uri)) {
        reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
      } else {
        _makeRequest(opts)
          .then(resolve)
          .catch(httpErrors.StatusCodeError, function(err) {
            if(err.response.statusCode === 404) {
              resolve();
            } else {
              reject(err);
            }
          });
      }
    });
  };

  /**
  * Executes given query against store and returns result
  * @param {string} xQuery body
  * @returns {Promise}
  */
  self.query = function(query) {
    var requestBody = new QueryRequest(query, {}).build();
    var opts = {
      uri: self.host,
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/xml'
      }
    };
    return _makeRequest(opts);
  };

  /**
  * Determines if a document exists at the given URI
  * @param {string} uri
  * @returns {Promise}
  */
  self.exists = function(uri) {
    var opts = {
      uri: self.host + uri,
      method: 'GET'
    };

    return new Promise(function(resolve, reject) {
      if(!_hasPrecedingSlash(uri)) {
        reject(new Error('ArgumentError: \"uri\" must contain preceding \'/\''));
      } else {
        _makeRequest(opts)
          .then(function(res) {
            resolve(true);
          })
          .catch(httpErrors.StatusCodeError, function(err) {
            resolve(false);
          });
      }
    });
  };

  function _makeRequest(opts) {
    if(self.username && self.password) {
      opts.auth = {
        user: self.username,
        pass: self.password
      };
    }

    return request(opts);
  }

  function _validateOpts(opts) {
    if(opts.collection && !_hasPrecedingSlash(opts.collection)) {
      throw new Error('ArgumentError: \"collection\" must contain preceding \'/\'');
    }
  }

  function _hasPrecedingSlash(uri) {
    return uri[0] === '/';
  }

};