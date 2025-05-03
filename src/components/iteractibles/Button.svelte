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
        margin-top: 20px;
    }
    button {
        padding: 10px 20px;
        background-color: #ff968a;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #45a049;
    }

</style>