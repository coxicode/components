<script>
	export let lines;
	export let lineStyle;
	export let grammar;

	import { beforeUpdate, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import C from "/src/js/cicero/grammar.js";

	const punctuation = [",", ".", ":", ";", "?", "!"]
	const dispatch = createEventDispatcher();

	function selectRandom(list) {
		const randomIndex = Math.floor(Math.random() * list.length);
	  	return list[randomIndex];
	}

	function toString(line) {
		const lineString = line.map(w => punctuation.includes(w) ? w : " " + w).join("");
		return lineString.slice(1);
	}

	const lineSymbol = selectRandom(lines);
	const line = C.expandRandom(grammar, [lineSymbol])

	onMount(() => dispatch("done", {
			lineSymbol: lineSymbol,
			lineString: toString(line)
		})
	);

</script>


<div in:fade={{ }}  class={lineStyle}>
	<div class="line">
		{toString(line)}
	</div>
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