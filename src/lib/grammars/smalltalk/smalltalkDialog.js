export default {
	"prefix": "$",
	"features": {
		"topic": ["weather", "name"]
	},
	"separator": " - ",
	"rules": {
		"Start": [
			"$Begin - $Discussion{topic:name} - $End",
			"$Begin - $Discussion{topic:weather} - $End",
			"$Begin - $Discussion{topic:name} - $Discussion{topic:weather} - $End"
		],
		"Begin": [
			"@Greeting - @Greeting"
		],
		"End": [
			"@Goodbye - @Goodbye"
		],
		"Discussion{topic}": [
			"@Question{topic} - @Answer{topic}",
			"@Question{topic} - @Answer+Question{topic} - @Answer{topic}"
		]

	}
}