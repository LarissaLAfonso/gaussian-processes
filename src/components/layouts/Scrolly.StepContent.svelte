<script>
    import data from "$components/data/data.json";
    import katex from "katex";
    import "katex/dist/katex.min.css";

    function renderMath(html) {
    return html
        .replace(/\$\$([^$]+)\$\$/g, (_, math) =>
        katex.renderToString(math, { displayMode: true })
        )
        .replace(/\\\(([^)]+)\\\)/g, (_, math) =>
        katex.renderToString(math, { displayMode: false })
        );

    }
</script>

<!--
This component is used to display the content of each step in the Scrolly component.
It iterates through the data and renders the content based on the type of each item.

The component uses Svelte's reactive features to update the content dynamically as the user scrolls through the steps.
-->

{#each data.steps as step}
  <section class="step-section">
    {#each step.value as block}
      {#if block.type === "SectionTitle"}
        <h2>{block.props.index} {block.props.title}</h2>

      {:else if block.type === "p"}
        <p>
          {#each block.value as item}
            <div class="text-content">
              {@html renderMath(item.value)}
            </div>
          {/each}
        </p>

      {:else if block.type === "text"}
        <p>{@html renderMath(block.value)}</p>
      {/if}
    {/each}
  </section>
{/each}

<style>
    .step-section {
      margin-bottom: 6rem; /* bigger spacing between sections */
    }
  
    .text-content {
      margin-top: 1rem;
    }
</style>  