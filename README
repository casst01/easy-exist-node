
# Easy-Exist

Node module providing promisified API to interact with eXist-db's REST API.


## Code Example

```
var exist = require('easy-exist');

// connect
var db = new exist.DB('http://localhost:8080', {
	username: "user",
	password: "easy"
});

// add a document
body =  '<message><body>Hello World</body></message>'
db.put('/my-collection/my-document', body)
	.then(function() {
		console.log('Document Uploaded');
	});

// get document body
db.get('/my-collection/my-document')
	.then(function(doc) {
		console.log('Document Body:', doc);
	});

// execute xQuery for all message bodies
db.query('collection("my-collection")/message/body')
	.then(function(result) {
		console.log('xQuery result:', result);
	});

// delete the document
db.delete('/my-collection/my-document')
	.then(function() {
		console.log('Document Deleted');
	});
```

## Installation

Install via NPM

```
npm install easy-exist --save
```

Then require

```
var exist = require('easy-exist');
```

## Contributing
1. Fork the project.
2. Create your branch
3. Commit your changes with tests
4. Create a Pull Request

### Running Tests

Jasmine is used for tests.
The tests run against a local exist-db instance under a "test-user" account. If you want to run the tests yourself, ensure that this test-user account has been created. You can update the connection properties in `spec/db-spec.js`

```
var DB_HOST = 'http://localhost';
// ...
var db = new DB(DB_HOST, { username: 'test-user', password: 'password'} );
```