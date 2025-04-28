<script>
  import data from "$components/data/data.json";
  import Title from "$components/gaussian/Title.svelte";
  import Gaussian from "$components/gaussian/Gaussian.svelte";
  import ScrollyStepWrapper from "$components/layouts/Scrolly.StepWrapper.svelte";
  import ScrollyStepContent from "$components/layouts/Scrolly.StepContent.svelte"; 
  import ScrollyStep from "$components/layouts/Scrolly.Step.svelte";

  import G1 from "$components/plots/grafico1.svelte";
  import G2 from "$components/plots/grafico2.svelte";
  import G3 from "$components/plots/g3.svelte";
  import G4 from "$components/plots/g4.svelte";

  import G5 from "$components/plots/matern.svelte";
  import G6 from "$components/plots/periodic.svelte";
  import G7 from "$components/plots/polinomial.svelte";
  import G8 from "$components/plots/squared_exp.svelte";


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
      .onStepEnter((response) => {
        $scrollyIndex = response.index;
      });

    if (window.MathJax) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
  });
</script>

<svelte:head>
  <title>❥ Gaussian Processes </title>
  <script type="text/javascript" async
    src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
  </script>
</svelte:head>

<!-- Scroll progress bar -->
<div
  class="progress-bar"
  style="width: {($scrollyIndex ?? 0) / (data.steps.length + 1) * 100}%"
></div>

<div class="wrapper" style:pointer-events={$scrollyIndex === 0 ? "auto" : "auto"}>
  <div class="foreground-wrapper">
    <ScrollyStepWrapper height="100vh">
      <ScrollyStep active={$scrollyIndex === 0}>
          <Title active={$scrollyIndex === 0}/>
      </ScrollyStep>
    </ScrollyStepWrapper>

    {#each data.steps as step, i}
      <ScrollyStepWrapper>
        <ScrollyStep active={$scrollyIndex === i + 1}>
          <div class="step-container">
            <ScrollyStepContent step={step} />
            <img src={step.figure} alt="illustration" class="corner-figure" />
          </div>
        </ScrollyStep>
      </ScrollyStepWrapper>
    {/each}

    <div class="spacer" />
  </div>

  <div class="background-wrapper">
    <!-- <Gaussian /> -->
     <G2/>
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

  /*
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
  }*/

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

    .step-container {
      padding: 1rem;
    }
  }

  .corner-figure {
    position: absolute;
    bottom: -4rem;
    right: -2rem;
    width: 150px;
    height: auto;
    opacity: 0.85;
    pointer-events: none;
  }
</style>
