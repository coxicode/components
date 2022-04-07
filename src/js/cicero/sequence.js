/* A sequence is a list of symbols (variables with feature structures or terminals).
 * It represents a sentence or word or whatever type of structure the grammar defines.
 * Variables and terminals can be mixed. So a sequence does not have to be fully specified.
 * 
 * Examples:
 *
 * ["der", "Baum", "$V", "$A"]
 * ["$NP{c:nom}", "liebt", "$NP{c:acc}"]
 * ["$S", "$V", "$O"]
 * ["ich", "heiße", "Marie"]
 */

import { objOf, toPairs, flatten, unnest, uniq, assoc, lift, append, fromPairs } from 'ramda';
import sym from './symbol.js';
import fs from './featureStructure.js';


function fromString(string, separator) {
	return string.split(separator);
}


function toString(sequence, separator) {
	return sequence.join(separator);
}

// Creates a list of sequences with all possible value combinations from partially specified features.
// Unspecified features are left unchanged (as free variables)
// If you want to specify those features too, call specifyFeature before expanding the resulting sequence
function expand(sequence) {
	if (sequence.length === 0) return [];
	const firstSymbolExpanded = sym.expand(sequence[0]).map(s => [s]);
	return sequence.slice(1).reduce(
		(partialSequences, symbol) => lift(append)(sym.expand(symbol), partialSequences),
		firstSymbolExpanded
	);
}


// Return a single sequence with the given attribute specified to the given values.
// Only applies to unspecified features, fully or partially specified features are not changed.
// An unspecified feature represents a value that needs to agree. If you want to accept all possible
// values without agreement, list them all in the feature structure
// e.g. {p:1+2+3} instead of {p}
function specifyFeature(sequence, attribute, value) {

	return sequence.map(symbol => {
		const symbolFS = fs.fromString(symbol);
		const isUnspecified = fs.unspecifiedAttributes(symbolFS).includes(attribute);

		if (isUnspecified) {
			const newFS = assoc(attribute, [value], symbolFS);
			return sym.setFeatureStructure(symbol, newFS);
		} else {
			return symbol;
		}
	});	
}


// Generate a list of possible sequences setting features to all possible values
// The values of unspecified features are set in the given feature structure. They need to agree.
// So they are set to the same value in each generated sequence.
// To create all possiblities defined by the grammar, go ahead and create a features structure
// that contains all possible values and pass it to specify. That way this function does not
// depend on the grammar which is nice.
function specify(sequence, featureStructure) {
	const features = toPairs(featureStructure);

	function setValues(sequences, { attribute, values }) {
		return uniq(lift(specifyFeature)(sequences, [attribute], values));
	}

	return features.reduce(
		(seqs, feature) => setValues(seqs, {
				attribute: feature[0],
				values: feature[1]
		}),
		[sequence]
	);

}

function isSpecified(sequence) {
	return sequence.every(sym.isSpecified);
}

function unspecifiedAttributes(sequence) {
	const attributeLists = sequence.map(s => fs.unspecifiedAttributes(sym.getFeatureStructure(s)));
	return [...uniq(unnest(attributeLists))];
}

function unspecifiedFeatureStructure(sequence) {
	return fromPairs(unspecifiedAttributes(sequence).map(a => [a, []]));	
}


export default {
	fromString,
	toString,
	specifyFeature,
	specify,
	isSpecified,
	unspecifiedAttributes,
	unspecifiedFeatureStructure
}