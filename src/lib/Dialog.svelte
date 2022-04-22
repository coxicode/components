<script>
  import List from "./List.svelte";
  import RandomLine from "./RandomLine.svelte";
  import InteractiveLine from "./InteractiveLine.svelte";
  import { fade } from 'svelte/transition';

  import C from "/src/js/cicero/grammar.js";

  export let dialogGrammar;   // Grammar as string
  export let lineGrammar;     // Grammar as string

  const grammarD = C.specify(JSON.parse(dialogGrammar));
  const grammarL = C.specify(JSON.parse(lineGrammar));

  function next(sequences) {
    return C.nextSequences(grammarD, sequences);
  }

  let history = [];
  let future = [];

  $: nextLines = C.getFirstSymbols(future.map(l => l.sequence));
  $: lineMode = history.length % 2 === 0 ? "random" : "interactive"

  //console.log({dialogGrammar, lineGrammar})

  function start() {
    //console.log({grammarD, grammarL})

    return {
      history: [],
      future: next([{sequence: ["$Start"]}])
    };
  }


  function updateDialog(line, lineString) {
      history = [...history, lineString];
      // Select all possible continuation that begin with the selected line
      future = next(C.selectSequences(future, line));       
  }


</script>

<div class="container dialog">

  <div class="dialog-header">
    <button class="button-start" on:click={() => {history = start().history; future = start().future;}}>Start</button>
  </div>

  <List lines={history} />

  {#if future.length > 0}
    {#if lineMode === "interactive"}
      <InteractiveLine grammar={grammarL} lines={nextLines} lineStyle={history.length % 2 === 0 ? "odd" : "even"} on:done={(event) => updateDialog(event.detail.lineSymbol, event.detail.lineString)} />
    {:else}
      <RandomLine grammar={grammarL} lines={nextLines} lineStyle={history.length % 2 === 0 ? "odd" : "even"} on:done={(event) => updateDialog(event.detail.lineSymbol, event.detail.lineString)} />
    {/if}
  {/if}

  {#if future.length === 0 && history.length > 0}
    <div in:fade="{{ delay: 800, duration: 100 }}" class="dialog-footer">
      <button class="button-restart" on:click={() => {history = start().history; future = start().future;}}>↻ Noch einmal</button>
    </div>
  {/if}

</div>


<style lang="stylus">
/*
button
    font-size: 1.5rem
    margin: 0.3em 0.6em
    padding: 0.1em 0.3em
    width: fit-content
    display: inline-block
    background-color: white
    border: 1px solid blue
    border-radius: 0.2em
    cursor: pointer
    
*/
</style>