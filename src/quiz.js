import Quiz from './lib/Quiz.svelte';


const testGrammar = {
  "prefix": "$",
  "separator": " ",
  "features": {
  	"phase": [
  		"0", "1", "2"
  	],
  	"step": [
  		"0", "1", "2"
  	]
  },
  "questions": {
    "Question{phase:0,step:0}": "Hallo, wie heißt du?",
    "Question{phase:0,step:1}": "Woher kommst du?",
    "Question{phase:0,step:2}": "Wie alt bist du?",
    "Question{phase:1,step:0}": "Wo bist du geboren?",
    "Question{phase:1,step:1}": "Wo wohnst du?",
    "Question{phase:1,step:2}": "Was sind deine Hobbys?",
    "Question{phase:2,step:0}": "Hast du ein Idol",
    "Question{phase:2,step:1}": "Hörst du gern Musik?",
    "Question{phase:2,step:2}": "Was machst du gern am Wochenende?"
  },
  "rules": {
    "Answer{phase:0,step:0}": [
      "Ich heiße Dominik .",
      "Mein Name ist Dominik .",
      "Ich bin Dominik ."
    ],
    "Answer{phase:0,step:1}": [
      "Ich komme aus Deutschland ."
    ],
    "Answer{phase:0,step:2}": [
      "Ich bin 39 ."
    ],
    "Answer{phase:1,step:0}": [
      "Ich bin in Pokhara geboren ."
    ],
    "Answer{phase:1,step:1}": [
      "Ich wohne in Leipzig ."
    ],
    "Answer{phase:1,step:2}": [
      "Meine Hobbys sind Gitarre spielen und Sprachen lernen ."
    ],
    "Answer{phase:2,step:0}": [
      "Das weiß ich nicht ."
    ],
    "Answer{phase:2,step:1}": [
      "Ja , aber nicht so oft ."
    ],
    "Answer{phase:2,step:2}": [
      "Am Wochenende gehe ich spazieren oder arbeite ."
    ]
  }
}


const quiz = new Quiz({
	target: document.querySelector('#quiz'),
	props: {
		quizGrammar: document.querySelector('#grammar-quiz').textContent,
		testGrammar
	}
});