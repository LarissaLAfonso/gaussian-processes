<script>
    import data from "$components/data/data.json";
</script>

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
  