export default {
	"prefix": "@",
	"separator": " ",
	"rules": {

		"Question{topic:name}": [
			"wie heißt du ?",
			"wie ist dein Name ?",
			"wer bist du ?"
		],
		"Answer{topic:name}": [
			"ich heiße @Name .",
			"mein Name ist @Name .",
			"ich bin @Name ."
		],
		"Answer+Question{topic:name}": [
			"ich heisse @Name . Und du ?",
			"mein Name ist @Name . Und wie ist dein Name ?",
			"ich bin @Name . Und du ?"
		],

		"Question{topic:weather}": [
			"wie ist das Wetter ?"
		],
		"Answer+Question{topic:weather}": [
			"super, und bei dir ?",
			"nicht so gut, und bei dir ?"
		],
		"Answer{topic:weather}": [
			"toll !",
			"es geht so ."
		],

		"Greeting": [
			"hallo !",
			"hi !",
			"guten Morgen !",
			"guten Tag !",
			"guten Abend !"
		],
		"Goodbye": [
			"tschüss !",
			"auf Wiedersehen !",
			"bis bald !",
			"mach's gut !",
			"ciao !",
			"gute Nacht !"
		],

		"Name": [
			"Fridolin",
			"Mathilde"
		]
	}
}