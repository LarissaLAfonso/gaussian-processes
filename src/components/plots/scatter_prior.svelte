<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { generateGPSamples, kernel_Periodic } from '$components/generate_data_prior/auxiliares';
    import description from '$components/data/descriptions.json';

    // Constants
    const start = -5;
    const end = 5;
    const numberOfPoints = 28;
    const step = (end - start) / (numberOfPoints - 1);
    const seed = 0.5;
    const kernelFunction = (x, y) => kernel_Periodic(x, y, 0.5, 1.0);


    // Reactive state
    let initialSamples = [];
    let containerElement;
    let svg;

    // Initialize scales
    let xScale = d3.scaleLinear();
    let yScale = d3.scaleLinear();

    function generateData() {
        const samples = generateGPSamples(kernelFunction, start, end, step, seed);
        initialSamples = samples.y;
    }

    function createVisualization() {
        if (!containerElement) return;

        const width = containerElement.clientWidth;
        const height = Math.min(width * 0.6, 500);
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        // Create or update SVG
        svg = d3.select('#gp-svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);

        // Clear previous content
        svg.selectAll('*').remove();

        // Update scales
        xScale.domain([start, end])
            .range([margin.left, width - margin.right]);
        
        yScale.domain([-3, 3])
            .range([height - margin.bottom, margin.top]);

        // Plot samples
        const data = initialSamples.map((y, i) => ({
            x: start + i * step,
            y: y
        }));

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 4)
            .attr('fill', '#47A2A4')
            .attr('opacity', 0.8);
    }

    onMount(() => {
        generateData();
        createVisualization();

        // Handle window resize
        const handleResize = () => {
            createVisualization();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });
</script>

<style>
    .main-container {
        width: 90%;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1.5rem;
    }

    #gp-svg {
        width: 100%;
        height: auto;
        min-height: 300px;
        display: block;
        margin-bottom: 1rem;
        overflow: visible;
    }

    .explanation {
        padding: 1rem;
        background: #f0f0f0;
        border-radius: 8px;
        font-family: 'Fredoka', sans-serif;
    }
</style>

<div class="main-container" bind:this={containerElement}>
    <svg id="gp-svg"></svg>
    <div class="explanation">
        <p>{description[0].text}</p>
    </div>
</div>