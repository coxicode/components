<script>
  import List from "./List.svelte";
  import Line from "./Line.svelte";

  import C from "/src/js/cicero/grammar.js";

  import unspecifiedDialogGrammar from "./grammars/smalltalk/smalltalkDialog.js";

  const dialogGrammar = C.specify(unspecifiedDialogGrammar);

  function next(sequences) {
    return C.nextSequences(dialogGrammar, sequences);
  }

  let {history, future} = start();

  $: nextLines = C.getFirstSymbols(future.map(l => l.sequence));


  console.log(nextLines)

  function start() {
    return {
      history: [],
      future: next([{sequence: ["$Start"]}])
    };
  }


  function updateDialog(line, lineString) {
    history = [...history, lineString];
    future = next(C.selectSequences(future, line));
  }


</script>

<div class="container dialog">

  <List lines={history} />

  {#if future.length > 0} 
    <Line lines={nextLines} lineStyle={history.length % 2 === 0 ? "odd" : "even"} on:done={(event) => updateDialog(event.detail.lineSymbol, event.detail.lineString)} />
  {:else}
    <div class="dialog-footer">
      <button class="start outline" on:click={() => {history = start().history; future = start().future;}}> Nochmal</button>
    </div>
  {/if}

</div>


<style lang="stylus">

/*
.dialog
  background-color: white
  padding: 2em
  
button
  font-size: 1.5rem
  width: fit-content
  margin: 0.4em auto
  padding: 0em 0.4em;


p.odd::before
  content: " ▲ "
  color: blue
    
p.even::before
  content: " ● "
  color: blue

p 
  font-size: 1.5rem
  margin: 0
  
.button
  margin: 0.4em 0.2em
  padding: 0em 0.4em;
  font-size: 1.5rem

.line
  border-left-color: white;
  border-right-color: white;
  border-top-color: white;
  border-bottom-color: white;
  border-radius: 0;

*/
</style>