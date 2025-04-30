<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { sharedData } from '$stores/graphData.js';

    export let scrollyIndex;

    let svg;
    let data = [];
    let xScale, yScale;

    let auxLoaded = false;
    let importError = null;

    try {
        import('$components/plots/auxiliares.js')
            .then(module => {
                window.auxiliares = module;
                auxLoaded = true;
                console.log('auxiliares loaded successfully', module);
            })
            .catch(err => {
                importError = err;
                console.error('Failed to load auxiliares:', err);
            });
    } catch (err) {
        importError = err;
        console.error('Import error:', err);
    }

    let width = 600;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 20 };

    const Xvalues = d3.range(0.2, 9.90, 0.3);

    onMount(() => {
        console.log('Component mounted - starting render');

        let Yvalues;
        if (!auxLoaded) {
            console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0)
                    .map(() => Array(Xvalues.length).fill(0));
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
                console.log('Generated data using auxiliares');
            } catch (err) {
                console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }

        data = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));

        const svgEl = document.getElementById('gp-svg');
        if (!svgEl) {
            console.error('SVG element not found! Check your HTML');
            return;
        }

        svgEl.innerHTML = '';

        xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([margin.left, width - margin.right]);

        yScale = d3.scaleLinear()
            .domain([-3, 3])
            .range([height - margin.bottom, margin.top]);

        svg = d3.select(svgEl)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.x))   
            .attr('cy', d => yScale(d.y))
            .attr('r', 3)
            .attr('fill', 'black');

        svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 5)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 z')
            .attr('fill', 'black');

        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(10) + 10)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');

        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', yScale(-3))
            .attr('y2', yScale(3) - 10)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');
    });

    $: if (scrollyIndex === 2 && svg && data.length) {
        svg.selectAll('.highlight-line').remove();
        data.forEach((point, i) => {
            setTimeout(() => {
                svg.append('line')
                    .attr('class', 'highlight-line')
                    .attr('x1', xScale(0))
                    .attr('x2', xScale(point.x))
                    .attr('y1', yScale(point.y))
                    .attr('y2', yScale(point.y))
                    .attr('stroke', 'red')
                    .attr('stroke-dasharray', '4,2')
                    .attr('stroke-width', 1.5)
                    .attr('opacity', 0.8);
            }, i * 150);
        });
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 1rem;
    }
</style>

<div class="container">
    <svg id="gp-svg" width="800" height="400"></svg>
</div>
