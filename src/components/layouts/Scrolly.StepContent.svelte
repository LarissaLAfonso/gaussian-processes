<script>
  export let step;
  import katex from "katex";
  import "katex/dist/katex.min.css";
  import { onMount } from "svelte";

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

    {#if block.type === "p"}
      <div class="paragraph-container">
        {#each block.value as item}
          <div class="text-content">
            {@html renderMath(item.value)}
          </div>
        {/each}
      </div>

    {:else if block.type === "text"}
      <div class="text-content">
        {@html renderMath(block.value)}
      </div>
    {/if}
  {/each}
</section>

<style>
  .step-section {
    background-color: #e0f8e0;
    padding: clamp(1rem, 3vw, 1.5rem);
    border-radius: 0.75rem;
    margin: clamp(1rem, 2vw, 1.5rem) 0; /* Uniform vertical margins */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
  }

  .paragraph-container {
    display: flex;
    flex-direction: column;
    gap: clamp(0.75rem, 1.5vw, 1rem); /* Increased gap for better rhythm */
  }

  .text-content {
    font-size: clamp(1rem, 1vw + 0.5rem, 3.5rem);
    line-height: 1.6;
    margin: clamp(0.25rem, 0.5vw, 1rem) 0;
    text-indent: 1.5em; /* Added indentation */
    padding-left: 0.5em; /* Small padding to prevent edge cases */
  }

  .text-content :global(.katex) {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.25rem 0;
  }

  @media (max-width: 768px) {
    .step-section {
      border-radius: 0.5rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }

    .text-content {
      line-height: 1.5;
    }
  }

  @media (min-width: 1600px) {
    .step-section {
      padding: 1.75rem;
    }
  }

  @media (hover: hover) {
    .step-section:hover {
      transform: translateX(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .step-section {
      transition: none;
    }
  }
</style>