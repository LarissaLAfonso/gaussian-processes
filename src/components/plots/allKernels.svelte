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
    import { create, string } from "mathjs";

    // Parâmetros iniciais
    let par_rbf_lengthScale = 1.0;
    let par_matern_lengthScale = 1.0;
    let par_periodic_period = 1.0;
    let par_periodic_lengthScale = 1.0;
    let par_polynomial_constant = 0;
    let par_polynomial_degree = 3;

    // Dimensões do gráfico
    const backgroundColor = '#f9fafb';
    let width = 800;
    let height = 400;
    let margin = { top: 20, right: 20, bottom: 40, left: 40 };
    let svg;
    let paths = [];
    let line;
    let selectedKernels = [1, 1, 1, 1];
    const maxOpacity = 0.7;
    const minOpacity = 0.1;
    let coverRect;
    let coverRectX = margin.left + 2;
    let coverRectWidth = width - margin.left - margin.right - 4;
    let interval;

    const Xtest = d3.range(-5, 5.1, 0.1);

    const kernels = [
        'kernel_RBF',
        'kernel_Matern12',
        'kernel_Periodic',
        'kernel_Polynomial'
    ];

    const colors = {
        kernel_RBF: '#47A2A4',
        kernel_Matern12: '#FF5733',
        kernel_Periodic: '#C70039',
        kernel_Polynomial: '#FFC300'
    }

    function addLine(kernel, seed = -1) {
        /*
        Adiciona novas linhas de amostras.
        */

        const kernelFunction = getKernelFunction(kernel);
        const samples = generateGPSamples(kernelFunction, -5, 5.1, 0.1, seed);

        // Criação de nova linha
        const newPath = svg.select('#paths-group').append('path')
            .datum(samples.y)
            .attr('fill', 'none')
            .attr('stroke', colors[kernel])
            .attr('stroke-width', 2)
            .attr('d', line)
            .attr('opacity', 0.7);

        paths.push(newPath);
    }

    function updateCoverRect() {
        /*
        Atualiza o retângulo de cobertura.
        */
        coverRectWidth -= 4;
        coverRectX += 4;
        coverRect.attr('width', coverRectWidth).attr('x', coverRectX);
        if (coverRectWidth <= 0) {
            clearInterval(interval);
            coverRect.remove();
            coverRect = null;
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

    function createGraph()
    {
        paths.forEach(path => path.remove());
        paths = [];
        coverRectWidth = width - margin.left - margin.right - 4;
        coverRectX = margin.left + 2;
        if(coverRect)
        {
            coverRect.remove();
            coverRect = null;
        }
        if(interval)
        {
            clearInterval(interval);
            interval = null;
        }

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
        const coverRectGroup = svg.append('g').attr('id', 'cover-rect-group');
        const axesGroup = svg.append('g').attr('id', 'axes-group');

        // Escalas para os eixos
        const xScale = d3.scaleLinear().domain([-5, 5]).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        // Função para desenhar a linha
        line = d3.line()
            .x((d, i) => xScale(Xtest[i]))
            .y(d => yScale(d));

        yScale.domain([-6, 6]);

        // y = 0
        const seed = Math.random();
        for(let i = 0; i < kernels.length; i++) {
            const kernel = kernels[i];  
            addLine(kernel, seed);
            console.log(kernel)
            if (selectedKernels[i] === 0) {
                paths[i].attr('opacity', minOpacity);
            } else {
                paths[i].attr('opacity', maxOpacity);
            }
        }
        coverRect = coverRectGroup.append('rect')
        .attr('x', coverRectX)    
        .attr('y', 2)     
        .attr('width', coverRectWidth-1)
        .attr('height', height-4)
        .attr('fill', backgroundColor)
        .attr('shape-rendering', 'crispEdges');
        
        interval = setInterval(() => updateCoverRect(), 10);

        axesGroup.append('line')
            .attr('id', 'y-zero-line')
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 2'); 
        
    }
    
    onMount(() => {
        createGraph();
    });

    
    function updatePlot() {
        createGraph();
    }


    function toggle_kernel(index)
    {
        /*
        Função para alternar entre os kernels.
        */
        const kernel = kernels[index];
        const isChecked = selectedKernels[index];

        if (!isChecked) {
            selectedKernels[index] = 1;
            paths[index].attr('opacity', maxOpacity);
        } else {
            selectedKernels[index] = 0;
            paths[index].attr('opacity', minOpacity);
        }
    }

</script>

<div class="container">
    <!-- Título do gráfico -->
    <h2 class="title">Kernel Comparison</h2>
    <!-- Legendas para o gráfico -->
    <div class="kernel-selection">
        <label class="kernel-toggle" id="rbf_subtitle">
            <input type="checkbox" id="rbf" name="kernel"
                on:change={() => toggle_kernel(0)} checked>
            <span>RBF</span>
        </label>
        <label class="kernel-toggle" id="matern_subtitle">
            <input type="checkbox" id="matern" name="kernel" 
                on:change={() => toggle_kernel(1)} checked>
            <span>Matern</span>
        </label>
        <label class="kernel-toggle" id="periodic_subtitle">
            <input type="checkbox" id="periodic" name="kernel" 
                on:change={() => toggle_kernel(2)} checked>
            <span>Periodic</span>
        </label>
        <label class="kernel-toggle" id="polynomial_subtitle">
            <input type="checkbox" id="polynomial" name="kernel" 
                on:change={() => toggle_kernel(3)} checked>
            <span>Polynomial</span>
        </label>
    </div>
    <!-- SVG para o gráfico -->
    <svg id="gp-svg"></svg>

    <div class="resample">
        <button on:click={updatePlot} class="resample-button">Resample</button>
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

    .kernel-toggle input:not(:checked) + span{
        opacity: 0.5;
    }

    .kernel-toggle input:checked + span {
        background-color: #52DBA4;
        color: white;
        border: 1.5px solid #000000;
    }

    .kernel-toggle input:not(:checked) + span:hover {
        background-color: #f0f0f0;
    }
    .kernel-toggle input:checked + span:hover {
        background-color: #000000;
        color: white;
        border: 1.5px solid #000000;
    }

    #rbf_subtitle span{
        background-color: #47A2A4;
    }
    #matern_subtitle span{
        background-color: #FF5733;
    }
    #periodic_subtitle span{
        background-color: #C70039;
    }
    #polynomial_subtitle span{
        background-color: #FFC300;
    }
    .container {
        display: flex;
        width: 700px;
        height: 600px;
        margin: 10px auto;
        position: relative;
    }
    

    .resample-button {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        z-index: 10;
    }
    .resample-button:hover {
        background-color: #45a049;
    }
</style>