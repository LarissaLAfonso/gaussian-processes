<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import * as auxiliares from '$components/plots/auxiliares.js'; // Import the auxiliary functions

    let svgContainer;

    let width = 800;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Range dos dados
    const Xvalues = d3.range(0, 10.01, 0.2);

    // Mean zero
    const mean = Array(Xvalues.length).fill(0);
    // Variance 1
    const variance = Array.from({ length: Xvalues.length }, (_, i) =>
        Array.from({ length: Xvalues.length }, (_, j) => (i === j ? 1 : 0))
    );

    let data = [];

    onMount(() => {
        const Yvalues = auxiliares.sampleNormal(mean, variance);

        // For each element in Xvalues, create an object with that value and the corresponding Y value
        data = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));

        const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)) // Get the extent of x values
        .range([margin.left, width - margin.right]); // Set the range for x scale

        const yExtent = d3.extent(data, d => d.y);
        const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

        const yScale = d3.scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([height - margin.bottom, margin.top]);

        const svg = d3.select(svgContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

        // Draw points
        svg.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
        .attr('fill', 'black');

        // Y axis
        svg.append('line')
        .attr('x1', xScale(0))
        .attr('y1', height - margin.bottom)
        .attr('x2', xScale(0))
        .attr('y2', margin.top)
        .attr('stroke', 'black');

        // X axis (positive side only)
        svg.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(0))
        .attr('x2', width - margin.right)
        .attr('y2', yScale(0))
        .attr('stroke', 'black');
    });
</script>

<div bind:this={svgContainer}></div>