var libxml = require('libxmljs');
var QueryRequest = require('../../lib/query-request');

describe('Query Request', function() {

  var query = 'collection("test-collection")//message/body';
  var namespaces = { 'xmlns': 'http://exist.sourceforge.net/NS/exist' };

  describe('Building request XML', function() {
    it('should build an eXist-db request XML structure for the given query', function() {
      var requestBody = new QueryRequest(query).build();
      expect(parseXml(requestBody)).toContain([
        '<query xmlns="http://exist.sourceforge.net/NS/exist">',
        '<text>collection("test-collection")//message/body</text>',
        '</query>'
      ].join(''));
    });

    describe('Options', function() {
      describe('When user specifies range options', function() {
        it('should add range attributes', function() {
          var requestBody = new QueryRequest(query, { start: 2, max: 10 }).build();
          var xmlDoc = libxml.parseXmlString(requestBody);
          expect(xmlDoc.get('/xmlns:query/@start', namespaces).value()).toBe('2');
          expect(xmlDoc.get('/xmlns:query/@max', namespaces).value()).toBe('10');
        });
      });

      describe('when user specifies wrap', function(){
        it('should add wrap attribute', function() {
          var requestBody = new QueryRequest(query, { wrap: 'no' }).build();
          var xmlDoc = libxml.parseXmlString(requestBody);
          expect(xmlDoc.get('/xmlns:query/@wrap', namespaces).value()).toBe('no');
        });
      });
    });
  });

});

function parseXml(xml) {
  return xml.replace(/(\r\n|\n|\r|[ ]{4})/gm,'');
}