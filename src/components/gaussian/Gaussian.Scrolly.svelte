<script>
  import data from "$components/data/data.json";
  import Title from "$components/gaussian/Title.svelte";
  import Gaussian from "$components/gaussian/Gaussian.svelte";
  import ScrollyStepWrapper from "$components/layouts/Scrolly.StepWrapper.svelte";
  import ScrollyStepContent from "$components/layouts/Scrolly.StepContent.svelte"; 
  import ScrollyStep from "$components/layouts/Scrolly.Step.svelte";
  import Footer from "$components/gaussian/Footer.svelte";

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

<!-- Scroll progress bar -->
<div
  class="progress-bar"
  style="width: {($scrollyIndex ?? 0) / (data.steps.length + 1) * 100}%"
></div>

<div class="wrapper" style:pointer-events={$scrollyIndex === 0 ? "none" : "auto"}>
  <div class="foreground-wrapper">
    <ScrollyStepWrapper height={"100vh"}>
      <Title />
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
    <Gaussian activeStep={$scrollyIndex}/>
  </div>
</div>
<!---->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

  :global(body) {
    font-family: 'Inter', sans-serif;
    background: #f9fafb;
    color: #222;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .wrapper {
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
    min-height: 100vh;
    position: relative;
  }

  .foreground-wrapper {
    flex: 1 1 45%;
    padding: clamp(1rem, 3vw, 2rem);
    z-index: 10;
    max-width: 800px;
    margin: 0 auto;
  }

  .background-wrapper {
    position: sticky;
    top: 0;
    height: 100vh;
    flex: 1 1 55%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .spacer {
    height: clamp(20vh, 30vw, 40vh);
  }

  .step-container {
    font-family: 'Fredoka', sans-serif;
    position: relative;
    padding: clamp(1.5rem, 3vw, 2rem);
    margin: clamp(1rem, 2vw, 1.5rem) 0vw;
    background: #ecfdf7;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 100%; /* Ensure full width of container */
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: clamp(3px, 0.4vw, 4px);
    background-color: #29996c;
    transition: width 0.2s ease;
    z-index: 1000;
  }

  .corner-figure {
    position: absolute;
    bottom: clamp(-3rem, -5vw, -4rem);
    right: clamp(-2rem, -5vw, -2rem);
    width: clamp(120px, 20vw, 160px); 
    height: auto;
    opacity: 0.85;
    pointer-events: none;
  }

  @media screen and (max-width: 768px) {
    .foreground-wrapper {
      padding: 1rem 1.5rem; /* More horizontal padding on mobile */
    }

    .step-container {
      font-size: 1.3rem; /* Larger base size for mobile */
      padding: 1.5rem;
      margin: 1.25rem 0;
    }

    .corner-figure {
      width: 140px; /* Larger image on mobile */
      right: -1.5rem;
    }
  }

  @media (max-width: 480px) {
    .step-container {
      font-size: 1.2rem;
      padding: 1.25rem;
      margin: 1rem 0;
    }

    .corner-figure {
      width: 100px;
      right: -1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .step-container,
    .progress-bar {
      transition: none;
    }
  }
</style>