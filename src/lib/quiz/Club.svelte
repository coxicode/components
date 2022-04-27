<script>
    let title = "Willst du alle Fragen beantworten?";
    let paragraph = "Dann komm in den LernLaterne Club!";

    import Message from "./Message.svelte";
</script>

<div class="quiz-controls">
    <Message text={title} />
    <a class="button continue" href="/club">Mehr Infos</a>
</div>
<div class="quiz-answer">
    <p>{paragraph}</p>  
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