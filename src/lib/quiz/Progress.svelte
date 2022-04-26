<script>
    import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
    const dispatch = createEventDispatcher();

    export let showCurrent = true;
    export let phase = 0;
    export let step = 0;
    export let phases = [];

    $: correct = function (phaseIndex,stepIndex) {
        const phaseSteps = phases[phaseIndex].steps;
        return (stepIndex === undefined) ? phaseSteps.every(s => s === "correct") : phaseSteps[stepIndex] === "correct";
    }

    $: incorrect = function (phaseIndex,stepIndex) {
        const phaseSteps = phases[phaseIndex].steps;
        return (stepIndex !== undefined) && phaseSteps[stepIndex] === "incorrect";
    }

    $: current = function (phaseIndex,stepIndex) {
        return (showCurrent && (phaseIndex === phase && (stepIndex === undefined || stepIndex === step)));
    }

    $: evalClass = function (phaseIndex,stepIndex) {
        if (correct(phaseIndex, stepIndex)) {
            return "correct";
        } else if (incorrect(phaseIndex, stepIndex)) {
            return "incorrect";
        } else {
            return ""
        }
    }

    $: currentClass = function (phaseIndex,stepIndex) {
        return current(phaseIndex, stepIndex) ? "current" : "";
    }


</script>


<div class="quiz-progress">
    {#each phases as p, phaseIndex}
        <div class="phase {currentClass(phaseIndex)} {evalClass(phaseIndex)}">
            {#if correct(phaseIndex)}
                <span class="mark checkmark"></span>
            {:else if current(phaseIndex)}
                <span class="mark questionmark">?</span>
            {/if}
            <div class="phase-title" on:click={() => { dispatch("select", {
                phase: phaseIndex,
                step: 0
            })}}>{p.name}
            </div>
            <div class="phase-progress">
                {#each p.steps as s, stepIndex}
                    <div class="phase-step {evalClass(phaseIndex,stepIndex)} {currentClass(phaseIndex,stepIndex)} {phaseIndex === 0 && stepIndex === 0 ? 'first' : ''} {phaseIndex === phases.length - 1 && stepIndex === phases[phaseIndex].steps.length - 1 ? 'last' : ''}" on:click={() => { dispatch("select", {
                        phase: phaseIndex,
                        step: stepIndex
                    })}}></div>
                {/each}
            </div>
        </div>
    {/each}
</div>


<style lang="stylus">

</style>