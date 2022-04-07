<script>
    export let lines;
</script>

<div class="history">
    {#each lines as line}
        <p><span class="button">{line}</span></p>
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
    
.button
    margin: 0.4em 0.2em
    padding: 0em 0.4em
    font-size: 1.5rem

    border-color: white;
    border-radius: 0;

</style>