export default {
	"prefix": "$",
	"features": {
		"p": ["1", "2", "3"],
		"n": ["sg", "pl"],
		"g": ["m", "n", "f"],
		"c": ["nom", "acc"],
		"s": ["def", "ind"],
		"class": ["person", "food", "text"]
	},
	"separator": " ",
	"rules": {
		"Start": [
			"$Statement",
			"$Question"
		],
		"Statement": [
			"$NP{p,n,c:nom,class:person} $V{p,n,class} $NP{c:acc,class} ."
		],
		"Question": [
			"$V{p,n,class} $NP{p,n,c:nom,class:person} $NP{c:acc,class} ?"
		],
		"NP{p:1,n:sg,c:nom,class:person}": [
			"ich"
		],
		"NP{p:1,n:pl,c:nom,class:person}": [
			"wir"
		],
		"NP{p:2,n:sg,c:nom,class:person}": [
			"du"
		],
		"NP{p:2,n:pl,c:nom,class:person}": [
			"ihr"
		],
		"NP{p:3,n:sg,g:m,c:nom,class:person}": [
			"er"
		],
		"NP{p:3,n:sg,g:m,c:acc,class:person}": [
			"ihn"
		],
		"NP{p:3,n:sg,g:f,class:person}": [
			"sie"
		],
		"NP{p:3,n:sg,g:n,class:person}": [
			"es"
		],



		"NP{p:3,n:pl,class:person}": [
			"sie"
		],


		"NP{p:1,n:sg,c:acc,class:person}": [
			"mich"
		],
		"NP{p:1,n:pl,c:acc,class:person}": [
			"uns"
		],
		"NP{p:2,n:sg,c:acc,class:person}": [
			"dich"
		],
		"NP{p:2,n:pl,c:acc,class:person}": [
			"euch"
		],
		"NP{p:3,n:sg,c,class:food}": [
			"$Det{n:sg,g,c} $N{n:sg,g,c,class:food}",
			"$Det{n:sg,g,c,s} $A{n:sg,g,c,s} $N{n:sg,g,c,class:food}"
		],
		"NP{p:3,n:pl,class:text}": [
			"$N{n:pl,class:text}",
			"$A{n:pl,s:ind} $N{n:pl,class:text}",
			"$Det{n:pl,s:def} $A{n:pl,s:def} $N{n:pl,class:text}"
		],


		"Det{n:sg,g:m,c:nom,s:def}": [
			"der"
		],
		"Det{n:sg,g:m,c:nom,s:ind}": [
			"ein"
		],
		"Det{n:sg,g:m,c:acc,s:def}": [
			"den"
		],
		"Det{n:sg,g:m,c:acc,s:ind}": [
			"einen"
		],


		"Det{n:sg,g:f,s:def}": [
			"die"
		],
		"Det{n:sg,g:f,s:ind}": [
			"eine"
		],		

		"Det{n:sg,g:n,s:def}": [
			"das"
		],
		"Det{n:sg,g:n,s:ind}": [
			"ein"
		],

		"Det{n:pl,s:def}": [
			"die"
		],

		"A{n:sg,c:nom,s:def}": [
			"schöne",
			"gute",
			"alte",
			"neue"
		],

		"A{n:sg,c:acc,g:f+n,s:def}": [
			"schöne",
			"gute",
			"alte",
			"neue"
		],

		"A{n:sg,c:acc,g:m}": [
			"schönen",
			"guten",
			"alten",
			"neuen"
		],

		"A{n:sg,g:m,c:nom,s:ind}": [
			"schöner",
			"guter",
			"alter",
			"neuer"
		],


		"A{n:sg,g:f,s:ind}": [
			"schöne",
			"gute",
			"alte",
			"neue"
		],

		"A{n:sg,g:n,s:ind}": [
			"schönes",
			"gutes",
			"altes",
			"neues"
		],


		"A{n:pl,s:def}": [
			"schönen",
			"guten",
			"alten",
			"neuen"
		],

		"A{n:pl,s:ind}": [
			"schöne",
			"gute",
			"alte",
			"neue"
		],


		"N{n:sg,g:m,class:food}": [
			"Apfel"
		],
		"N{n:sg,g:m,class:other}": [
			"Brief",
			"Aufsatz",
			"Essay"
		],
		"N{n:sg,g:f,class:other}": [
			"Novelle",
			"Geschichte",
			"Literatur"
		],
		"N{n:sg,g:n,class:other}": [
			"Buch",
			"Gedicht"
		],
		"N{n:sg,g:f,class:food}": [
			"Banane",
			"Kiwi",
			"Papaya"
		],
		"N{n:pl,class:food}": [
			"Kuchen",
			"Bananen",
			"Brot",
			"Äpfel"
		],
		"N{n:pl,class:other}": [
			"Bücher",
			"Zeitungen",
			"Postkarten",
			"Gedichte"
		],

		"V{p:1,n:sg}": [
			"liebe"
		],
		"V{p:2,n:sg}": [
			"liebst"
		],
		"V{p:3,n:sg}": [
			"liebt"
		],
		"V{p:1+3,n:pl}": [
			"lieben"
		],
		"V{p:2,n:pl}": [
			"liebt"
		],
		"V{p:1,n:sg,class:food}": [
			"esse"
		],
		"V{p:2+3,n:sg,class:food}": [
			"isst"
		],
		"V{p:1+3,n:pl,class:food}": [
			"essen"
		],
		"V{p:2,n:pl,class:food}": [
			"esst"
		],
		"V{p:1,n:sg,class:text}": [
			"lese",
			"schreibe"
		],
		"V{p:2+3,n:sg,class:text}": [
			"liest"
		],
		"V{p:1+3,n:pl,class:text}": [
			"lesen",
			"schreiben"
		],
		"V{p:2,n:pl,class:text}": [
			"lest",
			"schreibt"
		],
		"V{p:2,n:sg,class:text}": [
			"schreibst"
		],
		"V{p:3,n:sg,class:text}": [
			"schreibt"
		],

		// Fake data for testing matching algorithm

		"P{p,n}": [
			"für"
		],

		"P{g}": [
			"gegen"
		],
		"P{p,n,c:acc}": [
			"mit"
		],

		"P{g,c:acc}": [
			"um"
		]

	}
}