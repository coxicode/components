<script>
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

    $: correctClass = function (phaseIndex,stepIndex) {
        const phaseSteps = phases[phaseIndex].steps;
        const isCorrect = (stepIndex === undefined) ? phaseSteps.every(s => s) : phaseSteps[stepIndex];
        return isCorrect ? "correct" : "";
    }

    $: currentClass = function (phaseIndex,stepIndex) {
        return (phaseIndex === phase && (stepIndex === undefined || stepIndex === step)) ? "current" : "";
    }
</script>


<div class="quiz-progress">
    {#each phases as p, phaseIndex}
        <div class="phase {correctClass(phaseIndex)}">
            <div class="phase-title {currentClass(phaseIndex)}">{p.name} - {currentClass(phaseIndex)} - {correctClass(phaseIndex)}</div>
            <div class="phase-progress">
                {#each p.steps as s, stepIndex}
                    <div class="phase-step {correctClass(phaseIndex,stepIndex)} {currentClass(phaseIndex,stepIndex)}">{correctClass(phaseIndex,stepIndex)} - {currentClass(phaseIndex, stepIndex)}</div>
                {/each}
            </div>
        </div>
    {/each}
</div>


<style lang="stylus">

</style>