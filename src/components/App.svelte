<script>
    import GaussianScrolly from "$components/gaussian/Gaussian.Scrolly.svelte";
    import Footer from "$components/gaussian/Footer.svelte";
    import scrollY from "$stores/scrollY.js";
    import Title from "$components/gaussian/Title.svelte";
    import Notification  from "$components/gaussian/Notification.svelte";
    import Loading from "$components/gaussian/LoadingSpinner.svelte";
    import mediaQueries from "$stores/mediaQueries.js";
    import { onMount } from "svelte";
    import * as tf from "@tensorflow/tfjs";
    import MultivariateNormal from "multivariate-normal";
  
    let mounted = false;

    var meanVector = [1, 2, 3];

    // covariance between dimensions. This examples makes the first and third
    // dimensions highly correlated, and the second dimension independent.
    var covarianceMatrix = [
        [ 1.0, 0.0, 0.9 ],
        [ 0.0, 1.0, 0.0 ],
        [ 0.9, 0.0, 1.0 ],
    ];
    
    // var aa = MultivariateNormal(meanVector, covarianceMatrix);
  
  
    onMount(() => { // Prevents the page from showing until the app is mounted
      mounted = true;
    });
</script>

<!--If the app is not mounted, show loading spinner-->
{#if !mounted}
  <Loading />
{:else}
  <!--If on desktop show scroll driven story-->
  {#if $mediaQueries["50rem"]}
    <section id="scrolly">
      <GaussianScrolly />
    </section>
  <!--If on mobile, show static page-->
  {:else}
    <div class="header-wrapper">
      <Title />
    </div>
    <Notification />
  {/if}

  <Footer />
  
{/if}