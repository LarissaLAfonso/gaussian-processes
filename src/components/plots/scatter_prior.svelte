<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { 
        generateGPSamples, 
        kernel_Matern12, 
        kernel_Periodic, 
        kernel_Polynomial, 
        kernel_RBF 
    } from '$components/generate_data_prior/auxiliares';

    // Parâmetros iniciais 
    let par_rbf_lengthScale = 1.0;
    let par_matern_lengthScale = 1.0;
    let par_periodic_period = 1.0;
    let par_periodic_lengthScale = 1.0;
    let par_polynomial_constant = 0;
    let par_polynomial_degree = 3;

    export let selectedKernel = 'kernel_Polynomial';

    // Dimensões do gráfico
    let width = 800;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };
    let svg;
    let xScale, yScale;

    const Xtest = d3.range(-5, 5.01, 0.9);

    function plotSamples() {
        const kernelFunction = getKernelFunction(selectedKernel);
        console.log(kernelFunction);
        const samples = generateGPSamples(kernelFunction, -5, 5.01, 0.9);
        
        const data = Xtest.map((x, i) => ({ x, y: samples.y[i] }));
        
        // Escala Y
        const yExtent = d3.extent(data, d => d.y);
        yScale.domain(yExtent);
        
        // Textos do eixo Y
        svg.select('#ymin-text')
            .text(`y = ${yExtent[0].toFixed(2)}`)
            .attr('y', yScale(yExtent[0]) - 10);
            
        svg.select('#ymax-text')
            .text(`y = ${yExtent[1].toFixed(2)}`)
            .attr('y', yScale(yExtent[1]) + 10);
        
        // Plot dos pontos
        const points = svg.select('#points-group')
            .selectAll('circle')
            .data(data);
            
        points.enter()
            .append('circle')
            .merge(points)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 1.5)
            .attr('fill', 'blue')
            .attr('opacity', 0.6);

        points.exit().remove();
    }

    function getKernelFunction(kernelName) {
        if (kernelName === 'kernel_Matern12') {
            return (x, y) => kernel_Matern12(x, y, par_matern_lengthScale);
        } else if (kernelName === 'kernel_Periodic') {
            return (x, y) => kernel_Periodic(x, y, par_periodic_period, par_periodic_lengthScale);
        } else if (kernelName === 'kernel_Polynomial') {
            return (x, y) => kernel_Polynomial(x, y, par_polynomial_constant, par_polynomial_degree);
        } else {
            return (x, y) => kernel_RBF(x, y, par_rbf_lengthScale);
        }
    }

    onMount(() => {
        svg = d3.select('#gp-svg')
            .attr('width', width)
            .attr('height', height);
        
        // Escalas
        xScale = d3.scaleLinear()
            .domain([-5, 5])
            .range([margin.left, width - margin.right]);
            
        yScale = d3.scaleLinear()
            .range([height - margin.bottom, margin.top]);
        
        // Grupo para pontos
        svg.append('g').attr('id', 'points-group');
        
        // Eixos
        const axesGroup = svg.append('g').attr('id', 'axes-group');
        
        // Eixo X
        axesGroup.append('line')
            .attr('id', 'y-zero-line')
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
            .attr('y1', (height-margin.top-margin.bottom)/2)
            .attr('y2', (height-margin.top-margin.bottom)/2)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 2'); 

        // Textos do eixo Y
        axesGroup.append('text').attr('id', 'ymin-text')
            .attr('x', margin.left + 60)
            .attr('text-anchor', 'end')
            .attr('font-size', '12px');
            
        axesGroup.append('text').attr('id', 'ymax-text')
            .attr('x', width - 60)
            .attr('text-anchor', 'end')
            .attr('font-size', '12px');

        plotSamples(); // Plot inicial
    });

    function updatePlot() {
        plotSamples();
    }

    function updatePlotKernel(event) {
        selectedKernel = event.target.value;
        updatePlot();
    }

    function updateRBFLengthScale(event) {
        par_rbf_lengthScale = parseFloat(event.target.value);
        updatePlot();
    }

    function updateMaternLengthScale(event) {
        par_matern_lengthScale = parseFloat(event.target.value);
        updatePlot();
    }

    function updatePeriodicPeriod(event) {
        par_periodic_period = parseFloat(event.target.value);
        updatePlot();
    }

    function updatePeriodicLengthScale(event) {
        par_periodic_lengthScale = parseFloat(event.target.value);
        updatePlot();
    }

    function updatePolynomialConstant(event) {
        par_polynomial_constant = parseFloat(event.target.value);
        updatePlot();
    }

    function updatePolynomialDegree(event) {
        par_polynomial_degree = parseInt(event.target.value);
        updatePlot();
    }
</script>

<div class="container">
    <!-- Botões para seleção do Kernel -->
    <div class="kernel-selection">
        <label class="kernel-toggle">
            <input type="radio" id="rbf" name="kernel" value="kernel_RBF" bind:group={selectedKernel} />
            <span>RBF</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="matern" name="kernel" value="kernel_Matern12" bind:group={selectedKernel} />
            <span>Matern</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="periodic" name="kernel" value="kernel_Periodic" bind:group={selectedKernel} />
            <span>Periodic</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="polynomial" name="kernel" value="kernel_Polynomial" bind:group={selectedKernel} />
            <span>Polynomial</span>
        </label>
    </div>

    <!-- SVG para o gráfico -->
    <svg id="gp-svg"></svg>

    <!-- Sliders -->
    <div class="sliders">
        {#if selectedKernel === 'kernel_RBF'}
            <div class="slider-container">
                <label class="slider-label">RBF Length Scale: {par_rbf_lengthScale.toFixed(1)}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_rbf_lengthScale} on:input={updateRBFLengthScale} class="slider" />
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Matern12'}
            <div class="slider-container">
                <label class="slider-label">Matern Length Scale: {par_matern_lengthScale.toFixed(1)}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_matern_lengthScale} on:input={updateMaternLengthScale} class="slider" />
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Periodic'}
            <div class="slider-container">
                <label class="slider-label">Periodic Period: {par_periodic_period.toFixed(1)}</label>
                <input type="range" min="0.1" max="5" step="0.1" value={par_periodic_period} on:input={updatePeriodicPeriod} class="slider" />
            </div>
            <div class="slider-container">
                <label class="slider-label">Periodic Length Scale: {par_periodic_lengthScale.toFixed(1)}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_periodic_lengthScale} on:input={updatePeriodicLengthScale} class="slider" />
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Polynomial'}
            <div class="slider-container">
                <label class="slider-label">Polynomial Constant: {par_polynomial_constant}</label>
                <input type="range" min="0" max="10" step="1" value={par_polynomial_constant} on:input={updatePolynomialConstant} class="slider" />
            </div>
            <div class="slider-container">
                <label class="slider-label">Polynomial Degree: {par_polynomial_degree}</label>
                <input type="range" min="1" max="5" step="1" value={par_polynomial_degree} on:input={updatePolynomialDegree} class="slider" />
            </div>
        {/if}
    </div>
</div>

<style>

    #gp-svg {
        border: 1px solid #676767;
        border-radius: 2px;
        background-color: white;
        }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: cursive;
    }

    .kernel-selection {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        width: 100%;
    }

    .kernel-toggle {
        display: inline-flex;
        align-items: center;
        font-size: 18px;
        cursor: pointer;
        margin: 0 10px;
        transition: color 0.3s ease;
    }

    .kernel-toggle input {
        display: none;
    }

    .kernel-toggle span {
        padding: 5px;
        border: 2px solid transparent;
        border-radius: 5px;
        transition: background-color 0.3s ease, border 0.3s ease;
    }

    .kernel-toggle input:checked + span {
        background-color: #52DBA4;
        color: white;
        border: 1.5px solid #000000;
    }

    .kernel-toggle input:not(:checked) + span:hover {
        background-color: #f0f0f0;
    }

    .sliders {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }

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
        transition: background-color 0.3s ease;
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