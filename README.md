
# Easy-Exist

Node module providing promisified API to interact with eXist-db's REST API.


## Code Example

```
var exist = require('easy-exist');

// connect
var db = new exist.DB('http://localhost', {
    username: "test-user",
    password: "password"
});

body = '<message><body>Hello World</body></message>'

// PUT a document
db.put('/my-collection/my-document', body)

    // Get the body of a document
    .then(function() {
        return db.get('/my-collection/my-document');
    })
    .then(function(doc) {
        console.log('Document Body:', doc);
    })

    // Execute xQuery
    .then(function() {
        return db.query('collection("my-collection")/message/body');
    })
    .then(function(result) {
        console.log('xQuery result:', result);
    })

    // Delete document
    .then(function() {
        return db.delete('/my-collection/my-document');
    })
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
3. Make your changes with tests
	1. Run tests: `grunt test`
	2. Run hint: `grunt hint`
4. Create a Pull Request

### Test setup

The tests run against a local exist-db instance under a "test-user" account. If you want to run the tests yourself, ensure that this test-user account has been created. You can update the connection properties in `spec/lib/db-spec.js`

```
var DB_HOST = 'http://localhost';
// ...
var db = new DB(DB_HOST, { username: 'test-user', password: 'password'} );
```