import Dialog from './lib/Dialog.svelte';
import Quiz from './lib/Quiz.svelte';

/* Dialog */


function initDialog() {
	const dialogElement = document.querySelector('#interactive-dialog');
	const dialogGrammarElement = document.querySelector('#grammar-dialog');
	const lineGrammarElement = document.querySelector('#grammar-line');

	if (dialogElement && (dialogGrammarElement && lineGrammarElement)) {
		return new Dialog({
			target: dialogElement,
			props: {
				dialogGrammar: dialogGrammarElement.textContent,
				lineGrammar: lineGrammarElement.textContent
			}
		});	
	}
}

/* Quiz */

function initQuiz() {
	const quizElement = document.querySelector('#quiz');
	const grammarElement = document.querySelector('#grammar-quiz');

	if (quizElement && grammarElement) {
	  return new Quiz({
	  	target: quizElement,
	  	props: {
	      quizGrammar: grammarElement.textContent
	  	}
	  });
	}
}



document.addEventListener('DOMContentLoaded', (e) => {
    const dialog = initDialog();
    const quiz = initQuiz();
});