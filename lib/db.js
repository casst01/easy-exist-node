var request = require('request-promise');
var errors = require('request-promise/errors');

module.exports = function DB(host, opts) {
	_validateOpts(opts);

	var self = this;
	self.host = host + '/exist/rest/db' + (opts.collection || '');
	self.username = opts.username;
	self.password = opts.password;

	self.put = function(uri, document) {
		var opts = {
			uri: self.host + uri,
			method: 'PUT',
			body: document,
			headers: {
				"Content-Type": "application/xml"
			}
		};

		return _makeRequest(opts);
	};

	self.delete = function(uri) {
		var opts = {
			uri: self.host + uri,
			method: 'DELETE'
		};

		return new Promise(function(resolve, reject) {
			_makeRequest(opts)
				.then(resolve)
				.catch(errors.StatusCodeError, function(err) {
					if(err.response.statusCode === 404) {
						resolve();
					} else {
						reject(err);
					}
				});
		});
	};

	self.exists = function(uri) {
		return new Promise(function(resolve) {
			request(self.host + uri)
				.then(function(res) {
					resolve(true);
				})
				.catch(errors.StatusCodeError, function(err) {
					resolve(false);
				});
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
		if(opts && opts.collection && opts.collection[0] != "/") {
			throw new Error('ArgumentError: \"collection\" must contain preceding \'/\'');
		}
	}

};