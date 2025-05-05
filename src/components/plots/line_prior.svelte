<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { generateGPSamples, kernel_Periodic } from '$components/generate_data_prior/auxiliares';
    import description from '$components/data/descriptions.json';
    import HelperText from "../layouts/HelperText.svelte";

    // Constants
    const start = -5;
    const end = 5;
    const numberOfPoints = 50;
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

        // Delimitação para pontos não ficarem fora do gráfico
        svg.append("defs")
            .append("clipPath")
            .attr("id", "plot-clip")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", 0)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height);

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        // Initialize scales (same domains as first component)
        xScale.domain([start, end])
            .range([margin.left, width - margin.right]);
        
        yScale.domain([-3, 3])
            .range([height - margin.bottom, margin.top]);

        // Create groups (from second component)
        svg.append('g').attr('id', 'points-group').attr("clip-path", "url(#plot-clip)");
        svg.append('g').attr('id', 'axes-group');
        svg.append('g').attr('id', 'line-group').attr("clip-path", "url(#plot-clip)");

        // Eixo x
        svg.append('line')
            .attr('x1', xScale(-5))
            .attr('x2', xScale(5))
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');

        // Eixo y
        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', yScale(-3))
            .attr('y2', yScale(3))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');

        // Labels dos eixos
        svg.append("text")
            .attr("x", xScale(5) + 5)
            .attr("y", yScale(0) + 3)
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .text("x")
            .style("user-select", "none");

        svg.append("text")
            .attr("x", xScale(0) + 5)
            .attr("y", yScale(3) + 10)
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .text("f(x)")
            .style("user-select", "none");

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
                .attr('id', 'confidence-band')
                .attr('x', margin.left)
                .attr('width', width - margin.left - margin.right)
                .attr('y', bandTop)
                .attr('height', bandBottom - bandTop)
                .attr('fill', '#add8e6')
                .attr('opacity', 0);
        }

        confBand.transition()
            .duration(2000)
            .attr('opacity', 0.3);

        // Linhas de referência
        const lines = [
            { y: 2 * sigma, id: 'u-plus-2sigma', text: 'u + 2σ', dashed: true },
            { y: -2 * sigma, id: 'u-minus-2sigma', text: 'u - 2σ', dashed: true }
        ];

        lines.forEach(({ y, id, text, dashed }) => {
            let line = svg.select(`#${id}`);
            if (line.empty()) {
                line = svg.select('#axes-group')
                    .append('line')
                    .attr('id', id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('opacity', 0); // Inicialmente invisível
            }

            line
                .attr('x1', margin.left)
                .attr('x2', width - margin.right)
                .attr('y1', yScale(y))
                .attr('y2', yScale(y))
                .attr('stroke-dasharray', dashed ? '4 2' : null)
                .transition() // Animação de aparecimento
                .delay(2500)
                .duration(500)
                .attr('opacity', 1);

            let label = svg.select(`#${id}-text`);
            if (label.empty()) {
                label = svg.append('text')
                    .attr('id', `${id}-text`)
                    .attr('opacity', 0); // Inicialmente invisível
            }
            
            label
                .attr('x', margin.left + 5)
                .attr('y', yScale(y) - 7)
                .attr('text-anchor', 'left')
                .attr('font-size', '14px')
                .attr('fill', 'black')
                .text(text)
                .transition() // Animação de aparecimento
                .delay(2500)
                .duration(500)
                .attr('opacity', 1);
        });

        // Label u = 0 (animado no final)
        svg.append('text')
            .attr('id', 'u-zero-text')
            .attr('x', margin.left + 5)
            .attr('y', yScale(0) - 7)
            .attr('text-anchor', 'left')
            .attr('font-size', '14px')
            .attr('fill', 'black')
            .attr('opacity', 0) // Inicialmente invisível
            .transition()
            .delay(2500)
            .duration(500)
            .attr('opacity', 1)
            .text('u = 0');

        // Animação dos pontos
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

        // Animação da linha principal
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
            .attr('stroke-dasharray', function() {
                const totalLength = this.getTotalLength();
                return totalLength + " " + totalLength;
            })
            .attr('stroke-dashoffset', function() {
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
</style>

<div class="main-container" bind:this={containerElement}>
    <svg id="gp-svg"></svg>
    <HelperText>
        <p>{description[1].text}</p>
    </HelperText>
</div>