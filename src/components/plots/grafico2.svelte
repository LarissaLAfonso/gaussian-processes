<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { scaleLinear } from 'd3-scale';
    import { abs, secondRadiationDependencies } from 'mathjs';
    import * as auxiliares from '$components/plots/auxiliares.js';
    import { sharedData } from '$stores/graphData.js';

    import Button from '$components/interactives/Button.svelte';
    
    const auxLoaded = false;
    
    const margin = 20;
    const containerWidth = 800;
    const containerHeight = 400;
    const leftWidth = containerWidth / 2 - margin * 2;
    const leftHeight = containerHeight - margin * 2;
    const rightWidth = containerWidth / 2 - margin * 2;
    const rightHeight = containerHeight - margin * 2;
    
    let Xvalues = [1, 5, 9];
    
    function createViz(Xvalues, Yvalues) {
        const points2D = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));
    
        const leftSvg = d3.select('#left-plot');
        const rightSvg = d3.select('#right-plot');
    
        const xScale2D = d3.scaleLinear().domain([-2, 10]).range([margin, leftWidth - margin]);
        const yScale2D = d3.scaleLinear().domain([-3, 3]).range([leftHeight - margin, margin]);
        const realScale = d3.scaleLinear().domain([-3, 3]).range([-1, 1]);
    
        leftSvg.selectAll('*').remove();
        rightSvg.selectAll('*').remove();

        // Adiciona marcador de seta
        rightSvg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 5)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 z')
            .attr('fill', 'black');

    
        const firstColor = '#D99CA7';
        const secondColor = '#CCD9D1';
        const thirdColor = '#403231';
    
        const angle = Math.PI / 6;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
    
        function project3D(x, y, z) {
            return {
                x: (x - z) * cosAngle,
                y: y + (x + z) * sinAngle
            };
        }
    
        const point3D = { x: points2D[0].y, y: points2D[1].y, z: points2D[2].y };
        const scaledPoint = {
            x: realScale(point3D.x),
            y: realScale(point3D.y),
            z: realScale(point3D.z)
        };
        const projectedPoint = project3D(scaledPoint.x, scaledPoint.y, scaledPoint.z);
    
        // Prepare dynamic scaling
        const projections = [
            project3D(scaledPoint.x, 0, 0),
            project3D(0, scaledPoint.y, 0),
            project3D(0, 0, scaledPoint.z),
            projectedPoint,
            project3D(-1, 0, 0),
            project3D(1, 0, 0),
            project3D(0, -1, 0),
            project3D(0, 1, 0),
            project3D(0, 0, -1),
            project3D(0, 0, 1)
        ];
        const xs = projections.map(p => p.x);
        const ys = projections.map(p => p.y);
        const xScale3D = d3.scaleLinear().domain([Math.min(...xs), Math.max(...xs)]).range([margin, rightWidth - margin]);
        const yScale3D = d3.scaleLinear().domain([Math.min(...ys), Math.max(...ys)]).range([rightHeight - margin, margin]);
    
        // Draw Left plot
        leftSvg.selectAll('line.highlight')
            .data(points2D)
            .enter()
            .append('line')
            .attr('class', 'highlight')
            .attr('x1', d => xScale2D(d.x))
            .attr('x2', d => xScale2D(d.x))
            .attr('y1', yScale2D(0))
            .attr('y2', d => yScale2D(d.y))
            .attr('stroke', (d, i) => [firstColor, secondColor, thirdColor][i])
            .attr('stroke-width', 3);
    
        leftSvg.selectAll('circle')
            .data(points2D)
            .enter()
            .append('circle')
            .attr('cx', d => xScale2D(d.x))
            .attr('cy', d => yScale2D(d.y))
            .attr('r', 5)
            .attr('fill', 'black');

        leftSvg.selectAll('text.label')
            .data(points2D)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => xScale2D(d.x) + 8)
            .attr('y', d => yScale2D(d.y) - 8)
            .text((d, i) => ['x', 'y', 'z'][i])
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .attr('font-family', 'Inter, sans-serif');

    
        leftSvg.append('line')
            .attr('x1', xScale2D(0))
            .attr('x2', xScale2D(10))
            .attr('y1', yScale2D(0))
            .attr('y2', yScale2D(0))
            .attr('stroke', 'black')
            .attr('opacity', 0.3)
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrow)');
    
        leftSvg.append('line')
            .attr('x1', xScale2D(0))
            .attr('x2', xScale2D(0))
            .attr('y1', yScale2D(-3))
            .attr('y2', yScale2D(3))
            .attr('stroke', 'black')
            .attr('opacity', 0.3)
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrow)');

        const arrowSize = 8;

        const positiveEnds = [
            { pos: project3D(1, 0, 0), rotation: 2*angle * (180 / Math.PI) },  // X axis → -30°
            { pos: project3D(0, 1, 0), rotation: 0},   // Y axis → +30°
            { pos: project3D(0, 0, 1), rotation: 2*-angle * (180 / Math.PI) }                          // Z axis → 0°
        ];

    
        // Draw Right 3D plot
        // Draw standard axis lines
        const axisLines = [
            { start: project3D(-1, 0, 0), end: project3D(1, 0, 0) },
            { start: project3D(0, -1, 0), end: project3D(0, 1, 0) },
            { start: project3D(0, 0, -1), end: project3D(0, 0, 1) }
        ];
    
        axisLines.forEach(line => {
            rightSvg.append('line')
                .attr('x1', xScale3D(line.start.x))
                .attr('y1', yScale3D(line.start.y))
                .attr('x2', xScale3D(line.end.x))
                .attr('y2', yScale3D(line.end.y))
                .attr('stroke', 'black')
                .attr('opacity', 0.5)
                .attr('stroke-width', 1)
                .attr('marker-end', 'url(#arrow)');

        });

        const axisLabels = [
            { pos: project3D(1.05, 0, 0), text: 'x' },
            { pos: project3D(0, 1.05, 0), text: 'y' },
            { pos: project3D(0, 0, 1.05), text: 'z' }
        ];

        axisLabels.forEach(label => {
            rightSvg.append('text')
                .attr('x', xScale3D(label.pos.x) + 4)
                .attr('y', yScale3D(label.pos.y) - 4)
                .text(label.text)
                .attr('font-size', '14px')
                .attr('fill', 'black')
                .attr('font-family', 'Inter, sans-serif');
        });

            
        // Prepare animated steps
        const startX = { x: 0, y: 0, z: 0 };
        const endX = { x: scaledPoint.x, y: 0, z: 0 };
    
        const startY = { x: scaledPoint.x, y: 0, z: 0 };
        const endY = { x: scaledPoint.x, y: scaledPoint.y, z: 0 };
    
        const startZ = { x: scaledPoint.x, y: scaledPoint.y, z: 0 };
        const endZ = { x: scaledPoint.x, y: scaledPoint.y, z: scaledPoint.z };
    
        const steps = [
            { start: project3D(startX.x, startX.y, startX.z), end: project3D(endX.x, endX.y, endX.z), color: firstColor },
            { start: project3D(startY.x, startY.y, startY.z), end: project3D(endY.x, endY.y, endY.z), color: secondColor },
            { start: project3D(startZ.x, startZ.y, startZ.z), end: project3D(endZ.x, endZ.y, endZ.z), color: thirdColor }
        ];
    
        const totalDuration = 800; // milliseconds
    
        steps.forEach((line, i) => {
            rightSvg.append('line')
                .attr('x1', xScale3D(line.start.x))
                .attr('y1', yScale3D(line.start.y))
                .attr('x2', xScale3D(line.start.x))
                .attr('y2', yScale3D(line.start.y))
                .attr('stroke', line.color)
                .attr('stroke-width', 4)
                .attr('opacity', 0.9)
                .transition()
                .delay(i * totalDuration)
                .duration(totalDuration)
                .ease(d3.easeCubicInOut)
                .attr('x2', xScale3D(line.end.x))
                .attr('y2', yScale3D(line.end.y));
        });
    
        rightSvg.append('circle')
            .attr('cx', xScale3D(projectedPoint.x))
            .attr('cy', yScale3D(projectedPoint.y))
            .attr('r', 0)
            .attr('fill', 'black')
            .transition()
            .delay(3 * totalDuration)
            .duration(500)
            .attr('r', 6);
    }
    
    function resample() {
        let Yvalues;

        if (!auxLoaded) {
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0).map(() => Array(Xvalues.length).fill(0));
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
            } catch (err) {
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }

        sharedData.set({ x: Xvalues, y: Yvalues });
        createViz(Xvalues, Yvalues);
    }
    
    onMount(() => {
        let Yvalues;

        if (!auxLoaded) {
            //console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0).map(() => Array(Xvalues.length).fill(0));
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
            } catch (err) {
                //console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }

        sharedData.set({ x: Xvalues, y: Yvalues });
        createViz(Xvalues, Yvalues);
    });

</script>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        width: 800px;
        margin: 10px auto;
    }

    .graph-container {
        display: flex;
        justify-content: space-between;
        height: 400px;
    }

    .panel {
        flex: 0 0 48%;
        height: 100%;
    }

    svg {
        display: block;
        background: #f9f9f9;
    }

    /* .button-wrapper {
        text-align: center;
        margin-top: 20px;
    }

    .resample-button {
        padding: 10px 20px;
        background-color: #ff968a;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    .resample-button:hover {
        background-color: #45a049;
    } */
</style>

<div class="main-container">
    <div class="graph-container">
        <!-- Left Panel - 2D Plot -->
        <div class="panel">
            <svg id="left-plot" width={leftWidth} height={leftHeight}></svg>
        </div>
        
        <!-- Right Panel - 3D Representation -->
        <div class="panel">
            <svg id="right-plot" width={rightWidth} height={rightHeight}></svg>
        </div>
    </div>

    <!-- <div class="button-wrapper">
        <button class="resample-button" on:click={resample}>
            Resample
        </button>
    </div> -->
    <Button label="Resample" onClick={resample} />
</div>