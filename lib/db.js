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
			auth: {
				user: self.username,
				pass: self.password
			},
			headers: {
				"Content-Type": "application/xml"
			}
		};

		return request(opts);
	};

	self.delete = function(uri) {
		var opts = {
			uri: self.host + uri,
			method: 'DELETE'
		};

		if(self.username && self.password) {
			opts.auth = {
				user: self.username,
				pass: self.password
			};
		}

		return new Promise(function(resolve, reject) {
			request(opts)
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

	function _validateOpts(opts) {
		if(opts && opts.collection && opts.collection[0] != "/") {
			throw new Error('ArgumentError: \"collection\" must contain preceding \'/\'');
		}
	}

};