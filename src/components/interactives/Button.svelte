<script>
    export let label = "Click me";
    export let onClick = () => {};
</script>

<div class="button-wrapper">
    <button on:click={onClick} class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
        {label}
    </button>
</div>

<style>
    .button-wrapper {
        text-align: center;
        margin-top: 1rem;
    }

    button {
        padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem);
        background-color:#e9a982;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: clamp(1rem, 1.2vw, 1.25rem);
        transition: all 0.3s ease;
        font-family: 'Fredoka', sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background-color: #3de467;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

</style>