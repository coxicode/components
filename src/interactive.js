import Dialog from './lib/Dialog.svelte';
import Quiz from './lib/Quiz.svelte';

/* Dialog */

const dialogElement = document.querySelector('#interactive-dialog');
const dialogGrammarElement = document.querySelector('#grammar-dialog');
const lineGrammarElement = document.querySelector('#grammar-line');

if (dialogElement && (dialogGrammarElement && lineGrammarElement)) {
	const dialog = new Dialog({
		target: dialogElement,
		props: {
			dialogGrammar: dialogGrammarElement.textContent,
			lineGrammar: lineGrammarElement.textContent
		}
	});	
}

/* Quiz */

const quizElement = document.querySelector('#quiz');
const grammarElement = document.querySelector('#grammar-quiz');

if (quizElement && grammarElement) {
  const quiz = new Quiz({
  	target: quizElement,
  	props: {
      quizGrammar: grammarElement.textContent
  	}
  });
}