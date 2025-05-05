<script>
    export let height = "min(100vh, 800px)";
</script>

<div class="step-wrapper" style:height>
    <slot />
</div>  

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
    }

    .step-wrapper {
        height: auto;
        min-height: clamp(300px, 80vh, 800px);
        padding: clamp(1rem, 3vw, 2rem);
        padding-right: 5vw;
        padding-left: 0;
        margin: clamp(0.5rem, 2vw, 1.5rem) 0;
        position: relative;
        overflow: hidden;
    }

    /* Mobile-first adjustments */
    @media (max-width: 768px) {
        .step-wrapper {
            min-height: 250px;
            justify-content: flex-start;
            padding: 1rem;
        }

        div {
            align-items: flex-start;
        }
    }

    /* Tablet landscape optimization */
    @media (min-width: 769px) and (max-width: 1024px) {
        .step-wrapper {
            min-height: 65vh;
        }
    }

    /* Touch device adjustments */
    @media (hover: none) and (pointer: coarse) {
        .step-wrapper {
            min-height: 70vh;
            scroll-snap-align: start;
        }
    }
</style>