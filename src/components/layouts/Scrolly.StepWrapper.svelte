<script>
    export let height = "80vh";
</script>

<!-- This component is used to wrap the content of each step in the Scrolly component.
  It provides a consistent height for each step and allows for custom styling. -->
<!-- It also allows for the use of slots to pass in custom content. -->
<div class="step-wrapper" style="height: {height}; display: flex; align-items: center; justify-content: center;">
    <slot />
</div>  

<style>
div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
</style>