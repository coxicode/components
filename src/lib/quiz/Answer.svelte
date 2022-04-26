<script>
	export let possibleAnswers; // ["$Answer1", "$Answer2"]
	export let correctAnswers; // ["$Answer1"]
	export let grammar;			// There is only one grammar for the whole quiz

	import { tick } from 'svelte';
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';
	import C from "/src/js/cicero/grammar.js";
	import { adjust } from 'ramda'

	const punctuation = [",", ".", ":", ";", "?", "!"];
	const finalPunctuation = [".", "?", "!"];

	const dispatch = createEventDispatcher();

	function nextChunks(sequences) {
		return C.getFirstSymbols(sequences.map(l => l.sequence));
	}

	function next(sequences) {
		return C.nextSequences(grammar, sequences);
	}

	$: line = start(possibleAnswers).line;
	$: history = start(possibleAnswers).history;
	$: future = start(possibleAnswers).future;
	$: present = next(future)
	$: lineSymbol = last(history) && next(last(history)).find(l => l.sequence[0] === last(line)).symbol;
	$: isComplete = future.some(f => f.sequence.length === 0);

	function start(possibleAnswers) {
		return {
			line: [],
			history: [],
			future: possibleAnswers.map(
				l => ({symbol: l, sequence: [l]})
			),
		};
	}

	async function nextChunk(selectedChunk) {
		line = [...line, selectedChunk];
		history = [...history, future];
		future = C.selectSequences(present, selectedChunk);

		const followingChunks = nextChunks(future);

		if (followingChunks.length === 1 && punctuation.includes(followingChunks[0])) {
			// Need to wait for reactive variables to change (line, history, future).
			// Then it is safe to recursively call nextChunk again
			await tick(); 
			nextChunk(followingChunks[0]);
		}

	}

	function last(array) {
		return array[array.length - 1];
	}

	function undo() {
		future = last(history)
		line = line.slice(0,-1);
		history = history.slice(0,-1);
	}

	function toList(line) {
		return line.reduce(
			(acc, w) => {
				if (acc.length > 0 && punctuation.includes(w)) {
					return adjust(acc.length - 1, (a) => a.concat(w), acc);
				} else {
					const previousCharacter = acc.length === 0 ? [] : acc[acc.length -1].slice(-1);
					return acc.concat(capitalizeNext(previousCharacter, w));
				}
			},
		[]);
	}

	function toString(line) {
		return toList(line).join(" ");
	}

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function capitalizeNext(line, chunk) {
		const afterSentence = finalPunctuation.includes(line[line.length - 1]);
		const firstChunk = (line.length === 0);

		if (firstChunk || afterSentence) {
			return capitalize(chunk);
		} else {
			return chunk;
		}
	}


	function hideOK() {
		document.getElementById("done").style.display = "none";
	}

</script>

<div class="quiz-answer">
	
	<p class="line answer-line">
		{#if line.length === 0 && present.length === 0}
			<span class="line">Klich mich -></span>
		{/if}

		{#each toList(line) as lineChunk, i}
			<span class={i === toList(line).length - 1 ? "line-chunk last-line-chunk" : "line-chunk"} on:click={undo}>
				{i === 0 ? lineChunk : " " + lineChunk}
			</span> 
		{/each}

		{#if present.length > 0}	
			{#each nextChunks(present) as chunk}
				<span class="chunk" on:click={() => nextChunk(chunk)}>{capitalizeNext(line,chunk)}</span>
			{/each}
		{/if}

		{#if isComplete}
			<span id="done" class="button done" on:click={() => { hideOK(); dispatch("done", {
				result: correctAnswers.includes(lineSymbol) ? "correct" : "incorrect"
			})}}>⮞</span>
		{/if}
	</p>	

</div>
<style lang="stylus">


</style>