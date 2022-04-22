import g from './../grammar.js';
import grammar from "./grammars/bigGrammar.js";
import grammar2 from "./grammars/smallGrammar.js";
import grammar3 from "./grammars/verySmallGrammar.js";
import grammar4 from "./grammars/smalltalk.js";
import grammar5 from "./grammars/smalltalk2.js";
import { uniq } from 'ramda';

import { assert } from 'chai';

describe('grammar', function() {

  describe('matchSymbol()', function() {

    it('should find exact matches with specified features', function() {
      assert.deepEqual(
        g.matchSymbol(grammar, "$NP{p:1,n:sg,c:nom,class:person}"),
        ["$NP{p:1,n:sg,c:nom,class:person}"]
      );
      assert.deepEqual(
        g.matchSymbol(grammar, "$NP{p:3,n:pl,class:person}"),
        ["$NP{p:3,n:pl,class:person}"]
      );
      assert.deepEqual(
        g.matchSymbol(grammar, "$Det{n:sg,g:m,c:acc,s:def}"),
        ["$Det{n:sg,g:m,c:acc,s:def}"]
      );
      assert.deepEqual(
        g.matchSymbol(grammar, "$A{n:sg,g:m,c:nom,s:ind}"),
        ["$A{n:sg,g:m,c:nom,s:ind}"]
      );
      
    });

    it('should find matches with unspecified features', function() {

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{c:acc}"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{p,n,c:acc}"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{p,n}"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{p}"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{}"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P"),
        ["$P{p,n}", "$P{g}", "$P{p,n,c:acc}", "$P{g,c:acc}"]
      );
      
    });

    it('should exclude symbols that have contradicting feature values', function() {

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{c:nom}"),
        ["$P{p,n}", "$P{g}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$P{p,n,c:nom}"),
        ["$P{p,n}", "$P{g}"]
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$A{n:sg,g:m,c:gen,s:ind}"),
        []
      );

      assert.deepEqual(
        g.matchSymbol(grammar, "$NP{p:1,n:sg,c:nom,class:animal}"),
        []
      );
      
    });

    it('should include symbols whose feature values are not in contradiction', function() {

      assert.sameMembers(
        g.matchSymbol(grammar, "$V{p:2,n:sg}"), [
          "$V{p:2,n:sg}",
          "$V{p:2+3,n:sg,class:food}",
          "$V{p:2+3,n:sg,class:text}",
          "$V{p:2,n:sg,class:text}"
        ]
      );

      assert.sameMembers(
        g.matchSymbol(grammar, "$V{p:2+3,n:sg}"), [
          "$V{p:2,n:sg}",
          "$V{p:2+3,n:sg,class:food}",
          "$V{p:2+3,n:sg,class:text}",
          "$V{p:2,n:sg,class:text}",
          "$V{p:3,n:sg}",
          "$V{p:3,n:sg,class:text}"
        ]
      );
      
    });

    it('should find matches whose feature structures have additional attributes', function() {
      assert.deepEqual(
        g.matchSymbol(grammar, "$Det{n:sg,g:m}"),
        [
          "$Det{n:sg,g:m,c:nom,s:def}",
          "$Det{n:sg,g:m,c:nom,s:ind}",
          "$Det{n:sg,g:m,c:acc,s:def}",
          "$Det{n:sg,g:m,c:acc,s:ind}"
        ]
      );
    });

  });

  describe('expandSymbol()', function() {

    it('should expand symbols that are found in the grammar without passing a feature structure', function() {
      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Start"),
        [
          ["$Statement"],
          ["$Question"]
        ]
      );
    });

    it('should ignore feature structure if ununifiable', function() {
      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$NP{p:1,n:sg,c:nom,class:person}"),
        [
          ["ich"]
        ]
      );

      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$NP{p:1,n:sg,c:nom,class:person}", {n: ["pl"], p: ["1"]}),
        [
          ["ich"]
        ]
      );
    });

   
    it('should return a list of sequences with all features from the feature structure specified', function() {
      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Question"),
        [
          ["$V{p,n,class}", "$NP{p,n,c:nom,class:person}", "$NP{c:acc,class}", "?"]
        ]
      );

      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Question", {n: ["pl"]}),
        [
          ["$V{p,n:pl,class}", "$NP{p,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"]
        ]
      );

      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Question", {n: ["sg","pl"]}),
        [
          ["$V{p,n:sg,class}", "$NP{p,n:sg,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p,n:pl,class}", "$NP{p,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"]
        ]
      );

      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Question", {n: ["sg","pl"], p:["1", "2"]}),
        [
          ["$V{p:1,n:sg,class}", "$NP{p:1,n:sg,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:1,n:pl,class}", "$NP{p:1,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:2,n:sg,class}", "$NP{p:2,n:sg,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:2,n:pl,class}", "$NP{p:2,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"]
        ]
      );

      assert.sameDeepMembers(
        g.expandSymbol(grammar, "$Question", {n: ["sg","pl"], p:["1", "2"], c:["gen"]}),
        [
          ["$V{p:1,n:sg,class}", "$NP{p:1,n:sg,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:1,n:pl,class}", "$NP{p:1,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:2,n:sg,class}", "$NP{p:2,n:sg,c:nom,class:person}", "$NP{c:acc,class}", "?"],
          ["$V{p:2,n:pl,class}", "$NP{p:2,n:pl,c:nom,class:person}", "$NP{c:acc,class}", "?"]
        ]
      );
    });

  });

  describe('expandLeft()', function() {

    it('should return the sequence if begins with a terminal', function() {
      assert.deepEqual(
        g.expandLeft(grammar, ["Peter", "$NP{p:1,n:sg,c:nom,class:person}"]),
        [
          ["Peter", "$NP{p:1,n:sg,c:nom,class:person}"]
        ]
      );
    });

    it('should return the associated terminal if the symbol is a preterminal', function() {
      assert.deepEqual(
        g.expandLeft(grammar, ["$NP{p:1,n:sg,c:nom,class:person}"]),
        [
          ["ich"]
        ]
      );
    });

    it('should return all associated terminals if the symbol can be matched with several symbols in the grammar', function() {
      assert.deepEqual(
        g.expandLeft(grammar, ["$Det{n:sg,g:m}"]),
        [
          ["der"],
          ["ein"],
          ["den"],
          ["einen"]
        ]
      );
    });

    it('should return all verbs if sequence defines a question', function() {
      assert.sameMembers(
        [...uniq(g.expandLeft(grammar, ["$Question"]).map(s => s[0]))],
        [
          "liebe",
          "liebst",
          "liebt",
          "lieben",
          "esse",
          "isst",
          "essen",
          "esst",
          "lese",
          "liest",
          "lesen",
          "lest",
          "schreibe",
          "schreibst",
          "schreibt",
          "schreiben"
        ]
      );
    });

  });


  describe('specify()', function() {

    it('should work (write tests later)', function() {
      //assert.deepEqual(
      //  g.specify(grammar5),
      //  {}
      //);
    });

  });

});
