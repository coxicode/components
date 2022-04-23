import seq from './../sequence.js';
import { assert } from 'chai';

describe('sequence', function() {


  describe('getAttributes()', function() {

    const seqs = [
      ["Der", "Baum", "blüht"],
      ["Der", "Baum", "$V{p:3}"],
      ["Der", "Baum", "$V{p:3,n}"],
      ["$N{n,c,g}", "$V{n}", "$O{c:acc+dat+gen}"],
      ["$N{n}", "$V{n:sg+pl}", "$O{c}"],
      ["$N{n:sg,c:nom}", "$V{n:sg,c:nom}", "$O{c:acc}"],
      ["$Det{n:pl,c,g}", "$N{n:pl,c,g}", "$N{n:pl,c,g}", "$V{n:pl}", "$Det{n,c:acc}", "$N{n,c:acc}"],
      ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:#2}", "@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#2}"]
    ];

    it('should return an empty list for sequences consisting of terminals', function() {
      assert.deepEqual(seq.getAttributes(seqs[0], "sg"), []);
    });

    it('should return an empty list if value is not present in sequence', function() {
      assert.sameDeepMembers(seq.getAttributes(seqs[1], "1"), []);
      assert.sameDeepMembers(seq.getAttributes(seqs[1], "sg"), []);
      assert.sameDeepMembers(seq.getAttributes(seqs[3], "nom"), []);
    });

    it('should return attributes if normal value is given', function() {
      assert.sameDeepMembers(seq.getAttributes(seqs[2], "3"), ["p"]);
      assert.sameDeepMembers(seq.getAttributes(seqs[3], "gen"), ["c"]);
      assert.sameDeepMembers(seq.getAttributes(seqs[5], "acc"), ["c"]);
    });

    it('should only return the attribute once if it matches in several symbols', function() {
      assert.sameDeepMembers(seq.getAttributes(seqs[3], "dat"), ["c"]);
      assert.sameDeepMembers(seq.getAttributes(seqs[4], "sg"), ["n"]);
    });

    it('should return all attributes for a given feature variable', function() {
      assert.sameDeepMembers(seq.getAttributes(seqs[7], "#1"), ["ask", "answer"]);
      assert.sameDeepMembers(seq.getAttributes(seqs[7], "#2"), ["ask", "answer", "hello"]);
      assert.sameDeepMembers(seq.getAttributes(seqs[7], "#3"), []);
    });

  });


  describe('getFeatureVariables()', function() {

    const seqs = [
      ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:#2}", "@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#2}"],
      ["@Question{ask:#1}", "@Something{hello:#2}"],
      ["@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#3}"],
      ["@Answer{answer:2}", "@Something{hello:2}", "@Something{hello:2}"]
    ];

    it('should return an empty list if there are no feature variables in sequence', function() {
      assert.sameDeepMembers(seq.getFeatureVariables(seqs[3]), []);
    });

    it('should find all feature variables in sequence', function() {
      assert.sameDeepMembers(seq.getFeatureVariables(seqs[0]), ["#1", "#2"]);
      assert.sameDeepMembers(seq.getFeatureVariables(seqs[1]), ["#1", "#2"]);
      assert.sameDeepMembers(seq.getFeatureVariables(seqs[2]), ["#2", "#3"]);
    });

  });

 describe('specifyFeatureVariable()', function() {

    const seqs = [
      ["Der", "Baum", "blüht"],
      ["Der", "Baum", "$V{p:3}"],
      ["Der", "Baum", "$V{p:3,n}"],
      ["$N{n,c,g}", "$V{n}", "$O{c:acc+dat+gen}"],
      ["$N{n}", "$V{n:sg+pl}", "$O{c}"],
      ["$N{n:sg,c:nom}", "$V{n:sg,c:nom}", "$O{c:acc}"],
      ["$Det{n:pl,c,g}", "$N{n:pl,c,g}", "$N{n:pl,c,g}", "$V{n:pl}", "$Det{n,c:acc}", "$N{n,c:acc}"],
      ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:#2}", "@Answer{answer:#2}"]
    ];

    it('should not do anything if the given variable name does not begin with #', function() {
      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[0], "n", "sg"), seqs[0]);
      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[1], "p", "1"), seqs[1]);

      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[7], "1", "true"), 
        seqs[7]      
      );
      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[7], "", "false"), 
        seqs[7]
      );
    });

    it('should specify feature variables', function() {
      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[7], "#1", "true"), 
        ["@Question{ask:true}", "@AnswerQuestion{answer:true,ask:#2}", "@Answer{answer:#2}"]
      );
      assert.sameDeepMembers(seq.specifyFeatureVariable(seqs[7], "#2", "false"), 
        ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:false}", "@Answer{answer:false}"]
      );
    });

  });


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
      ["$N{n,c,g}", "$V{n}", "$O{c:acc+dat+gen}"],
      ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:#2}", "@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#2}"],
      ["@Question{ask:#1}", "@Something{hello:#2}"],
      ["@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#3}"],
      ["@Answer{answer:2}", "@Something{hello:2}", "@Something{hello:2}"]
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

    //  5: ["@Question{ask:#1}", "@AnswerQuestion{answer:#1,ask:#2}", "@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#2}"],
    //  6: ["@Question{ask:#1}", "@Something{hello:#2}"],
    //  7: ["@Answer{answer:#2}", "@Something{hello:#2}", "@Something{hello:#3}"],
    //  8: ["@Answer{answer:2}", "@Something{hello:2}", "@Something{hello:2}"]

    it('should specify feature variables', function() {
      assert.sameDeepMembers(seq.specify(seqs[5], {answer: ["true", "false"], ask: ["true", "false"], hello: ["true", "false"],}), 
        [["@Question{ask:true}", "@AnswerQuestion{answer:true,ask:true}", "@Answer{answer:true}", "@Something{hello:true}", "@Something{hello:true}"],
        ["@Question{ask:true}", "@AnswerQuestion{answer:true,ask:false}", "@Answer{answer:false}", "@Something{hello:false}", "@Something{hello:false}"],
        ["@Question{ask:false}", "@AnswerQuestion{answer:false,ask:true}", "@Answer{answer:true}", "@Something{hello:true}", "@Something{hello:true}"],
        ["@Question{ask:false}", "@AnswerQuestion{answer:false,ask:false}", "@Answer{answer:false}", "@Something{hello:false}", "@Something{hello:false}"]]
      );
    });

  });

});
