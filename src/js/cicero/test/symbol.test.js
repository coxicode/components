import sym from './../symbol.js';
import { assert } from 'chai';

describe('symbol', function() {

  describe('expand()', function() {

    const symbols = [
      "Der",
      "$V{p:3}",
      "$V{n}",
      "$N{n:sg+pl,c:acc,g}",
      "$N{n:sg,c:acc+nom+gen,g:m+f}"
    ];

    it('should do nothing if there are no partially specified features', function() {
      assert.sameMembers(sym.expand(symbols[0]), ["Der"]);
      assert.sameMembers(sym.expand(symbols[1]), ["$V{p:3}"]);
      assert.sameMembers(sym.expand(symbols[2]), ["$V{n}"]);
    });

    it('should only expand partially specified features', function() {
      assert.sameMembers(sym.expand(symbols[3]), [
        "$N{n:sg,c:acc,g}",
        "$N{n:pl,c:acc,g}"
      ]);
      assert.sameMembers(sym.expand(symbols[4]), [
        "$N{n:sg,c:acc,g:m}",
        "$N{n:sg,c:nom,g:f}",
        "$N{n:sg,c:gen,g:m}",
        "$N{n:sg,c:acc,g:f}",
        "$N{n:sg,c:nom,g:m}",
        "$N{n:sg,c:gen,g:f}",
      ]);
    });
  });

});
