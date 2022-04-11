<script>
	export let lines;
	export let lineStyle;
	export let grammar;

	import { tick } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import C from "/src/js/cicero/grammar.js";

	const punctuation = [",", ".", ":", ";", "?", "!"]

	const dispatch = createEventDispatcher();

	function nextChunks(sequences) {
		return C.getFirstSymbols(sequences.map(l => l.sequence));
	}

	function next(sequences) {
		return C.nextSequences(grammar, sequences);
	}

	$: line = start(lines).line;
	$: history = start(lines).history;
	$: future = start(lines).future;
	$: present = next(future)
	$: lineSymbol = last(history) && next(last(history)).find(l => l.sequence[0] === last(line)).symbol;
	$: isComplete = future.some(f => f.sequence.length === 0);

	function start(lines) {
		return {
			line: [],
			history: [],
			future: lines.map(
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
			// Need to wait for reactive variables to change (line, history, future). Then it is safe to recursively call nextChunk again
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

	function toString(line) {
		const lineString = line.map(w => punctuation.includes(w) ? w : " " + w).join("");
		return lineString.slice(1);
	}

	function hideOK() {
		document.getElementById("done").style.display = "none";
	}

</script>


<div in:fade={{ delay: 800 }} class={lineStyle}>
	{#if line.length > 0}
		<div class="line" on:click={undo}>
			{toString(line)}
		</div>
	{/if}

	{#if present.length > 0}	
		{#each nextChunks(present) as chunk}
			<div class="chunk" on:click={() => nextChunk(chunk)}>{chunk}</div>
		{/each}
	{/if}

	{#if isComplete}
		<div id="done" class="button done" on:click={() => { hideOK(); dispatch("done", {
			lineSymbol: lineSymbol,
			lineString: toString(line)
		})}}>OK</div>
	{/if}
</div>	

<style lang="stylus">


/*
.line, .chunk, .button
    font-size: 1.5rem
    margin: 0.3em 0.6em
    padding: 0.1em 0.3em
    width: fit-content
    display: inline-block
    border-radius: 0.2em
    
.chunk, .button
    border: 1px solid gray
    cursor: pointer
    
.done
	border-color: blue
*/

</style>