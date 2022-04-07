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

import { fromPairs, toPairs, equals, uniq, concat, keys, intersection, union, lift, append } from 'ramda';

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
	if (!vals1 && !vals2) return undefined;

	vals1 = vals1 || [];
	vals2 = vals2 || [];

	if ((vals1.length > 0) && (vals2.length > 0)) {
		const unification = [...intersection(vals1, vals2)];

		if (unification.length > 0)	{
			return unification;
		} else {
			return [IMPOSSIBLE];
		}
	} else {
		return [...union(vals1, vals2)];
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
	return Object.values(unify(f1,f2)).every(v => !v.includes(IMPOSSIBLE));
}


function specified(fStructure) {
	return fromPairs(specifiedAttributes(fStructure).map(a => [a, fStructure[a]]));
}


function attributes(fStructure) {
	return keys(fStructure);
}


function specifiedAttributes(fStructure) {
	const attributes = keys(fStructure);

	return attributes.filter(a => {
		const values = fStructure[a];
		return ((values.length === 1) && (values[0] !== IMPOSSIBLE));
	});
}

function unspecifiedAttributes(fStructure) {
	const attributes = keys(fStructure);
	return attributes.filter(attribute => fStructure[attribute].length === 0);
}

function isSpecified(fStructure) {
	return unspecifiedAttributes(fStructure).length === 0;
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
	specifiedAttributes,
	unspecifiedAttributes,
	specified,
	IMPOSSIBLE,
	areUnifiable,
	expand,
	isSpecified
};