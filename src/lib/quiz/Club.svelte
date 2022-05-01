<script>
    let title = "Willst du alle Fragen?";
    let linkMonth = "https://www.copecart.com/products/0c601627/checkout";
    let linkYear = "https://www.copecart.com/products/4e65fa91/checkout";
    import Message from "./Message.svelte";
    import { onMount } from 'svelte';

    let lern = window.lern;

    onMount(() => lern.sendPaywallViewGoal("Quiz"));

</script>

<div class="quiz-controls">
    <Message text={title} />
</div>

<div class="paywall">

    <p>Komm in den LernLaterne Club für diese Premium-Vorteile:</p>
    <div class="list-benefits">
         <div class="flex one three-800">   
            <div>
                <div class="benefit"> <span class="mark checkmark"></span>39 Geschichten komplett</div>
            </div>
            <div>
                <div class="benefit"> <span class="mark checkmark"></span>Alle Fragen und Antworten</div>
            </div>
            <div>
                <div class="benefit"> <span class="mark checkmark"></span>20 % Rabatt auf Unterricht</div>
            </div>
        </div>
    </div>
    <div class="paywall-tiers">
        <div class="flex two">
            <div>

                <a class="paywall-tier box-link" target="_blank" href={linkMonth} on:click={() => lern.sendPaywallClickGoal("Quiz", "1 Month")}>
                    <div class="card clickable v1">
                        <div class="period">1 Monat</div>
                        <div class="price">5 Euro</div>
                    </div>
                </a>
            </div>
            <div>

                <a class="paywall-tier box-link" target="_blank" href={linkYear} on:click={() => lern.sendPaywallClickGoal("Quiz", "1 Year")}>
                    <div class="card clickable selected v1">
                        <div class="discount">- 60 %</div>
                        <div class="period">1 Jahr</div>
                        <div class="price"><span class="strikethrough">60 Euro</span>24 Euro</div>
                    </div>
                </a>

            </div>
        </div>
    </div>
    <div class="footer"><a class="button yes" target="_blank" href={linkYear} on:click={() => lern.sendPaywallClickGoal("Quiz", "1 Year")}>Ja, ich will</a></div>

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