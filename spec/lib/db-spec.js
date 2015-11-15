var DB = require('../../lib/db');

describe('DB', function() {

	describe('Instantiation', function() {
		it('should throw an error if collection does not contain preceding slash', function() {
			expect(function() {
				new DB('http://localhost', { collection: 'my-collection'});
			})
			.toThrow(new Error('ArgumentError: \"collection\" must contain preceding \'/\''));
		});
	});

});