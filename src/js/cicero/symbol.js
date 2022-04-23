/* Symbols are the elements that make up a sequence (words, sentences, dialogs or stories) 
 * defined by the grammar.
 *
 *  A symbol can be a
 *   - terminal (e.g. a word like "Haus" or a sentence "Ich kaufe ein.")
 *   - variable (i.e. a symbol found on the lefthand side of grammar rules, e.g. $NP, $VP, $S, $Det)
 *   - variable with feature structure (e.g. $NP{n:sg,p:1,c:acc,g:m}, $VP{n:sg+pl,n:2})
 *
 * Variables always start with "$", but on the lefthand side of grammar rules it is omitted.
 */

import { fromPairs, toPairs, equals, uniq, concat, keys, intersection, union, append } from 'rambda';
import { lift } from 'ramda';
import fs from './featureStructure.js';

function isVariable(symbol, prefix) {
	return (symbol[0] === prefix);
}


function isTerminal(symbol, prefix) {
	return !isVariable(symbol, prefix);
}

function isInGrammar(grammar, symbol) {
	return (isVariable(symbol, grammar.prefix) && grammar.rules[symbol.slice(1)]);
}

function name(symbol, prefix) {

    const startIndex = symbol[0] === prefix ? 1 : 0;
    const curlyIndex = symbol.indexOf("{");
    return curlyIndex > -1 ? symbol.substring(startIndex, curlyIndex) : symbol.substring(startIndex);

}

function setFeatureStructure(symbol, featureStructure) {
    const hasFS = symbol.match(/{.*}/);
    const fsString = fs.toString(featureStructure);

    return hasFS ? symbol.replace(/{.*}/, fsString) : symbol.concat(fsString);
}

function getFeatureStructure(symbol) {
    const matchedFS = symbol.match(/{.*}/);

    if (matchedFS) {
        return fs.fromString(matchedFS[0]);
    } else {
        return {};
    }
}

function expand(symbol) {
    const fStructure = getFeatureStructure(symbol);
    const hasFeatureStructure = Object.keys(fStructure).length > 0;

    if (hasFeatureStructure) {
        const fStructures = fs.expand(fStructure);
        return fStructures.map(f => setFeatureStructure(symbol, f));
    } else {
        return [symbol];
    }
}

function isSpecified(symbol) {
    return fs.isSpecified(getFeatureStructure(symbol));
}

function unspecifiedAttributes(symbol) {
    return fs.unspecifiedAttributes(sym.getFeatureStructure(symbol));
}

export default {
	isTerminal,
	isVariable,
	isInGrammar,
    name,
    setFeatureStructure,
    getFeatureStructure,
    expand,
    isSpecified,
    unspecifiedAttributes
}