<script>
    export let maxWidth = "90%"; // Changed from 50ch
    export let padding = "clamp(1rem, 5vw, 2rem)"; // Responsive padding
</script>

<div style:max-width={maxWidth} style:padding-left={padding} style:padding-right={padding}>
    <slot />
</div>

<style>
    div {
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        max-width: var(--max-width, 1200px); /* Consider CSS custom property */
    }
</style>