import fs from './../featureStructure.js';
import { assert } from 'chai';

describe('featureStructure', function() {

  describe('fromString()', function() {

    const fStrings = [
      "$N{n:sg}",
      "{n:sg}",
      "{n:sg,p:1}",
      "{n:sg,p:1+2}",
      "{n:sg+pl,p:1+2}",
      "{n:  sg+ pl,p:1+2 }",
      "$N  {  n:  sg +   pl  , p  : 1 + 2   }  ",
      "$N{n}",
      "$N{}",
      "$N",
      ""
    ];

    it('should identify feature structures between { }', function() {
      assert.deepEqual(fs.fromString(fStrings[0]), {n: ["sg"]});
      assert.deepEqual(fs.fromString(fStrings[1]), {n: ["sg"]});
    });

    it('should handle multiple attribute-value-pairs', function() {
      assert.deepEqual(fs.fromString(fStrings[2]), {n: ["sg"], p: ["1"]});
    });

    it('should handle multiple values per feature', function() {
      assert.deepEqual(fs.fromString(fStrings[3]), {n: ["sg"], p: ["1", "2"]});
      assert.deepEqual(fs.fromString(fStrings[4]), {n: ["sg", "pl"], p: ["1", "2"]});
    });

    it('should handle whitespace in strings', function() {
      assert.deepEqual(fs.fromString(fStrings[5]), {n: ["sg","pl"], p: ["1", "2"]});
      assert.deepEqual(fs.fromString(fStrings[6]), {n: ["sg", "pl"], p: ["1", "2"]});
    });

    it('should handle features structure without values', function() {
      assert.deepEqual(fs.fromString(fStrings[7]), {n: []});
    });

    it('should handle feature structures without attributes', function() {
      assert.deepEqual(fs.fromString(fStrings[8]), {});
      assert.deepEqual(fs.fromString(fStrings[9]), {});
    });

    it('should handle empty strings', function() {
      assert.deepEqual(fs.fromString(fStrings[10]), {});
    });

  });

  describe('toString()', function() {

    it('should convert empty feature structures to empty strings', function() {
      assert.equal(fs.toString({}), "");
    });

    it('should handle attribute-value-pairs', function() {
      assert.equal(fs.toString({n: ["sg"]}), "{n:sg}");
    });

    it('should handle multiple attribute-value-pairs', function() {
      assert.equal(fs.toString({n: ["sg"], p: ["1"]}), "{n:sg,p:1}");
    });

    it('should handle multiple values per feature', function() {
      assert.equal(fs.toString({n: ["sg"], p: ["1", "2"]}), "{n:sg,p:1+2}");
      assert.equal(fs.toString({n: ["sg", "pl"], p: ["1", "2"]}), "{n:sg+pl,p:1+2}");
    });

    it('should handle features without values', function() {
      assert.equal(fs.toString({n: []}), "{n}");
      assert.equal(fs.toString({p:["1"],n: []}), "{p:1,n}");
      assert.equal(fs.toString({p:[],n: ["sg","pl"]}), "{p,n:sg+pl}");
    });

  });


  describe('unify()', function() {

    const f = [
      {n:["sg"]},
      {n:[]},
      {n:[]},
      {n:["sg"],p:["1"]},
      {p:["1"]},
      {p:["2"]},
      {n:["pl"],p:["1"]},
      {n:["sg"],p:["2"]},
      {n:["sg","pl"],p:["1","2"]},
      {n:[],p:[]},
      {p:[]},
      {},
      {n:["sg"],p:[]},
      {p:[fs.IMPOSSIBLE]},
      {n:[fs.IMPOSSIBLE],p:["1"]},
      {n:[fs.IMPOSSIBLE],p:[fs.IMPOSSIBLE]},
      {n:["sg"],g:["m"],c:["nom"],s:["def"]},
      {n:["sg"],g:["m"]},
    ];

    it('should unify identical feature structures to themselves', function() {
      f.forEach(fx => assert.deepEqual(fs.unify(fx, fx), fx))
    });

    it('should handle feature structures with agreement', function() {
      assert.deepEqual(fs.unify(f[0], f[1]), f[0])
    });

    it('should handle feature structures where one is a subsumed in the other', function() {
      assert.deepEqual(fs.unify(f[3], f[4]), f[3])
      assert.deepEqual(fs.unify(f[6], f[8]), f[6])
      assert.deepEqual(fs.unify(f[7], f[8]), f[7])
      assert.deepEqual(fs.unify(f[16], f[17]), f[16])
    });

    it('should handle cases where one feature needs to agree while the other is not defined', function() {
      assert.deepEqual(fs.unify(f[0], f[10]), f[12])
      assert.deepEqual(fs.unify(f[10], f[0]), f[12])
    });

    it('should handle feature structures where all features need to agree', function() {
      assert.deepEqual(fs.unify(f[9], f[10]), f[9])
    });

    it('should mark impossible unifications', function() {
      assert.deepEqual(fs.unify(f[4], f[5]), f[13])
      assert.deepEqual(fs.unify(f[6], f[12]), f[14])
      assert.deepEqual(fs.unify(f[6], f[7]), f[15])
    });

  });

  describe('specifiedAttributes()', function() {

    const f = [
      {n:["sg"]},
      {n:[]},
      {n:[]},
      {n:["sg"],p:["1"]},
      {p:["1"]},
      {p:["2"]},
      {n:["pl"],p:["1"]},
      {n:["sg"],p:["2"]},
      {n:["sg","pl"],p:["1","2"]},
      {n:[],p:[]},
      {p:[]},
      {},
      {n:["sg"],p:[]},
      {p:[fs.IMPOSSIBLE]},
      {n:[fs.IMPOSSIBLE],p:["1"]},
      {n:[fs.IMPOSSIBLE],p:[fs.IMPOSSIBLE]}
    ];

    it('should return an empty list if the feature structure has no attributes', function() {
      assert.deepEqual(fs.specifiedAttributes(f[11]), [])
    });

    it('should return a list of all attributes with exactly one value', function() {
      assert.deepEqual(fs.specifiedAttributes(f[0]), ["n"])
      assert.deepEqual(fs.specifiedAttributes(f[3]), ["n","p"])
      assert.deepEqual(fs.specifiedAttributes(f[4]), ["p"])
      assert.deepEqual(fs.specifiedAttributes(f[6]), ["n", "p"])
      assert.deepEqual(fs.specifiedAttributes(f[7]), ["n", "p"])
    });

    it('should not return attributes with more than one value', function() {
      assert.deepEqual(fs.specifiedAttributes(f[8]), [])
    });

    it('should not return unspecified attributes', function() {
      assert.deepEqual(fs.specifiedAttributes(f[1]), [])
      assert.deepEqual(fs.specifiedAttributes(f[9]), [])
      assert.deepEqual(fs.specifiedAttributes(f[10]), [])
    });

    it('should not return impossible attributes', function() {
      assert.deepEqual(fs.specifiedAttributes(f[13]), [])
      assert.deepEqual(fs.specifiedAttributes(f[14]), ["p"])
      assert.deepEqual(fs.specifiedAttributes(f[15]), [])
    });

  });


  describe('attributes()', function() {

    const f = [
      {n:["sg"]},
      {n:[]},
      {n:[]},
      {n:["sg"],p:["1"]},
      {p:["1"]},
      {p:["2"]},
      {n:["pl"],p:["1"]},
      {n:["sg"],p:["2"]},
      {n:["sg","pl"],p:["1","2"]},
      {n:[],p:[]},
      {p:[]},
      {},
      {n:["sg"],p:[]},
      {p:[fs.IMPOSSIBLE]},
      {n:[fs.IMPOSSIBLE],p:["1"]},
      {n:[fs.IMPOSSIBLE],p:[fs.IMPOSSIBLE]}
    ];

    it('should return an empty list if the feature structure has no attributes', function() {
      assert.deepEqual(fs.attributes(f[11]), [])
    });

    it('should return a list of all attributes independent of their values', function() {
      assert.deepEqual(fs.attributes(f[0]), ["n"])
      assert.deepEqual(fs.attributes(f[1]), ["n",])
      assert.deepEqual(fs.attributes(f[3]), ["n","p"])
      assert.deepEqual(fs.attributes(f[4]), ["p"])
      assert.deepEqual(fs.attributes(f[8]), ["n", "p"])
      assert.deepEqual(fs.attributes(f[12]), ["n", "p"])
      assert.deepEqual(fs.attributes(f[13]), ["p"])
      assert.deepEqual(fs.attributes(f[14]), ["n","p"])
      assert.deepEqual(fs.attributes(f[15]), ["n","p"])
    });

  });

  describe('expand()', function() {

    const f = [
      {p:["3"]},
      {n:[]},
      {n:["sg","pl"],c:["acc"],g:[]},
      {n:["sg"],c:["acc","nom","gen"],g: ["m","f"]}
    ];

    it('should do nothing if there are no partially specified features', function() {
      assert.sameDeepMembers(fs.expand(f[0]), [{p:["3"]}]);
      assert.sameDeepMembers(fs.expand(f[1]), [{n:[]}]);
    });

    it('should only expand partially specified features', function() {
      assert.sameDeepMembers(fs.expand(f[2]), [
        {n:["sg"],c:["acc"],g:[]},
        {n:["pl"],c:["acc"],g:[]}
      ]);
      assert.sameDeepMembers(fs.expand(f[3]), [
        {n:["sg"],c:["acc"],g:["m"]},
        {n:["sg"],c:["nom"],g:["f"]},
        {n:["sg"],c:["gen"],g:["m"]},
        {n:["sg"],c:["acc"],g:["f"]},
        {n:["sg"],c:["nom"],g:["m"]},
        {n:["sg"],c:["gen"],g:["f"]}
      ]);
    });

  });

});