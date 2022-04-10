import Dialog from './lib/Dialog.svelte';

const dialog = new Dialog({
	target: document.querySelector('#interactive-dialog'),
	props: {
		dialogGrammar: document.querySelector('#grammar-dialog').textContent,
		lineGrammar: document.querySelector('#grammar-line').textContent
	}
});