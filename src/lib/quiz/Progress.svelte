<script>
    import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
    const dispatch = createEventDispatcher();

    export let phase = 0;
    export let step = 0;
    export let phases = [
        {
            name: "Anfang", steps: [true, true, false]
        },
        {
            name: "Ende 1", steps: [true, true, false]
        },
        {
            name: "Ende 2", steps: [true, true, false]
        }
    ]

    $: correct = function (phaseIndex,stepIndex) {
        const phaseSteps = phases[phaseIndex].steps;
        return (stepIndex === undefined) ? phaseSteps.every(s => s) : phaseSteps[stepIndex];
    }

    $: current = function (phaseIndex,stepIndex) {
        return (phaseIndex === phase && (stepIndex === undefined || stepIndex === step));
    }

    $: correctClass = function (phaseIndex,stepIndex) {
        return correct(phaseIndex, stepIndex) ? "correct" : "";
    }

    $: currentClass = function (phaseIndex,stepIndex) {
        return current(phaseIndex, stepIndex) ? "current" : "";
    }


</script>


<div class="quiz-progress">
    {#each phases as p, phaseIndex}
        <div class="phase {currentClass(phaseIndex)} {correctClass(phaseIndex)}">
            {#if correct(phaseIndex)}
                <span class="checkmark"></span>
            {/if}
            <div class="phase-title" on:click={() => { dispatch("select", {
                phase: phaseIndex,
                step: 0
            })}}>{p.name}
            </div>
            <div class="phase-progress">
                {#each p.steps as s, stepIndex}
                    <div class="phase-step {correctClass(phaseIndex,stepIndex)} {currentClass(phaseIndex,stepIndex)} {phaseIndex === 0 && stepIndex === 0 ? 'first' : ''} {phaseIndex === phases.length - 1 && stepIndex === phases[phaseIndex].steps.length - 1 ? 'last' : ''}" on:click={() => { dispatch("select", {
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