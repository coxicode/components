<script>
    export let lines;
</script>

<div class="history">
    {#each lines as line}
        <p><span>{line}</span></p>
    {/each}
</div>

<style lang="stylus">

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
        
</style>