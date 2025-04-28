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
    import { string } from "mathjs";

    // Parâmetros iniciais
    let par_rbf_lengthScale = 1.0;
    let par_matern_lengthScale = 1.0;
    let par_periodic_period = 1.0;
    let par_periodic_lengthScale = 1.0;
    let par_polynomial_constant = 0;
    let par_polynomial_degree = 3;

    // Parâmetro de seleção do kernel
    export let selectedKernel = 'kernel_RBF';

    // Dimensões do gráfico
    let width = 800;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };
    let svg;
    let paths = [];
    let line;
    let interval;
    let maxLines = 15;

    const Xtest = d3.range(-5, 5.1, 0.1);

    function addLine() {
        /*
        Adiciona novas linhas de amostras.
        */

        const kernelFunction = getKernelFunction(selectedKernel);
        const samples = generateGPSamples(kernelFunction, -5, 5.1, 0.1);

        // Criação de nova linha
        const newPath = svg.select('#paths-group').append('path')
            .datum(samples.y)
            .attr('fill', 'none')
            .attr('stroke', '#47A2A4')
            .attr('stroke-width', 2)
            .attr('d', line)
            .attr('opacity', 1);

        if (paths.length > 0) {
            // Pega a última linha
            const oldPath = paths[paths.length - 1];

            // Atualização do dado da linha antiga
            oldPath.datum(samples.y)
                .transition()                   
                .duration(1000)                 
                .attr('d', line)                
                .attr('stroke', '#808080')      
                .attr('opacity', 0.35);         
        }

        paths.push(newPath);

        if (paths.length >= maxLines) {
            clearInterval(interval);
        }
    }

    function getKernelFunction(kernelName) {
        /*
        Essa função obtém o kernel selecionado e os parâmetros correspondentes.
        */
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

        // Grupos separados para paths e eixos
        const pathsGroup = svg.append('g').attr('id', 'paths-group');
        const axesGroup = svg.append('g').attr('id', 'axes-group');

        // Escalas para os eixos
        const xScale = d3.scaleLinear().domain([-5, 5]).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        // Função para desenhar a linha
        line = d3.line()
            .x((d, i) => xScale(Xtest[i]))
            .y(d => yScale(d));

        // Atualização dos limites de yScale com base nas amostras geradas
        const firstSamples = generateGPSamples(getKernelFunction(selectedKernel), -5, 5.1, 0.1);
        const minY = d3.min(firstSamples.y);
        const maxY = d3.max(firstSamples.y);
        yScale.domain([-6, 6]);

        // y = 0
        axesGroup.append('line')
            .attr('id', 'y-zero-line')
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 2'); 

        // Tempo para adicionar novas linhas (1 segundo)
        interval = setInterval(() => addLine(), 1000);
    });

    function updatePlot() {
        // Geração de novas samples
        const kernelFunction = getKernelFunction(selectedKernel);
        const samples = generateGPSamples(kernelFunction, -5, 5.1, 0.1);

        // Cálculo de novos minY e maxY
        const minY = d3.min(samples.y);
        const maxY = d3.max(samples.y);

        // Update yScale domain
        yScale.domain([minY, maxY]);

        // Atualização de escala y = 0
        svg.select('#y-zero-line')
            .attr('y1', yScale(0))
            .attr('y2', yScale(0));

        svg.select('#y-min-label')
            .attr('y', yScale(minY) - 10)
            .text(`y = ${minY.toFixed(2)}`);

        svg.select('#y-max-label')
            .attr('y', yScale(maxY) + 10)
            .text(`y = ${maxY.toFixed(2)}`);

        // Remoção de linhas antigas
        paths.forEach(path => path.remove());
        paths = [];

        // Adição de novas linhas
        const path = svg.select('#paths-group').append('path')
            .datum(samples.y)
            .attr('fill', 'none')
            .attr('stroke', '#47A2A4')
            .attr('stroke-width', 2)
            .attr('d', line)
            .attr('opacity', 1);

        paths.push(path);
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