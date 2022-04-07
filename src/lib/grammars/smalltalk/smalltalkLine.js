export default {
	"prefix": "@",
	"separator": " ",
	"rules": {

		"Question{topic:name}": [
			"Wie heißt du ?",
			"Wie ist dein Name ?",
			"Wer bist du ?"
		],
		"Answer{topic:name}": [
			"Ich heiße @Name .",
			"Mein Name ist @Name .",
			"Ich bin @Name ."
		],
		"Answer+Question{topic:name}": [
			"Ich heiße @Name . Und du ?",
			"Mein Name ist @Name . Und wie ist dein Name ?",
			"Ich bin @Name . Und du ?"
		],

		"Question{topic:weather}": [
			"Wie ist das Wetter ?"
		],
		"Answer+Question{topic:weather}": [
			"Super, und bei dir ?",
			"Nicht so gut, und bei dir ?"
		],
		"Answer{topic:weather}": [
			"Toll !",
			"Es geht so ."
		],

		"Greeting": [
			"Hallo !",
			"Hi !",
			"Guten Morgen !",
			"Guten Tag !",
			"Guten Abend !"
		],
		"Goodbye": [
			"Tschüss !",
			"Auf Wiedersehen !",
			"Bis bald !",
			"Mach's gut !",
			"Ciao !",
			"Gute Nacht !"
		],

		"Name": [
			"Fridolin",
			"Mathilde"
		]
	}
}