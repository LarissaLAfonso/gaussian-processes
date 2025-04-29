<script>
    import GaussianScrolly from "$components/gaussian/Gaussian.Scrolly.svelte";
    import Footer from "$components/gaussian/Footer.svelte";
    import scrollY from "$stores/scrollY.js";
    import Title from "$components/gaussian/Title.svelte";
    import Notification  from "$components/gaussian/Notification.svelte";
    import Loading from "$components/gaussian/LoadingSpinner.svelte";
    import mediaQueries from "$stores/mediaQueries.js";
    import { onMount } from "svelte";
  
    let mounted = false; // Declare scrollyIndex as a writable store
  
    onMount(() => { // Prevents the page from showing until the app is mounted
      mounted = true;
    });
</script>

<svelte:head>
  <title>❥ Gaussian Processes </title>
  <script type="text/javascript" async
    src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
  </script>
</svelte:head>

<!--If the app is not mounted, show loading spinner-->
{#if !mounted}
  <Loading />
{:else}

  <!--If on desktop, show scroll driven story-->
  {#if $mediaQueries["50rem"]}
    <section id="scrolly">
      <GaussianScrolly />
    </section>
    <Footer />

  <!--If on mobile, show static page-->
  {:else}
    <div class="header-wrapper">
      <Title />
    </div>
    <Notification />
  {/if}
  
{/if}