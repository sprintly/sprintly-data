import { assert } from "chai";
import sinon from "sinon";
import QueryConfig from "../../lib/items/query-config";


describe('Items QueryConfig', function() {
  before(function() {
    this.sinon = sinon.sandbox.create();
  });

  beforeEach(function() {
    this.config = new QueryConfig();
  });

  afterEach(function() {
    this.sinon.restore();
  });

  describe('serialize', function() {
    it('should present array fields as a comma delimited list', function() {
      this.config.set({ type: ['story', 'defect' ]});
      var querystring = this.config.serialize();
      assert.ok(/type=story%2Cdefect/.test(querystring));
    });
  });
});

