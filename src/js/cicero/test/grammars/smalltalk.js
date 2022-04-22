export default {
	"prefix": "$",
	"features": {
		"topic": ["weather", "food", "work"],
		"name1": ["Fridolin", "Maria", "Heinz", "Anna", "Herbert", "Mathilde"],
		"name2": ["Fridolin", "Maria", "Heinz", "Anna", "Herbert", "Mathilde"]
	},
	"separator": " - ",
	"rules": {
		"Start": [
			"$Greeting - $Greeting - $Introduction - $Goodbye - $Goodbye",
			"$Greeting - $Greeting - $Introduction - $Discussion - $Goodbye",
			"$Greeting - $Greeting - $Introduction - $Discussion - $Discussion - $Goodbye",
			"$Greeting - $Greeting - $Discussion - $Goodbye",
			"$Greeting - $Greeting - $Discussion - $Discussion - $Goodbye"
		],
		"Introduction": [
			"$NameQuestion - $NameAnswer",
			"$NameQuestion - $NameAnswer+Question - $NameAnswer"
		],
		"Discussion": [
			"$Question{topic} - $Answer{topic}",
			"$Question{topic} - $Answer+Question{topic} - $Answer{topic}"
		],

		"Question{topic:weather}": [
			"Wie ist das Wetter?"
		],
		"Answer+Question{topic:weather}": [
			"Super, und bei dir?",
			"Nicht so gut, und bei dir?"
		],
		"Answer+Question{topic:weather}": [
			"Toll!",
			"Es geht so."
		],

		"NameQuestion": [
			"Wie heißt du?",
			"Wie ist dein Name?",
			"Wer bist du?"
		],
		"NameAnswer": [
			"Ich heiße Herbert",
			"Mein Name ist Herbert",
			"Ich bin Herbert",
			"Ich heiße Maria",
			"Mein Name ist Maria",
			"Ich bin Maria"
		],
		"NameAnswer+Question": [
			"Ich heiße Herbert. Und du?",
			"Mein Name ist Herbert. Und wie ist dein Name?",
			"Ich bin Herbert. Und du?"
		],

		"Greeting": [
			"Hallo",
			"Guten Tag",
			"Guten Morgen",
			"Guten Abend",
			"Hi"
		],
		"Goodbye": [
			"Tschüss",
			"Auf Wiedersehen",
			"Bis bald",
			"Mach's gut",
			"Ciao"
		],


	}
}