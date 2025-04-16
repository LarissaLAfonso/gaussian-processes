<script>
    import Link from "$components/gaussian/Link.svelte";
  
    export let href;
</script>

<a href={href} target="_blank" rel="noopener noreferrer" class="icon-link">
    <slot name="icon" />

    <div class="visually-hidden">
        <slot name="label" />
    </div>
</a>

<style>
    .visually-hidden {
        position: absolute;
        overflow: hidden;
        clip: rect(0 0 0 0);
        height: 1px;
        width: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
    }

    .icon-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    pointer-events: auto;
    }
</style>