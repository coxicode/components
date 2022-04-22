import seq from './../sequence.js';
import { assert } from 'chai';

describe('sequence', function() {

  describe('specifyFeature()', function() {

    const seqs = [
      ["Der", "Baum", "blüht"],
      ["Der", "Baum", "$V{p:3}"],
      ["Der", "Baum", "$V{p:3,n}"],
      ["$N{n,c,g}", "$V{n}", "$O{c:acc+dat+gen}"],
      ["$N{n}", "$V{n:sg+pl}", "$O{c}"],
      ["$N{n:sg,c:nom}", "$V{n:sg,c:nom}", "$O{c:acc}"],
      ["$Det{n:pl,c,g}", "$N{n:pl,c,g}", "$N{n:pl,c,g}", "$V{n:pl}", "$Det{n,c:acc}", "$N{n,c:acc}"]
    ];

    it('should leave sequences consisting of terminals unchanged', function() {
      assert.deepEqual(seq.specifyFeature(seqs[0], "n", "sg"), seqs[0]);
    });

    it('should leave specified features unchanged', function() {
      assert.sameDeepMembers(seq.specifyFeature(seqs[1], "p", "1"), 
        ["Der", "Baum", "$V{p:3}"]
      );
    });

    it('should not add attributes that are not present in sequence', function() {
      assert.sameDeepMembers(seq.specifyFeature(seqs[1], "n", "sg"), 
        ["Der", "Baum", "$V{p:3}"]
      );
    });

    it('should specify features that are unspecified', function() {
      assert.sameDeepMembers(seq.specifyFeature(seqs[2], "n", "pl"), 
        ["Der", "Baum", "$V{p:3,n:pl}"]
      );
    });

    it('should not specify features that are partially specified', function() {
      assert.sameDeepMembers(seq.specifyFeature(seqs[3], "c", "dat"), 
        ["$N{n,c:dat,g}", "$V{n}", "$O{c:acc+dat+gen}"]
      );
      assert.sameDeepMembers(seq.specifyFeature(seqs[3], "c", "nom"), 
        ["$N{n,c:nom,g}", "$V{n}", "$O{c:acc+dat+gen}"]
      );
      assert.sameDeepMembers(seq.specifyFeature(seqs[4], "n", "sg"), 
        ["$N{n:sg}", "$V{n:sg+pl}", "$O{c}"]
      );

    });

  });

  describe('specify()', function() {

    const seqs = [
      ["Der", "Baum", "blüht"],
      ["Der", "Baum", "$V{p:3}"],
      ["Der", "Baum", "$V{p:3,n}"],
      ["Der", "Baum", "$V{p,n}"],
      ["$N{n,c,g}", "$V{n}", "$O{c:acc+dat+gen}"]
    ];

    it('should leave sequences consisting of terminals unchanged', function() {
      assert.sameDeepMembers(seq.specify(seqs[0], {n: ["sg","pl"]}), [seqs[0]]);
    });

    it('should leave specified features unchanged', function() {
      assert.sameDeepMembers(seq.specify(seqs[1], {n: ["sg","pl"]}), 
        [["Der", "Baum", "$V{p:3}"]]
      );
    });

    it('should not add attributes that are not present in sequence', function() {
      assert.sameDeepMembers(seq.specify(seqs[1], {n: ["sg","pl"]}), 
        [["Der", "Baum", "$V{p:3}"]]
      );
    });

    it('should specify features that are unspecified', function() {
      assert.sameDeepMembers(seq.specify(seqs[2], {n: ["sg","pl"]}), 
        [
          ["Der", "Baum", "$V{p:3,n:sg}"],
          ["Der", "Baum", "$V{p:3,n:pl}"]
        ]
      );
    });

    it('should specify multiple features at once', function() {
      assert.sameDeepMembers(seq.specify(seqs[3], {n: ["sg","pl"],p:["1","2","3"]}), 
        [
          ["Der", "Baum", "$V{p:1,n:sg}"],
          ["Der", "Baum", "$V{p:1,n:pl}"],
          ["Der", "Baum", "$V{p:2,n:sg}"],
          ["Der", "Baum", "$V{p:2,n:pl}"],
          ["Der", "Baum", "$V{p:3,n:sg}"],
          ["Der", "Baum", "$V{p:3,n:pl}"]
        ]
      );
    });


    it('should not specify features that are partially specified', function() {
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["dat"]}), 
        [["$N{n,c:dat,g}", "$V{n}", "$O{c:acc+dat+gen}"]]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["nom"]}), 
        [["$N{n,c:nom,g}", "$V{n}", "$O{c:acc+dat+gen}"]]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["nom", "acc"]}), 
        [
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:acc+dat+gen}"],
          ["$N{n,c:acc,g}", "$V{n}", "$O{c:acc+dat+gen}"]
        ]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {n: ["sg", "pl"], c: ["nom", "acc"]}), 
        [
          ["$N{n:sg,c:nom,g}", "$V{n:sg}", "$O{c:acc+dat+gen}"],
          ["$N{n:sg,c:acc,g}", "$V{n:sg}", "$O{c:acc+dat+gen}"],
          ["$N{n:pl,c:nom,g}", "$V{n:pl}", "$O{c:acc+dat+gen}"],
          ["$N{n:pl,c:acc,g}", "$V{n:pl}", "$O{c:acc+dat+gen}"]
        ]
      );
    });


    /* using expand after specify is not required
    
        it('should not specify features that are partially specified', function() {
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["dat"]}), 
        [
          ["$N{n,c:dat,g}", "$V{n}", "$O{c:acc}"],
          ["$N{n,c:dat,g}", "$V{n}", "$O{c:dat}"],
          ["$N{n,c:dat,g}", "$V{n}", "$O{c:gen}"]
        ]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["nom"]}), 
        [
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:acc}"],
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:dat}"],
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:gen}"]
        ]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {c: ["nom", "acc"]}), 
        [
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:acc}"],
          ["$N{n,c:acc,g}", "$V{n}", "$O{c:acc}"],
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:dat}"],
          ["$N{n,c:acc,g}", "$V{n}", "$O{c:dat}"],
          ["$N{n,c:nom,g}", "$V{n}", "$O{c:gen}"],
          ["$N{n,c:acc,g}", "$V{n}", "$O{c:gen}"]
        ]
      );
      assert.sameDeepMembers(seq.specify(seqs[4], {n: ["sg", "pl"], c: ["nom", "acc"]}), 
        [
          ["$N{n:sg,c:nom,g}", "$V{n:sg}", "$O{c:acc}"],
          ["$N{n:sg,c:acc,g}", "$V{n:sg}", "$O{c:acc}"],
          ["$N{n:pl,c:nom,g}", "$V{n:pl}", "$O{c:acc}"],
          ["$N{n:pl,c:acc,g}", "$V{n:pl}", "$O{c:acc}"],

          ["$N{n:sg,c:nom,g}", "$V{n:sg}", "$O{c:dat}"],
          ["$N{n:sg,c:acc,g}", "$V{n:sg}", "$O{c:dat}"],
          ["$N{n:pl,c:nom,g}", "$V{n:pl}", "$O{c:dat}"],
          ["$N{n:pl,c:acc,g}", "$V{n:pl}", "$O{c:dat}"],

          ["$N{n:sg,c:nom,g}", "$V{n:sg}", "$O{c:gen}"],
          ["$N{n:sg,c:acc,g}", "$V{n:sg}", "$O{c:gen}"],
          ["$N{n:pl,c:nom,g}", "$V{n:pl}", "$O{c:gen}"],
          ["$N{n:pl,c:acc,g}", "$V{n:pl}", "$O{c:gen}"]
        ]
      );
    });
    */


  });

});
