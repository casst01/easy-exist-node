var libxml = require('libxmljs');
var QueryRequest = require('../../lib/query-request');

describe('Query Request', function() {

  describe('Building request XML', function() {
    it('should build an eXist-db request XML structure for the given query', function() {
      var query = 'collection("test-collection")//message/body';
      var requestBody = new QueryRequest(query).build();
      expect(parseXml(requestBody)).toBe([
          '<query xmlns="http://exist.sourceforge.net/NS/exist">',
          '<text>collection("test-collection")//message/body</text>',
          '</query>'
        ].join(''));
    });
  });

});

function parseXml(xml) {
  return xml.replace(/(\r\n|\n|\r|[ ]{4})/gm,'');
}