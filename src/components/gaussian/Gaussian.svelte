<script>
  import G1 from "$components/plots/grafico1.svelte";
  import G2 from "$components/plots/grafico2.svelte";
  import G3 from "$components/plots/scatter_prior.svelte";
  import G4 from "$components/plots/line_prior.svelte";
  import G6 from "$components/plots/individualKernels.svelte";
  import G7 from "$components/plots/allKernels.svelte";
  import G8 from "$components/plots/posterior.svelte";
  
  export let activeStep;
</script>

{#if activeStep === 1 || activeStep === 2}
  <G1 activeStep={activeStep}/>
{:else if activeStep === 3}
  <G2 />
{:else if activeStep === 4 || activeStep === 5 || activeStep === 6}
  <G3/>
{:else if activeStep === 8 || activeStep === 7 || activeStep === 9 || activeStep === 10}
<G4 />
{:else if activeStep === 11 || activeStep === 12}
<G6 />
{:else if activeStep === 13}
<G7 />
{:else if activeStep === 14}
<G8 />
{/if}