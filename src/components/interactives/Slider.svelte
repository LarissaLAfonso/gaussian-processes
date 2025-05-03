<script>
    export let sliderLabel = "Slider Label";
    export let minValue = 0.1;
    export let maxValue = 3;
    export let stepValue = 0.1;
    export let associatedValue = 0.1;
    export let updateFunction = () => {};
</script>


<div class="slider-container">
    <label class="slider-label">{sliderLabel}: {associatedValue}</label>
    <input type="range" min={minValue} max={maxValue} step={stepValue} value={associatedValue} on:input={updateFunction} class="slider"/>
    <div class="range-labels">
    </div>
</div>

<style>
    .slider-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .slider {
        width: 200px;
        height: 8px;
        border-radius: 10px;
        background-color: #e0e0e0;
        outline: none;
        transition: background-color 0.5s ease;
        -webkit-appearance: none;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #52DBA4;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #52DBA4;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .slider:hover {
        background-color: #d0d0d0;
    }

    .slider-label {
        margin-bottom: 5px;
        font-size: 16px;
    }
</style>