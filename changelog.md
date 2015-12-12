## 0.5.0
Additions to public API:
* `storeQuery(uri, query)`: Stores the given xQuery at the specified URI
* `executeStoredQuery(uri)`: Executes the xQuery stored at the given URI and returns the results

## 0.4.0
Public API:
* **Updated** `exists(uri)`
  - This returned promise is now rejected if a non-2xx and non-404 status code is returned so that the error can be handled by the client

## 0.3.0
Public API:
* `query(query)`: Execute xQuery against store and return results

## 0.2.0
Public API:
* `put(uri, documentBody)`: Put document at URI
* `get(uri)`: Get body of document at URI
* `delete(uri)`: Delete document
* `exists(uri)`: Check if document exists