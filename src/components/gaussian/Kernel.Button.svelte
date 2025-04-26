<button class="kernel-button" role="button" onclick="toggleButton(this)">Kernel</button>

<style>
    .kernel-button {
        appearance: none;
        background-color: #000000;
        border: 2px solid #1A1A1A;
        border-radius: 15px;
        box-sizing: border-box;
        color: #FFFFFF;
        cursor: pointer;
        display: inline-block;
        font-family: Roobert, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 16px;
        font-weight: 600;
        line-height: normal;
        margin: 0;
        height: 60px; /* Altura fixa */
        width: 200px; /* Largura fixa */
        outline: none;
        padding: 16px 24px;
        text-align: center;
        text-decoration: none;
        transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        will-change: transform, background-color, box-shadow;
        position: relative;
        overflow: hidden;
    }

    .kernel-button.white {
        background-color: #FFFFFF;
        color: #000000;
    }

    .kernel-button:hover {
        box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
        transform: translateY(-2px);
    }
</style>

<script>
    function toggleButton(button) {
        button.classList.toggle('white');
    }
</script>