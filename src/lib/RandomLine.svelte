<script>
	export let lines;
	export let lineStyle;
	export let grammar;

	import { adjust } from 'ramda'
	import { afterUpdate, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import C from "/src/js/cicero/grammar.js";
	
	const punctuation = [",", ".", ":", ";", "?", "!"]
	const finalPunctuation = [".", "?", "!"];

	const dispatch = createEventDispatcher();

	function selectRandom(list) {
		const randomIndex = Math.floor(Math.random() * list.length);
	  	return list[randomIndex];
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

	const lineSymbol = selectRandom(lines);
	const line = C.expandRandom(grammar, [lineSymbol])


	onMount(() => {
		dispatch("done", {
			lineSymbol: lineSymbol,
			lineString: toString(line)
		})
	});

</script>


<div in:fade="{{ duration: 100 }}"  class={lineStyle}>
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