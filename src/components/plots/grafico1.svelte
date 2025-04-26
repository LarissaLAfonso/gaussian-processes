<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';

    // 1. First verify the auxiliares import works
    let auxLoaded = false;
    let importError = null;
    
    try {
        import('$components/plots/auxiliares.js')
            .then(module => {
                window.auxiliares = module; // Temporarily expose for debugging
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
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Range dos dados
    const Xvalues = d3.range(0.2, 9.90, 0.3);

    onMount(() => {
        console.log('Component mounted - starting render');
        
        // 2. Create test data if auxiliares fails to load
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

        // 3. Create data points
        const data = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));

        // 4. Get SVG element
        const svgEl = document.getElementById('gp-svg');
        if (!svgEl) {
            console.error('SVG element not found! Check your HTML');
            return;
        }

        // 5. Clear previous content
        svgEl.innerHTML = '';

        // 6. Setup scales
        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([-3, 3])
            .range([height - margin.bottom, margin.top]);

        // 7. Create SVG
        const svg = d3.select(svgEl)
            .attr('width', width)
            .attr('height', height);

        // 8. Draw points (simplified)
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.x))   
            .attr('cy', d => yScale(d.y))
            .attr('r', 3)
            .attr('fill', 'black');

        // 9. Draw axes
        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(10))
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('opacity', 0.5);

        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', yScale(-4))
            .attr('y2', yScale(4))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('opacity', 0.5);

        console.log('Render completed');
    });
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