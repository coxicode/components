import { includes, concat, fromPairs, prepend, assoc, append, pick } from 'rambda';
import { lift, unnest, mergeRight, toPairs } from 'ramda';
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


// Look up variable in the grammar and generate all possible variants with categories filled with available values
function matchSymbol(grammar, symbol) {

	//console.log({ symbol });
	
	if (sym.isTerminal(symbol, grammar.prefix)) return [symbol];

	const symbolFS = fs.fromString(symbol);

	const matchedSymbols = symbols(grammar).reduce((matched, grammarSymbol) => {
		//console.log({matched})
		const haveSameName = (sym.name(grammarSymbol, grammar.prefix) === sym.name(symbol, grammar.prefix));
		if (!haveSameName) {
			return matched;
		} else {
			const grammarFS = grammar.featureStructures ? grammar.featureStructures[grammarSymbol] : fs.fromString(grammarSymbol);
			const areUnifiable = fs.areUnifiable(symbolFS, grammarFS);
			if (areUnifiable) {
				return [...matched, `${grammar.prefix}${grammarSymbol}`];
			} else {
				return matched;
			}
		}
	}, []);

	//console.log({ matchedSymbols })

	return matchedSymbols;

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
	const specifiedSequences = unnest(lift(seq.specify)(sequences, [featureStructure]));

	if (symbol === "$Discussion{topic:mood,type,discussion_type:#1}") {
		//console.log({ strings, sequences, specifiedSequences })
	}

	return specifiedSequences;

}


// Expand a list of symbols until the first symbol is a terminal
// Returns a list of sequences
function expandLeft(grammar, sequence) {

	//console.log({sequence})

	function specify(sequence) {
		return seq.specify(sequence, grammar.features);
	}

	function expand(sequence) {
		const firstSymbol = sequence[0];
		const restOfSequence = sequence.slice(1);
		const firstFS = fs.fromString(firstSymbol);
		const matchedSymbols = matchSymbol(grammar, firstSymbol);
		const firstSequences = unnest(lift(expandSymbol)([grammar], matchedSymbols, [firstFS]));
		//console.log({ firstSequences, restOfSequence })
		return lift(concat)(firstSequences, [restOfSequence]);
	}

	//console.log(sequence.join(" + "));

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

// Expand sequence of symbols step by step randomly choosing one possible next terminal
// until the end of the sequence is reached.
// Return a single sequence, i.e. a list of terminals
function expandRandom(grammar, sequence) {

	function selectRandom(list) {
		const randomIndex = Math.floor(Math.random() * list.length);
	  	return list[randomIndex];
	}

	const possibleExpansions = expandLeft(grammar, sequence);

	if (possibleExpansions.length === 0) {
		return [];
	} else {
		const selectedExpansion = selectRandom(possibleExpansions);
		const firstTerminal = selectedExpansion[0];
		const followingTerminals = expandRandom(grammar, selectedExpansion.slice(1));

		//console.log({selectedTerminal: firstTerminal, selectedSequence: selectedExpansion, allSequences: possibleExpansions })

		return prepend(firstTerminal, followingTerminals);
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
	const symbols = ["$Begin", "$Discussion{topic:name}", "$Discussion{topic:mood}", "$End"]

	if (symbols.includes(symbol)) {
		//console.log({symbol})
	}

	if (sym.isTerminal(symbol, grammar.prefix)) return true;

	const matchedSymbols = matchSymbol(grammar, symbol);

	if (matchedSymbols.length === 0) return false;

	const matchedSymbolSequences = matchedSymbols.map(s => [symbol, expandSymbol(grammar, s)]);

	if (symbols.includes(symbol)) {
		//console.log({matchedSymbols, matchedSymbolSequences})
	}
	return 0 < unnest(matchedSymbolSequences.filter(
		s => s && (s[1] && (s[1].length > 0))
	).map(s => specifyRule(grammar, s))).length;

}



// Returns an object with specified symbols as keys and their associated sequences as values.
function specifyRule(grammar, [symbol, sequences]) {
	function isTerminal(sequence) {
		return sequence.length === 1 && sym.isTerminal(sequence[0], grammar.prefix);
	}

	function specifySequence(sequence) {
		const symbolSequence = prepend(symbol, sequence);
		const unspecified = seq.unspecifiedAttributes(symbolSequence);
		const variable = seq.variableAttributes(symbolSequence);
		const specifiable = unspecified.concat(variable);

		//console.log({specifiable})

		const featureStructure = pick(specifiable, grammar.features);

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

	if (symbol === "$Start") {

		/*console.log( {
			symbol,
			sequences,
			specifiedSymbolSequences,
			possibleSymbolSequences,
			filteredRules
		})*/
	}

	return toPairs(filteredRules);

}

// Need to call this to prune all rules that might lead into gardenpaths
// Also feature variables will be instantiated, i.e. S{size:#1} will become S{size:big}, S{size:small}
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

	const featureStructures = fromPairs(Object.keys(specifiedRules).map(symbol => [symbol, fs.fromString(symbol)]));

	const specifiedGrammar = assoc("rules", specifiedRules, grammar);
	const finalGrammar = assoc("featureStructures", featureStructures, specifiedGrammar);

	//console.log("--- ORIGINAL GRAMMAR ---")
	//console.log(JSON.stringify(grammar, null, 2))
	//console.log("--- FINAL GRAMMAR ---")
	//console.log(JSON.stringify(finalGrammar, null, 2))
	return finalGrammar;

}

export default {
	matchSymbol,
	expandSymbol,
	expandLeft,
	expandRandom,
	nextSequences,
	selectSequences,
	getFirstSymbols,
	print,
	specify
}