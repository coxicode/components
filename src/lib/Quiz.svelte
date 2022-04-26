<script>
  import { tick } from 'svelte';
  import { unnest, assoc } from 'ramda';
  import List from "./List.svelte";
  import Progress from "./quiz/Progress.svelte";
  import Answer from "./quiz/Answer.svelte";
  import Message from "./quiz/Message.svelte";
  import Done from "./quiz/Done.svelte";
  import RandomLine from "./RandomLine.svelte";
  import InteractiveLine from "./InteractiveLine.svelte";
  import { fade } from 'svelte/transition';

  import C from "/src/js/cicero/grammar.js";

  export let quizGrammar;   // Grammar as string

  // Property "questions" are not really part of the grammar because they are just strings stored there.
  // They get deleted during specification of grammar, so add them back in again.
  // Maybe they should be stored in a separate variable altogether.
  const parsedGrammar = JSON.parse(quizGrammar);
  const questions = parsedGrammar.questions
  const phaseNames = parsedGrammar.phases;

  const maxSteps = questions.reduce((maxSteps, phaseQuestions) => {
      return phaseQuestions.length > maxSteps ? phaseQuestions.length : maxSteps;
  }, 0);

  parsedGrammar.rules = parsedGrammar.answers; //Just rename because "rules" is expected but "answers" is nicer
  parsedGrammar.features = {
    phase: questions.map((_,qIndex) => toString(qIndex)),
    step: Array(maxSteps).map((_,sIndex) => toString(sIndex))
  }

  const grammar = C.specify(parsedGrammar);

  let phase = 0;
  let step = 0;
  let phases = [];
  let showCurrent = true;

  const totalQuestions = questions.reduce((sum, phaseQuestions) => sum + phaseQuestions.length, 0);

  function start() {
    phase = 0;
    step = 0;

    phases = phaseNames.map((phaseName, phaseIndex) => ({
        name: phaseName,
        steps: questions[phaseIndex].map(q => false)
    }));

    showCurrent = true;
  }

  function features(phase, step) {
    return `{phase:${phase},step:${step}}`;
  }

  $: possibleAnswers = phases[phase].steps.map((_,s) => `$Answer${features(phase,s)}`);

  $: question = questions[phase][step];
  $: answer = `$Answer${features(phase,step)}`;
  $: allCorrect = phases.every(p => p.steps.every(s => s === "correct"));
  $: allDone = phases.every(p => p.steps.every(s => s === "correct" || s === "incorrect"));
  $: isLastQuestion = (phase === phases.length - 1) && (step === phases[phase].steps.length - 1);
  $: correctQuestions = phases.reduce((sum, phase) => sum + phase.steps.filter(s => s === "correct").length, 0);


  function saveResult(result) {
    phases[phase].steps[step] = result;
  }

  function selectQuestion(selectedPhase, selectedStep) {
    phase = selectedPhase;
    step = selectedStep;
    showCurrent = true;
  }

  function nextQuestion() {
    step = (step + 1) % phases[phase].steps.length;
    phase = step === 0 ? (phase + 1) % phases.length : phase;
  }

  function unselectQuestion() {
    showCurrent = false;
  }

  async function endQuestion(result) {
      saveResult(result);

      await tick(); 

      if (isLastQuestion || allCorrect) {
        unselectQuestion();
      } else{
        nextQuestion();
      }        
  }


  start();

</script>

<div class="quiz-main">

  <Progress {showCurrent} {phases} {phase} {step} on:select={(event) => selectQuestion(event.detail.phase, event.detail.step)}/>
    {#if allDone && !showCurrent}
      <Done total={totalQuestions} correct={correctQuestions} on:start={() => start()}/>
    {:else}
      <div class="quiz-controls">
        <Message text = {question} />
      </div>
      <Answer {grammar} {possibleAnswers} correctAnswers={[answer]} on:done={(event) => endQuestion(event.detail.result)}/>
    {/if}
</div>


<style lang="stylus">
/*
button
    font-size: 1.5rem
    margin: 0.3em 0.6em
    padding: 0.1em 0.3em
    width: fit-content
    display: inline-block
    background-color: white
    border: 1px solid blue
    border-radius: 0.2em
    cursor: pointer
    
*/
</style>