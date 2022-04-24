<script>
  import { unnest } from 'ramda';
  import List from "./List.svelte";
  import Progress from "./quiz/Progress.svelte";
  import Question from "./quiz/Question.svelte";
  import Answer from "./quiz/Answer.svelte";
  import RandomLine from "./RandomLine.svelte";
  import InteractiveLine from "./InteractiveLine.svelte";
  import { fade } from 'svelte/transition';

  import C from "/src/js/cicero/grammar.js";

  export let quizGrammar;   // Grammar as string
  export let testGrammar;   // Grammar as JSON

  //const grammar = C.specify(JSON.parse(quizGrammar));
  const grammar = testGrammar;

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

<div class="quiz">

  <h2>Quiz</h2>

  <Progress {phases} {phase} {step} />
  <Question question = {grammar.questions[question.slice(1)]} />
  <Answer {grammar} {possibleAnswers} correctAnswers={[answer]} on:done={(event) => endQuestion(event.detail.result)}/>

  <button class="button-start" on:click={() => endQuestion(true)}>Next</button>

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