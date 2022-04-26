<script>
    export let total = 0;
    export let correct = 0;
    let title = (correct === total ? "Super gemacht!" : "Das war's!");
    let count = (correct === total ? `Alle ${total}` : `${correct} von ${total}`);

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Message from "./Message.svelte";
</script>

<div class="quiz-controls">
    <Message text={title} />
    <span class="button continue" on:click={() => dispatch("start")}>↻ Noch einmal</span>
</div>
<div class="quiz-answer">
    <p>{count} Antworten sind korrekt.</p>  
</div>  



<style lang="stylus">

/*
.history
    p:nth-child(odd)::before
        content: " ▲ "
        color: blue
        
    p:nth-child(even)::before
        content: " ● "
        color: blue
        
    p
        font-size: 1.5rem
        margin: 0
*/
</style>