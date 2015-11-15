var DB = require('../../lib/db');
const DB_HOST = 'http://localhost:8088';

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

		var doc = {
			uri: "/test-collection/test.xml",
			body: "<message language='en'><body>Hello World</body><sender>Alice</sender><recipient>Bob</recipient></message>"
		};

		describe('#put', function() {
			it('should store given document at the given location', function(done) {
				var db = new DB(DB_HOST, { username: 'test-user', password: 'password'} );
				db.put(doc.uri, doc.body)
					.then(function() {
						return db.exists(doc.uri);
					})
					.then(function(docExists) {
						expect(docExists).toBe(true);
					})
					.then(done);
			})
		});

	})

});