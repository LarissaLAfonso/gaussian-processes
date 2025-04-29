<script>
  import G1 from "$components/plots/grafico1.svelte";
  import G2 from "$components/plots/grafico2.svelte";
  import G3 from "$components/plots/grafico3.svelte";
  import G4 from "$components/plots/scatter_prior.svelte";
  import G5 from "$components/plots/prior.svelte";
  import G6 from "$components/plots/grafico4.svelte";
  import G7 from "$components/plots/individualKernels.svelte";
  import G8 from "$components/plots/allKernels.svelte";
  
  export let activeStep;
</script>

{#if activeStep === 1}
  <G1 />
{:else if activeStep === 2}
  <G2 />
{:else if activeStep === 3}
  <G3 />
{:else if activeStep === 4}
<G4 />
{:else if activeStep === 5}
<G5 />
{:else if activeStep === 6}
<G6 />
{:else if activeStep === 7}
<G7 />
{:else if activeStep === 8}
<G8 />
{/if}