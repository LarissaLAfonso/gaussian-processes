
<script>
  export let step;
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

<style>
  .step-section {
    background-color: #e0f8e0;
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 6rem;
  }

  .text-content {
    margin-top: 1rem;
  }
</style>
