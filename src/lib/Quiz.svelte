<script>
  import { unnest, assoc } from 'ramda';
  import List from "./List.svelte";
  import Progress from "./quiz/Progress.svelte";
  import Question from "./quiz/Question.svelte";
  import Answer from "./quiz/Answer.svelte";
  import RandomLine from "./RandomLine.svelte";
  import InteractiveLine from "./InteractiveLine.svelte";
  import { fade } from 'svelte/transition';

  import C from "/src/js/cicero/grammar.js";

  export let quizGrammar;   // Grammar as string

  // Property "questions" are not really part of the grammar because they are just strings stored there.
  // They get deleted during specification of grammar, so add them back in again.
  // Maybe they should be stored in a separate variable altogether.
  const parsedGrammar = JSON.parse(quizGrammar);
  const grammar = assoc("questions", parsedGrammar.questions, C.specify(parsedGrammar));

  let phase = 0;
  let step = 0;
  let { phases } = start()

  function start() {
    return {
      phases: [
        {
            name: "Anfang", steps: [false, false, false]
        },
        {
            name: "Ende 1", steps: [false, false, false]
        },
        {
            name: "Ende 2", steps: [false, false, false]
        }
      ]
    };
  }

  function features(phase, step) {
    return `{phase:${phase},step:${step}}`;
  }

  const questions = unnest(phases.map((phase, p) => phase.steps.map(
    (_, s) => `$Question${features(p,s)}`
  )));

  $: possibleAnswers = phases[phase].steps.map((_,s) => `$Answer${features(phase,s)}`);

  $: question = `$Question${features(phase,step)}`;
  $: answer = `$Answer${features(phase,step)}`;

  function saveResult(result) {
    phases[phase].steps[step] = result;
  }

  function selectQuestion(selectedPhase, selectedStep) {
    phase = selectedPhase;
    step = selectedStep
  }

  function nextQuestion() {
    step = (step + 1) % phases[phase].steps.length;
    phase = step === 0 ? (phase + 1) % phases.length : phase;
  }

  function endQuestion(result) {
      saveResult(result);
      nextQuestion();
  }

  console.log({phase, step, question, answer, questions, possibleAnswers})


</script>

<div class="quiz-main">

  <Progress {phases} {phase} {step} on:select={(event) => selectQuestion(event.detail.phase, event.detail.step)}/>
  <div class="quiz-controls">
    <Question question = {grammar.questions[question.slice(1)]} />
    <span class="button continue" on:click={() => nextQuestion(false)}>Nächste Frage</span>
  </div>
  <Answer {grammar} {possibleAnswers} correctAnswers={[answer]} on:done={(event) => endQuestion(event.detail.result)}/>

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