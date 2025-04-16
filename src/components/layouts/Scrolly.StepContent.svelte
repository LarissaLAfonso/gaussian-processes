<script>
    import data from "$components/data/data.json";
</script>

<!--
This component is used to display the content of each step in the Scrolly component.
It iterates through the data and renders the content based on the type of each item.

The component uses Svelte's reactive features to update the content dynamically as the user scrolls through the steps.
-->
{#each data.steps as step} 
    {#each step.value as block}
        {#if block.value}
            {#each block.value as item}
                {#if item.type === "text"}
                    {@html item.value}
                {/if}
            {/each}
        {/if}
    {/each}
{/each}
  