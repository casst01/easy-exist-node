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
      body: '<message language="en"><body>Hello World</body><sender>Alice</sender><recipient>Bob</recipient></message>'
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
      
      it('should resolve with true if the document exists', function(done) {
        db.put(doc.uri, doc.body)
          .then(function() {
            return db.exists(doc.uri);
          })
          .then(function(docExists) {
            expect(docExists).toBe(true);
          })
          .then(done);
      });

      it('should resolve with false if the document does not exist (404)', function(done) {
        db.exists('/non-existent-doc')
          .then(function(docExists) {
            expect(docExists).toBe(false);
          })
          .then(done);
      });

      describe('when a non 2xx and a non 404 status code is returned', function() {
        it('should propogate the error so it can be caught', function(done) {
          dbIncorrectAuth.exists(doc.uri)
            .catch(function(err) {
              expect(err.response.statusCode).toBe(401);
              done();
            });
        });
      });

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

    describe('#query', function() {

      beforeEach(function(done) {
        db.put('/test-collection' + doc.uri, doc.body).then(done);
      });

      it('returns the results of the query', function(done) {
        db.query('collection("test-collection")//message/body')
          .then(function(result) {
            var parsedResult = parseXmlResponse(result);
            expect(parsedResult).toContain('<body>Hello World</body>');
          })
          .then(done);
      });

      describe('when user specifies no wrap', function() {
        it('should return results without the wrapping exist:result element', function(done) {
          db.query('collection("test-collection")//message/body', { wrap: 'no' })
            .then(function(result) {
              var parsedResult = parseXmlResponse(result);
              expect(parsedResult).toEqual('<body>Hello World</body>');
            })
            .then(done);
        });
      });

    });

    describe('Stored Queries', function() {

      var query = {
        body: 'let $var := 1\nreturn <var>{$var}</var>',
        uri: '/my-collection/stored-queries/test.xqy'
      };

      afterEach(function(done) {
        db.delete(query.uri).then(done);
      });

      describe('#storeQuery', function() {

        it('should store the given query', function(done) {
          db.storeQuery(query.uri, query.body)
            .then(function() {
              return db.exists(query.uri);
            })
            .then(function(queryExists) {
              expect(queryExists).toBe(true);
            })
            .then(done);
        });

        describe('when uri does not contain a preceding slash', function(){
          it('should raise an error', function(done) {
            var uriWithoutPrecedingSlash = 'my-document';
            db.storeQuery(uriWithoutPrecedingSlash, query.body)
              .catch(function(err) {
                expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
                done();
              });
          });
        });

      });

      describe('#executeStoredQuery', function() {

        it('should return the result of running the stored query', function(done) {
          db.storeQuery(query.uri, query.body)
            .then(function() {
              return db.executeStoredQuery(query.uri);
            })
            .then(function(queryResults) {
              expect(queryResults).toBe('<var>1</var>');
            })
            .then(done);
        });

        describe('when uri does not contain a preceding slash', function(){
          it('should raise an error', function(done) {
            var uriWithoutPrecedingSlash = 'my-document';
            db.executeStoredQuery(uriWithoutPrecedingSlash)
              .catch(function(err) {
                expect(err.message).toBe('ArgumentError: \"uri\" must contain preceding \'/\'');
                done();
              });
          });
        });

      });

    });

  });

});

function parseXmlResponse(xml) {
  return xml.replace(/(\r\n|\n|\r|[ ]{4})/gm,'');
}