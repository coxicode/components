export default {
	"prefix": "$",
	"features": {
		"class": ["person", "food", "text"],
		"n": ["sg", "pl"]
	},
	"separator": " ",
	"rules": {
		"Start": [
			"$Statement",
			"$Question"
		],
		"Statement": [
			"$N{class:person,n} $V{class,n} $N{class}"
		],
		"Question": [
			"$V{n} $N{class:person,n} $N"
		],	
		"N{class:person,n:sg}": [
			"Der Mensch",
			"Das Tier"
		],
		"V{class:text,n:pl}": [
			"schreiben",
			"lesen"
		],
		"P{n}": [
			"für"
		]
	}
}