<script>
  import List from "./List.svelte";
  import RandomLine from "./RandomLine.svelte";
  import InteractiveLine from "./InteractiveLine.svelte";

  import C from "/src/js/cicero/grammar.js";

  export let dialogGrammar;   // Grammar as string
  export let lineGrammar;     // Grammar as string

  const grammarD = C.specify(JSON.parse(dialogGrammar));
  const grammarL = C.specify(JSON.parse(lineGrammar));

  function next(sequences) {
    return C.nextSequences(grammarD, sequences);
  }

  let {history, future} = start();

  $: nextLines = C.getFirstSymbols(future.map(l => l.sequence));
  $: lineMode = history.length % 2 === 0 ? "random" : "interactive"

  console.log(nextLines)

  function start() {
    return {
      history: [],
      future: next([{sequence: ["$Start"]}])
    };
  }


  function updateDialog(line, lineString) {
    setTimeout(() => {
      history = [...history, lineString];
      // Select all possible continuation that begin with the selected line
      future = next(C.selectSequences(future, line));       
    }, 0);
  }


</script>

<div class="container dialog">

  <List lines={history} />

  {#if future.length > 0}
    {#if lineMode === "interactive"}
      <InteractiveLine grammar={grammarL} lines={nextLines} lineStyle={history.length % 2 === 0 ? "odd" : "even"} on:done={(event) => updateDialog(event.detail.lineSymbol, event.detail.lineString)} />
    {:else}
      <RandomLine grammar={grammarL} lines={nextLines} lineStyle={history.length % 2 === 0 ? "odd" : "even"} on:done={(event) => updateDialog(event.detail.lineSymbol, event.detail.lineString)} />
    {/if}
  {:else}
    <div class="dialog-footer">
      <button on:click={() => {history = start().history; future = start().future;}}> Nochmal</button>
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