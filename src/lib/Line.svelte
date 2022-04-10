<script>
	export let lines;
	export let lineStyle;
	export let grammar;

	import { createEventDispatcher } from 'svelte';
	import C from "/src/js/cicero/grammar.js";

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

	function nextChunk(selectedChunk) {
		line = [...line, selectedChunk];
		history = [...history, future];
		future = C.selectSequences(present, selectedChunk);

		console.log({ lineSymbol, history, future, present })
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
		const lineString = line.map(w => w.match(/[.,:?!;]/) ? w : " " + w).join("");
		return lineString.slice(1);
	}


</script>


<div class={lineStyle}>
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
		<div class="button done" on:click={dispatch("done", {
			lineSymbol: lineSymbol,
			lineString: toString(line)
		})}>OK</div>
	{/if}
</div>	

<style lang="stylus">

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
        
</style>