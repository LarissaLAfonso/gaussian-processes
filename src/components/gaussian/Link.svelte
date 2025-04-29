<script>
    export let href; // A prop (a value passed from the outside)
</script>

<a {href} target="_blank" rel="noopener noreferrer"> <!-- The link opens in a new tab and is safe from reverse tabnabbing -->
    <slot /> <!-- Allows inserting custom link text or content when using the component -->
</a>
