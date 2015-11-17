var DB = require('../../lib/db');
var DB_HOST = 'http://localhost:8088';

describe('DB', function() {

	describe('Instantiation', function() {
		it('should throw an error if collection does not contain preceding slash', function() {
			expect(function() {
				new DB('http://localhost', { collection: 'my-collection'});
			})
			.toThrow(new Error('ArgumentError: \"collection\" must contain preceding \'/\''));
		});
	});

	describe('Intance Methods', function() {

		var db = new DB(DB_HOST, { username: 'test-user', password: 'password'} );
		var dbIncorrectAuth = new DB(DB_HOST, { username: 'test-user', password: 'wrong-password'} );
		var dbNoAuth = new DB(DB_HOST, {});

		var doc = {
			uri: "/test-collection/test.xml",
			body: "<message language='en'><body>Hello World</body><sender>Alice</sender><recipient>Bob</recipient></message>"
		};

		afterEach(function(done) {
			db.delete(doc.uri).then(done);
		});

		describe('#put', function() {
			it('should store given document at the given location', function(done) {
				db.put(doc.uri, doc.body)
					.then(function() {
						return db.exists(doc.uri);
					})
					.then(function(docExists) {
						expect(docExists).toBe(true);
					})
					.then(done);
			});

			describe('when username and password are not present', function(done) {
				it('should not store the document', function(done) {
					dbNoAuth.put(doc.uri, doc.body)
						.catch(function() {
							db.exists(doc.uri)
								.then(function(docExists) {
									expect(docExists).toBe(false);
								})
								.then(done);
						});
				});
				it('should raise a 401 exception', function(done) {
					dbNoAuth.put(doc.uri, doc.body)
						.catch(function(err) {
							expect(err.response.statusCode).toBe(401);
							done();
						});
				});
			});

			describe('when username and password are incorrect', function(done) {
				it('should not store the document', function(done) {
					dbIncorrectAuth.put(doc.uri, doc.body)
						.catch(function() {
							db.exists(doc.uri)
								.then(function(docExists) {
									expect(docExists).toBe(false);
								})
								.then(done);
						});
				});
				it('should raise a 401 exception', function(done) {
					dbIncorrectAuth.put(doc.uri, doc.body)
						.catch(function(err) {
							expect(err.response.statusCode).toBe(401);
							done();
						});
				});
			});

			describe('when uri does not contain a preceding slash', function(){
				it('should raise an error', function(done) {
					var uriWithoutPrecedingSlash = 'my-document';
					db.put(uriWithoutPrecedingSlash, doc.body)
						.catch(function(err) {
							expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
							done();
						});
				});
			});

		});

		describe('#delete', function() {

			it('should remove the document from the store', function(done) {
				db.put(doc.uri, doc.body)
					.then(function() {
						return db.delete(doc.uri);
					})
					.then(function() {
						return db.exists(doc.uri);
					})
					.then(function(docExists) {
						expect(docExists).toBe(false);
					})
					.then(done);
			});

			describe('when document does not exist', function() {
				it('sould not throw an exception', function(done) {
					db.delete('/doc-that-doesnt-exist').then(done);
				});
			});

			describe('when uri does not contain a preceding slash', function(){
				it('should raise an error', function(done) {
					var uriWithoutPrecedingSlash = 'my-document';
					db.delete(uriWithoutPrecedingSlash)
						.catch(function(err) {
							expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
							done();
						});
				});
			});

			describe('when username and password are not present', function(done) {
				it('should not delete the document', function(done) {
					db.put(doc.uri, doc.body)
						.then(function() {
							return dbNoAuth.delete(doc.uri);
						})
						.then(function() {
							return dbNoAuth.exists(doc.uri);
						})
						.then(function(docExists) {
							expect(docExists).toBe(true);
						})
						.catch(done);
				});
				it('should raise a 401 exception', function(done) {
					db.put(doc.uri, doc.body)
						.then(function() {
							return dbNoAuth.delete(doc.uri);
						})
						.catch(function(err) {
							expect(err.response.statusCode).toBe(401);
							done();
						});
				});
			});

			describe('when username and password are incorrect', function(done) {
				it('should not delete the document', function(done) {
					db.put(doc.uri, doc.body)
						.then(function() {
							return dbIncorrectAuth.delete(doc.uri);
						})
						.then(function() {
							return dbIncorrectAuth.exists(doc.uri);
						})
						.then(function(docExists) {
							expect(docExists).toBe(true);
						})
						.catch(done);
				});
				it('should raise a 401 exception', function(done) {
					db.put(doc.uri, doc.body)
						.then(function() {
							return dbIncorrectAuth.delete(doc.uri);
						})
						.catch(function(err) {
							expect(err.response.statusCode).toBe(401);
							done();
						});
				});
			});
		});

		describe('#get', function() {

			it('returns the body of the document at the given uri', function(done) {
				db.put(doc.uri, doc.body)
					.then(function() {
						return db.get(doc.uri);
					})
					.then(parseXmlResponse)
					.then(function(body) {
						expect(body).toBe(doc.body);
					})
					.then(done);
			});

			describe('when uri does not contain a preceding slash', function(){
				var uriWithoutPrecedingSlash = 'my-document';
				it('should raise an error', function(done) {
					db.get(uriWithoutPrecedingSlash)
						.catch(function(err) {
							expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
							done();
						});
				});
			});

		});

		describe('#exists', function() {
			
			describe('when uri does not contain a preceding slash', function(){
				it('should raise an error', function(done) {
					var uriWithoutPrecedingSlash = 'my-document';
					db.exists(uriWithoutPrecedingSlash)
						.catch(function(err) {
							expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
							done();
						});
				});
			});

		});

	});

});

function parseXmlResponse(xml) {
	return xml.replace(/(\r\n|\n|\r|[ ]{4})/gm,'').replace(/\"/g,'\'');
}