<script>
    export let lines;
</script>

<div class="history">
    {#each lines as line, i}
        <p class="history-line {i % 2 === 0 ? 'odd' : 'even'}">{line}</p>
    {/each}
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