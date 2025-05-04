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
    let width, height, margin;

    // Initialize scales
    let xScale = d3.scaleLinear();
    let yScale = d3.scaleLinear();

    function generateData() {
        const samples = generateGPSamples(kernelFunction, start, end, step, seed);
        initialSamples = samples.y;
    }

    function createVisualization() {
        if (!containerElement) return;

        // Dynamic sizing like first component
        width = containerElement.clientWidth;
        height = Math.min(width * 0.6, 500);
        margin = { top: 20, right: 30, bottom: 40, left: 50 };

        // Create or update SVG (same as first component)
        svg = d3.select('#gp-svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);

        // Clear previous content
        svg.selectAll('*').remove();

        // Add border (from second component)
        svg.append('rect')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', width - margin.left - margin.right)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('shape-rendering', 'crispEdges');

        // Add clip path (from second component)
        svg.append("defs")
            .append("clipPath")
            .attr("id", "plot-clip")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", 0)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height);

        // Initialize scales (same domains as first component)
        xScale.domain([start, end])
            .range([margin.left, width - margin.right]);
        
        yScale.domain([-3, 3])
            .range([height - margin.bottom, margin.top]);

        // Create groups (from second component)
        svg.append('g').attr('id', 'points-group').attr("clip-path", "url(#plot-clip)");
        svg.append('g').attr('id', 'axes-group');
        svg.append('g').attr('id', 'line-group').attr("clip-path", "url(#plot-clip)");

        // Plot samples (from second component's plotSamples)
        const data = initialSamples.map((y, i) => ({
            x: start + i * step,
            y: y
        }));

        // Confidence band (from second component)
        let confBand = svg.select('#confidence-band');
        const sigma = 1;
        const bandTop = yScale(2 * sigma);
        const bandBottom = yScale(-2 * sigma);

        if (confBand.empty()) {
            confBand = svg.insert('rect', '#axes-group')
                .attr('id', 'confidence-band');
        }

        confBand
            .attr('x', margin.left)
            .attr('width', width - margin.left - margin.right)
            .attr('y', bandTop)
            .attr('height', bandBottom - bandTop)
            .attr('fill', '#add8e6')
            .attr('opacity', 0.3);

        // Reference lines (from second component)
        const lines = [
            { y: 0, id: 'u-zero-line', text: 'u = 0', dashed: false },
            { y: 2 * sigma, id: 'u-plus-2sigma', text: 'u + 2σ', dashed: true },
            { y: -2 * sigma, id: 'u-minus-2sigma', text: 'u - 2σ', dashed: true }
        ];

        lines.forEach(({ y, id, text, dashed }) => {
            let line = svg.select(`#${id}`);
            if (line.empty()) {
                svg.select('#axes-group')
                    .append('line')
                    .attr('id', id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);
                line = svg.select(`#${id}`);
            }

            line
                .attr('x1', margin.left)
                .attr('x2', width - margin.right)
                .attr('y1', yScale(y))
                .attr('y2', yScale(y))
                .attr('stroke-dasharray', dashed ? '4 2' : null);

            let label = svg.select(`#${id}-text`);
            if (label.empty()) {
                label = svg.append('text')
                    .attr('id', `${id}-text`);
            }
            label
                .attr('x', margin.left + 30)
                .attr('y', yScale(y) - 7)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text(text);
        });

        // Points (from second component)
        const points = svg.select('#points-group')
            .selectAll('circle')
            .data(data, d => d.x);

        points.enter()
            .append('circle')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 4)
            .attr('fill', '#47A2A4')
            .attr('opacity', 0.8)
            .merge(points)
            .transition()
            .duration(500)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y));

        points.exit().remove();

        // Connecting line (from second component)
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        let path = svg.select('#line-group').selectAll('path').data([data]);
        const totalDuration = 2000;

        path.enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', '#47A2A4')
            .attr('stroke-width', 2)
            .attr('d', line)
            .attr('stroke-dasharray', function () {
                const totalLength = this.getTotalLength();
                return totalLength + " " + totalLength;
            })
            .attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            })
            .transition()
            .duration(totalDuration)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0)
            .on('end', () => {
                svg.select('#points-group')
                    .selectAll('circle')
                    .transition()
                    .duration(500)
                    .attr('r', 12)
                    .attr('opacity', 0)
                    .remove();
            });

        path.exit().remove();
    }

    onMount(() => {
        generateData();
        createVisualization();

        // Handle window resize (same as first component)
        const handleResize = () => {
            createVisualization();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });
</script>

<style>
    /* From first component */
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

    /* From second component */
    .explanation {
        background-color: #e5e7eb;
        border-radius: 12px;
        margin-top: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        text-align: justify;
        color: #333;
    }
</style>

<div class="main-container" bind:this={containerElement}>
    <svg id="gp-svg"></svg>
    <div class="explanation">
        <p>{description[0].text}</p>
    </div>
</div>