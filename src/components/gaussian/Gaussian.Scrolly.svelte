<script>
  import data from "$components/data/data.json";
  import Title from "$components/gaussian/Title.svelte";
  import Gaussian from "$components/gaussian/Gaussian.svelte";
  import ScrollyStepWrapper from "$components/layouts/Scrolly.StepWrapper.svelte";
  import ScrollyStepContent from "$components/layouts/Scrolly.StepContent.svelte"; 
  import ScrollyStep from "$components/layouts/Scrolly.Step.svelte";

  // Temos dois tipos de scrolly index caso queiramos fazer um scrolly com steps ou com steps e conteúdo
  // O primeiro é o scrollyIndex, que é o índice do step atual
  // O segundo é o scrollyContentIndex, que é o índice do conteúdo atual

  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import scrollama from "scrollama";

  // Scroller parameters
  const scrollyIndex = writable(undefined);
  setContext("Scrolly", { scrollyIndex });

  // Init scrollama
  onMount(async () => {
    const scroller = scrollama();
    scroller
      .setup({
        step: ".foreground-wrapper > *",
        offset: 0.5
        // parent
      })
      .onStepEnter((response) => { // Updates current index
        $scrollyIndex = response.index;
      });
  });
</script>

<!-- Scroll progress bar -->
<div
  class="progress-bar"
  style="width: {($scrollyIndex ?? 0) / (data.steps.length + 1) * 100}%"
></div>

<div class="wrapper" style:pointer-events={$scrollyIndex === 0 ? "auto" : "auto"}>
  <div class="foreground-wrapper">
    <ScrollyStepWrapper height="100vh">
      <Title />
    </ScrollyStepWrapper>

    {#each data.steps as step, i}
      <ScrollyStepWrapper>
        <ScrollyStep active={$scrollyIndex === i + 1}>
          <div class="step-container">
            <ScrollyStepContent step={step} />
          </div>
        </ScrollyStep>
      </ScrollyStepWrapper>
    {/each}

    <div class="spacer" />
  </div>

  <div class="background-wrapper">
    <Gaussian />
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

  :global(body) {
    font-family: 'Inter', sans-serif;
    background: #f9fafb;
    color: #222;
    margin: 0;
    padding: 0;
  }

  .wrapper {
    display: flex;
    flex-direction: row-reverse;
    text-align: center;
    transition: 100ms;
    min-height: 100vh;
  }

  .foreground-wrapper {
    flex: 1 1 50%;
    padding: 2rem;
    z-index: 10;
  }

  .background-wrapper {
    position: sticky;
    top: 47%;
    transform: translate(0, -50%);
    flex: 1 1 50%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spacer {
    height: 30vh;
  }

  /*Dados da fonte dos blocos explicativos*/
  .step-container {
    font-family: 'Fredoka', sans-serif;
    font-size: 1.26rem;
    text-indent: 2em;
    text-align: justify;
    line-height: 1.6;
    position: relative;
    padding: 1rem 2rem;
    margin: 1.5rem 0;
    background: #ecfdf7;
    border-radius: 12px;
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease;
  }

  .step-indicator {
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    width: 5px;
    background: transparent;
    border-radius: 4px;
    transition: background 0.3s;
  }

  .step-indicator.active {
    background: #9bffd7;
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background-color: #29996c;
    transition: width 0.2s ease;
    z-index: 1000;
  }

  @media screen and (max-width: 768px) {
    .wrapper {
      flex-direction: column-reverse;
    }

    .foreground-wrapper, .background-wrapper {
      width: 100%;
      flex: unset;
    }

    .background-wrapper {
      position: relative;
      top: unset;
      transform: none;
      height: auto;
      margin-top: 2rem;
    }

    .step-container {
      padding: 1rem;
    }
  }
</style>
