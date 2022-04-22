<script>
    export let lines = ["."];
    import { fly, fade } from 'svelte/transition';
    import { afterUpdate } from 'svelte';

    afterUpdate(() => {

        if (lines.length > 1) {
            const historyEnd = document.getElementsByClassName("history-end")[0];
            const historyY = historyEnd.getBoundingClientRect().y;
            const windowHeight = window.innerHeight;

            if (historyY > windowHeight * 0.5) {
                setTimeout(function () {      
                    document.getElementsByClassName("history-end")[0].scrollIntoView({block: "center"});
                }, 200);    
            }

        } else {
            document.getElementsByClassName("dialog-header")[0].scrollIntoView({block: "start"});
        }

    });

</script>
<div class="history">
    {#each lines as line, i}
        {#if i  === 0}
            <p class="history-line odd">{line}</p>
        {:else if i % 2 === 0}
            <p in:fade="{{ delay: 800, duration: 100 }}" class="history-line odd">{line}</p>
        {:else}
            <p in:fade="{{ duration: 100 }}" class="history-line even">{line}</p>
        {/if}
    {/each}
</div>
<div class="history-end"></div>

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