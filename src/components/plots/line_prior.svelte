<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import {
        generateGPSamples,
        kernel_Periodic
    } from '$components/generate_data_prior/auxiliares';

    let width = 800;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };
    let svg;
    let xScale, yScale;

    const start = -5;
    const end = 5;
    const numberOfPoints = 28;
    const step = (end - start) / (numberOfPoints - 1);
    const Xtest = d3.range(start, end + step / 2, step); 
    const seed = 0.5;

    let initialSamples = [];
    const kernelFunction = (x, y) => kernel_Periodic(x, y, 0.5, 1.0);

    function plotSamples() {

        const data = Xtest.map((x, i) => ({ x, y: initialSamples[i] }));
        yScale.domain([-3, 3]);

        // Desvio Padrão do dado
        const sigma = 1;

        // Adição do bloco do intervalo de confiança
        let confBand = svg.select('#confidence-band');
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

        // Linhas horizontais de referência
        const lines = [
            { y: 0, id: 'u-zero-line', text: 'u = 0', dashed: false },
            { y: 2 * sigma, id: 'u-plus-2sigma', text: 'u + 2σ', dashed: true },
            { y: -2 * sigma, id: 'u-minus-2sigma', text: 'u - 2σ', dashed: true }
        ];

        // Adição de cada linha no gráfico
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
                .attr('fill', 'black')
                .text(text);
        });

        // Pontos
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

        // Linha conectando os pontos
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        let path = svg.select('#line-group').selectAll('path').data([data]);
        const totalDuration = 2000; // Tempo de animação

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
        const samples = generateGPSamples(kernelFunction, start, end, step, seed);
        initialSamples = samples.y;

        svg = d3.select('#gp-svg')
            .attr('width', width)
            .attr('height', height);

        // Borda do gráfico
        svg.append('rect')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', width - margin.left - margin.right)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('stroke', 'black')
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

        xScale = d3.scaleLinear()
            .domain([start, end])
            .range([margin.left, width - margin.right]);

        yScale = d3.scaleLinear()
            .range([height - margin.bottom, margin.top]);

        svg.append('g').attr('id', 'points-group').attr("clip-path", "url(#plot-clip)");
        svg.append('g').attr('id', 'axes-group');
        svg.append('g').attr('id', 'line-group').attr("clip-path", "url(#plot-clip)");

        plotSamples();
    });
</script>

<div class="container">
    <h2>Prior Function</h2>
    <svg id="gp-svg"></svg>
    <div class="explanation">
        <p>The points shown in the graph are part of a sample drawn from the prior distribution of a Gaussian Process. From these random points, we can construct a function that represents the uncertainty about the behavior of the function we're modeling. This function is random because it depends on the randomly chosen points, which are defined by the variance in the covariance matrix. Each sample represents a different realization of the function, with the shape and spread of the points reflecting the level of uncertainty about the function's true form before any real data is observed. The randomness of the function comes directly from the random nature of the sampled points, which are influenced by the prior assumptions.</p>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Fredoka', sans-serif;
        width: 90%; 
        margin: 0 auto; 
    }

    h2 {
        font-size: 30px;
        text-align: center;
    }

    .explanation {
        background-color: #e5e7eb;
        border-radius: 12px;
        margin-top: 20px;
        margin-left: 20px;
        width: 100%; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        text-align: justify;
        padding: 0 15px;
        color: #333;
    }
</style>