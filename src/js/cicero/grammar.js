import { mergeRight, includes, lift, unnest, concat, toPairs, fromPairs, prepend, assoc, append, pick } from 'ramda';
import sym from './symbol.js';
import fs from './featureStructure.js';
import seq from './sequence.js';


function print(grammar) {
	const rules = Object.entries(grammar.rules);

	//console.log( { rules });

	function listRule([symbol, expansions]) {
		return `${symbol} -> ${expansions.join(" | ")}`;
	}

	return unnest(rules.map(listRule));
}


function symbols(grammar) {
	return Object.keys(grammar.rules);
}


// Look up variable in the grammar and generate all possible variants with categories fill with available values
function matchSymbol(grammar, symbol) {

	//console.log({ symbol });
	
	if (sym.isTerminal(symbol, grammar.prefix)) return [symbol];

	const symbolFS = fs.fromString(symbol);

	const matchedSymbols = symbols(grammar).filter(grammarSymbol => {
		const haveSameName = (sym.name(grammarSymbol, grammar.prefix) === sym.name(symbol, grammar.prefix));
		const grammarFS = fs.fromString(grammarSymbol);
		const areUnifiable = fs.areUnifiable(symbolFS, grammarFS);

		return haveSameName && areUnifiable;
	});

	return matchedSymbols.map(v => grammar.prefix + v);

}

function featureValues(grammar, feature) {
	return grammar.features[feature] || [];
}


// Expand a symbol that is part of the grammar. The passed feature structure will be unified
// with the symbol's feature structure and the result will be passed to each associated sequence
// specifying all unspecified features (those that need to agree)
function expandSymbol(grammar, symbol, featureStructure) {

	const strings = grammar.rules[symbol.slice(1)] || [];
	const sequences = strings.map(s => seq.fromString(s, grammar.separator));
	return unnest(lift(seq.specify)(sequences, [featureStructure]));

}


// Expand a list of symbols until the first symbol is a terminal
// Returns a list of sequences
function expandLeft(grammar, sequence) {

	function specify(sequence) {
		return seq.specify(sequence, grammar.features);
	}

	function expand(sequence) {
		const firstSymbol = sequence[0];
		const restOfSequence = sequence.slice(1);
		const firstFS = fs.fromString(firstSymbol);
		const matchedSymbols = matchSymbol(grammar, firstSymbol);
		const firstSequences = unnest(lift(expandSymbol)([grammar], matchedSymbols, [firstFS]));
		//console.log({ firstSequences })
		//console.log({ restOfSequence })
		return lift(concat)(firstSequences, [restOfSequence]);
	}

	//console.log({ sequence });

	if (!sequence || sequence.length === 0) {
		return [];

	} else if (sym.isTerminal(sequence[0], grammar.prefix)) {
		return [sequence];

	} else {
		const sequences = seq.isSpecified(sequence) ? expand(sequence) : specify(sequence);
		//console.log({ sequences })
		return unnest(lift(expandLeft)([grammar], sequences));
	}
}


function removeFirstSymbol(sequence) {
	return sequence.slice(1);		
}

// Returns a list of the first terminals of all trees in a given list
// Attention: Removes duplicates!
function getFirstSymbols(sequences) {
	return [...new Set(sequences.map(s => s[0]))];
}

// Each sequence is tagged with a class (string). This tag is preserved during expansion of the sequence.
// So later it is known where the generated sequences originated from (looking at their classes)
function nextSequences(grammar, sequencesWithSymbol) {

	return unnest(sequencesWithSymbol.map(
		s => expandLeft(grammar, s.sequence).map(e => ({symbol: s.symbol, sequence: e}))
	));
}

function selectSequences(sequencesWithSymbol, firstTerminal) {

	return sequencesWithSymbol.filter(s => s.sequence[0] === firstTerminal).map(
		s => ({symbol: s.symbol, sequence: s.sequence.slice(1)})
	);

}


function isPossible(grammar, symbol) {


	if (sym.isTerminal(symbol, grammar.prefix)) return true;

	const matchedSymbols = matchSymbol(grammar, symbol);

	if (matchedSymbols.length === 0) return false;

	const matchedSymbolSequences = matchedSymbols.map(s => [symbol, expandSymbol(grammar, s)]);

	//console.log("--- isPossible ---")
	//console.log({ symbol, matchedSymbols, matchedSymbolSequences })

	return 0 < unnest(matchedSymbolSequences.filter(
		s => s && (s[1] && (s[1].length > 0))
	).map(s => specifyRule(grammar, s))).length;

}



// Returns an object with specified symbols as keys and there associated sequences as values.
function specifyRule(grammar, [symbol, sequences]) {
	function isTerminal(sequence) {
		return sequence.length === 1 && sym.isTerminal(sequence[0], grammar.prefix);
	}

	function specifySequence(sequence) {
		const symbolSequence = prepend(symbol, sequence);
		const unspecifiedAttributes = seq.unspecifiedAttributes(symbolSequence);

		const featureStructure = pick(unspecifiedAttributes, grammar.features);

		return seq.specify(symbolSequence, featureStructure);
	}

	if (sequences.length === 0) return [];

	if ((sequences.length > 0) && sequences.every(s => s.length === 1 && isTerminal(s[0]))) return [[symbol, sequences]];


	const specifiedSymbolSequences = unnest(sequences.map(specifySequence));

	const possibleSymbolSequences = specifiedSymbolSequences.filter(
		s => {
			const sequence = s.slice(1);
			return (sequence.length > 0) && sequence.every(symbol => isPossible(grammar, symbol));
		}
	);

	const filteredRules = possibleSymbolSequences.reduce(
		(acc, s) => {
			const symbol = s[0];
			const sequence = s.slice(1);
			const sequences = (acc[symbol] && !includes(sequence, acc[symbol])) ? append(sequence, acc[symbol]) : [sequence];
			return assoc(symbol, sequences, acc);
		},
		{}
	);

	////console.log( {
	//	symbol,
	//	sequences,
	//	specifiedSymbolSequences,
	//	possibleSymbolSequences,
	//	filteredRules
	//})

	return toPairs(filteredRules);

}


function specify(grammar) {
	const rules = toPairs(grammar.rules);

	const specifiedRules = rules.reduce(
		(newRules, rule) => {
			const symbol = grammar.prefix + rule[0];
			const sequences = rule[1].map(s => seq.fromString(s, grammar.separator));
			const symbolRules = specifyRule(grammar, [symbol, sequences]).map(
				r => {
					const symbol = r[0].slice(1);
					const sequences = r[1].map(s => seq.toString(s, grammar.separator));
					return [symbol, sequences];
				}
			);
			return mergeRight(newRules, fromPairs(symbolRules));
		},
		{}
	);

	const specifiedGrammar = assoc("rules", specifiedRules, grammar);

	//console.log({ specifiedGrammar })
	return specifiedGrammar;

}

export default {
	matchSymbol,
	expandSymbol,
	expandLeft,
	nextSequences,
	selectSequences,
	getFirstSymbols,
	print,
	specify
}