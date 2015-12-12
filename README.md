
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

## API

#### `new exist.DB(url, options)`

##### Parameters

* `url` - _string_
* `options` - _object_ - configuration options

##### Options

The `options` object supports the following properties:

* `username` - _string_ - Username for HTTP Basic Auth
* `password` - _string_ - Password for HTTP Basic Auth
* `collection` - _string_ - Name of collection under which all subsequent requests will apply to

---

#### `.put(uri, body)`

Stores an XML document at the given URI.

##### Parameters

* `uri` - _string_ - the URI at which to store the given body
* `body` - _string_ - the document body

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected.

---

#### `.get(uri)`

Retrieves the body of the document at the given URI.

##### Parameters

* `uri` - _string_ - the URI of the document to fetch

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected, otherwise it is resolved with the body of the specified document.

---

#### `.delete(uri)`

Deletes the document at the given URI.

##### Parameters

* `uri` - _string_ - the URI of the document to delete

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected.

---

#### `.query(query, options)`

Executes given query against store and returns result

##### Parameters

* `query` - _string_ - xQuery to execute agains the store
* `options` - _object_ - Query options

##### Options

The `options` object supports the following properties:

* `start` - _integer_ - Specifies the index position of the first item in the result sequence to be returned. The default value is 1
* `max` - _integer_ - The maximum number of items to be returned
* `wrap` - _string_ - (`yes`|`no`) - Specifies whether the returned query results are to be wrapped into a surrounding <exist:result> element. The default value is yes

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected, otherwise it is resolved with the xQuery result.

---

#### `.storeQuery(uri, query)`

Stores the given xQuery at the specified URI

##### Parameters

* `uri` - _string_ - the URI at which to store the given xQuery
* `query` - _string_ - the xQuery body

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected.

---

#### `.executeStoredQuery(uri)`

Executes the xQuery stored at the given URI and returns the results.

_Syntactic Sugar. This function simply calls through to `.get(uri)`_

##### Parameters

* `uri` - _string_ - the URI of the xQuery to execute

##### Returns

A [request-promise] Promise. If a non-2xx response is returned, the promise is rejected, otherwise it is resolved with the result of executing the specified specified xQuery.

---

#### `.exists(uri)`

Determines if a document exists at the given URI

##### Parameters

* `uri` - _string_ - the URI of the document to check

##### Returns

A Promise. Resolves with `true` if a document exists at the given uri, `false` if it does not. If a non 2xx and non 404 status code is returned, the promise is rejected.

---


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

[request-promise]:  https://www.npmjs.com/package/request-promise