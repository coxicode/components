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

import { objOf, toPairs, flatten, uniq, assoc, append, fromPairs} from 'rambda';
import { lift, unnest, intersection } from 'ramda';
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
		let symbolFS = fs.fromString(symbol); // Mutable for performance reasons
		const isUnspecified = symbolFS[attribute] && symbolFS[attribute].length === 0;

		if (isUnspecified) {
			//console.log({ symbolFS })
			symbolFS[attribute] = [value];
			//console.log({ symbolFS})
			return sym.setFeatureStructure(symbol, symbolFS);
		} else {
			return symbol;
		}
	});	
}


// Return a single sequence with the given feature variable specified to the given value.
// Feature variables always begin with a # followed by a number (so far only single digits, should be enough.
// They are used to implement agreement between features that have different names, i.e:
// $Question{ask:#1} $AnswerQuestion{answer:#1, ask:#2} $Answer{answer:#2}
// This way features with the same name can have separate agreement classes:
// $Question{ask:#1} $AnswerQuestion{answer:#1, ask:#2} $AnswerQuestion{answer:#2, ask:#3} $Answer{answer:#3}

function specifyFeatureVariable(sequence, featureVariable, value) {
	if (featureVariable[0] === "#") {
		return sequence.map(symbol => symbol.replaceAll(featureVariable, value));	
	} else {
		return sequence;
	}
}

// Return a list of all attributes that have a given value in a sequence.
// Used to find out which attributes are involved in agreement using feature variables
// I.e. S{name:#1} O{hello:#1} P{hello:#2}
// For #1 it returns ["name", "hello"]
// For #2 it returns ["hello"]
function getAttributes(sequence, value) {

	//console.log({sequence});

	return uniq(sequence.reduce((attributes, symbol) => {
		const symbolFS = fs.fromString(symbol);
		const symbolAttributes = fs.attributes(symbolFS).filter(a => symbolFS[a].includes(value));

		return attributes.concat(symbolAttributes);
	}, []));	

}


function getFeatureVariables(sequence) {

	return uniq(unnest(sequence.map(symbol => {
		const symbolFS = fs.fromString(symbol);
		const symbolValues = fs.values(symbolFS);
		return symbolValues.filter(symbol => symbol[0] === "#");
	})));	

}



// Generate a list of possible sequences setting features to all possible values
// The values of unspecified features are set in the given feature structure. They need to agree.
// So they are set to the same value in each generated sequence.
// To create all possiblities defined by the grammar, go ahead and create a feature structure
// that contains all possible values and pass it to specify. That way this function does not
// depend on the grammar which is nice.
function specify(sequence, featureStructure) {

	// First bind feature variables to all possible values provided in the given feature structure.
	// Then proceed as normal.

	const features = featureStructure ? toPairs(featureStructure) : [];

	const fVariables = getFeatureVariables(sequence);	// #1, #2, etc.

	// This implementation assumes all corresponding attributes can take the same set of values
	// So only the first attribute's potential values are checked. Actually determining the intersection
	// of all respective possible values would be more robust. However, in most use cases this should be enough.
	function possibleValues(featureVariable) {
		if (!featureStructure) return [featureVariable]
		const attributes = getAttributes(sequence, featureVariable);
		const valuesList = featureStructure[attributes[0]];
		return valuesList;
	}

	function setFeatureVariables(sequences, variable) {
		const possibleVals = possibleValues(variable);
		return uniq(unnest(sequences.map(seq => {
			return possibleVals.map(
				value => specifyFeatureVariable(seq, variable, value)
			);
		})));
	}

	const sequencesWithoutVariables = fVariables.reduce(
		setFeatureVariables,
		[sequence]
	);

	function setValues(sequences, { attribute, values }) {
		return uniq(lift(specifyFeature)(sequences, [attribute], values));
	}

	// Only features with normal values (not containing feature variables)
	const specifiedSequences = features.reduce(
		(seqs, feature) => setValues(seqs, {
				attribute: feature[0],
				values: feature[1]
		}),
		sequencesWithoutVariables
	);

	return specifiedSequences;

}

function isSpecified(sequence) {
	return sequence.every(sym.isSpecified);
}

function variableAttributes(sequence) {
	const attributeLists = sequence.map(s => fs.variableAttributes(sym.getFeatureStructure(s)));
	return [...uniq(unnest(attributeLists))];
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
	getAttributes,
	getFeatureVariables,
	specifyFeature,
	specifyFeatureVariable,
	specify,
	isSpecified,
	variableAttributes,
	unspecifiedAttributes,
	unspecifiedFeatureStructure
}