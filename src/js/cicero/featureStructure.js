/* Feature structures are represented as objects with attributes and lists of values.
 * Maybe in the future arbitrary objects / feature structures can be values too.
 *
 * Example:
 * 
 * {n: ["sg"], p: ["1", "3"]}
 *
 * Inside a sequence (string containing symbols of the grammar) they are written this way:
 *
 * {n:sg,p:1} so attached to a variable this yields: $N{n:sg,p:1}
 *
 * Multiple values are separated using +:
 *
 * {n:sg,p:1+2}
 * {c:nom+acc,p:1+2+3}
 *
 * The string representation is turned into an object using the parse function.
 * The opposite conversion is accomplished by calling toString.
 */

import { fromPairs, toPairs, equals, uniq, concat, keys, intersection, union, append } from 'rambda';
import { lift, unnest } from 'ramda';

const IMPOSSIBLE = "impossible";


function fromString(string) {

	const featuresMatch = string.match(/{(.+?)}/);

	if (!featuresMatch) return {};

	const featuresList = featuresMatch[1].split(",").map(f => {
		const [attribute, values] = f.split(":");
		return [attribute.trim(), values ? values.split("+").map(v => v.trim()) : [] ];
	});

	const filteredFeaturesList = featuresList.filter(f => {
		const [attribute, values] = f;
		return (attribute !== "") && (values.every(v => v !== ""));
	});

	return fromPairs(filteredFeaturesList);

}


function toString(fStructure) {

	const fStrings = toPairs(fStructure).map(p => {
		const [attribute, values] = p;
		return `${attribute}${values.length > 0 ? ":" : ""}${values.join("+")}`;
	});

	if (fStrings.length > 0) {
		return `{${fStrings.join(",")}}`;
	} else {
		return "";
	}

}

// Private helper function for unify
function unifyValues(vals1, vals2) {

	function intersect(vals1, vals2) {
		return vals1.filter(function(v) { return vals2.indexOf(v) !== -1;});
	}

	function unite(vals1, vals2) {
		const additional = vals2.filter(function(v) { return vals1.indexOf(v) === -1;});
		return vals1.concat(vals2);
	}

	if (!vals1 && !vals2) return undefined;

	vals1 = vals1 || [];
	vals2 = vals2 || [];

	if ((vals1.length > 0) && (vals2.length > 0)) {
		// One of the values is a feature variable
		if (vals1[0][0] === "#") return vals2;
		if (vals2[0][0] === "#") return vals1;

		const unification = intersect(vals1, vals2);

		if (unification.length > 0)	{
			return unification;
		} else {
			return [IMPOSSIBLE];
		}
	} else {
		return unite(vals1, vals2);
	}

}


// Unify feature structures
function unify(f1, f2) {
	const attributes = uniq(concat(keys(f1), keys(f2)));
	return fromPairs(attributes.map(
		a => [a, unifyValues(f1[a], f2[a])]
	));
}

function areUnifiable(f1, f2) {

	for (const [attribute1, values1] of Object.entries(f1)) {
		const values2 = f2[attribute1];

		if (!values1 || !values2) continue;
		if (values1.length === 0 || values2.length === 0) continue;

		const isVariable1 = (values1[0][0] === "#");
		const isVariable2 = (values2[0][0] === "#");

		if (isVariable1 || isVariable2) continue;

		// If intersection is empty, values are not unifiable
		if (values1.every(function(v) { return values2.indexOf(v) === -1;})) {
			return false;
		}
	}

	return true;
}


function specified(fStructure) {
	return fromPairs(specifiedAttributes(fStructure).map(a => [a, fStructure[a]]));
}


function attributes(fStructure) {
	return keys(fStructure);
}

// Return all occurring values independet of values they belong to
function values(fStructure) {
	return unnest(Object.values(fStructure));
}

function specifiedAttributes(fStructure) {
	const attributes = keys(fStructure);

	return attributes.filter(a => {
		const values = fStructure[a];
		return ((values.length === 1) && (values[0] !== IMPOSSIBLE && values[0][0] !== "#"));
	});
}

function unspecifiedAttributes(fStructure) {
	const attributes = keys(fStructure);
	return attributes.filter(a => {
		return fStructure[a].length === 0;
	});
}

function variableAttributes(fStructure) {
	const attributes = keys(fStructure);
	return attributes.filter(a => {
		const values = fStructure[a];
		return ((values.length === 1) && (values[0][0] === "#"));
	});
}

function isSpecified(fStructure) {
	return specifiedAttributes(fStructure).length === attributes(fStructure).length;
}


function expand(fStructure) {
    const features = toPairs(fStructure);

    const featuresList = features.reduce(
        (fList, feature) => {
            const [ attribute, values ] = feature;
            const separateFeatures = values.length === 0 ? [feature] : values.map(value => [attribute, [value]]);
            
            if (fList.length === 0) {
                return separateFeatures.map(f => [f]);
            } else {
                return lift(append)(separateFeatures, fList);
            }
        },
        []
    );

    return featuresList.map(f => fromPairs(f));

}

export default {
	fromString,
	toString,
	unify,
	unifyValues,
	attributes,
	values,
	specifiedAttributes,
	unspecifiedAttributes,
	variableAttributes,
	specified,
	IMPOSSIBLE,
	areUnifiable,
	expand,
	isSpecified
};