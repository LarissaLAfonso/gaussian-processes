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
    import Button from "$components/interactives/Button.svelte";

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
    const checkboxIds = [
        'rbf',
        'matern',
        'periodic',
        'polynomial'
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

        // Center the image into the svg box
        svg.attr("viewBox", `0 0 ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 auto");

        // Borda do gráfico
        svg.append('rect')
            .attr('x', margin.left)    
            .attr('y', 0)     
            .attr('width', width - margin.left - margin.right)
            .attr('height', height)
            .attr('fill', 'none')
            //.attr('stroke', 'black')
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

    function check_all()
    {
        /*
        Marca todos os kernels.
        */
        for(let i = 0; i < selectedKernels.length; i++)
        {
            selectedKernels[i] = 1;
            paths[i].attr('opacity', maxOpacity);
            document.getElementById(checkboxIds[i]).checked = true;
        }
    }
    function uncheck_all()
    {
        /*
        Desmarca todos os kernels.
        */
        for(let i = 0; i < selectedKernels.length; i++)
        {
            selectedKernels[i] = 0;
            paths[i].attr('opacity', minOpacity);
            document.getElementById(checkboxIds[i]).checked = false;
        }
    }
    function toggle_kernel(index)
    {
        /*
        Função para alternar entre os kernels.
        */
        const kernel = kernels[index];
        const isChecked = selectedKernels[index];
        const allChecked = !selectedKernels.includes(0);
        console.log(allChecked)

        if (!isChecked || allChecked) {
            uncheck_all();
            selectedKernels[index] = 1;
            paths[index].attr('opacity', maxOpacity);
            document.getElementById(checkboxIds[index]).checked = true;
        } else{
            check_all();
        }
    }
</script>

<div class="container">
    <h2>Kernel Comparison</h2>
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

    <!-- <div class="resample">
        <button on:click={updatePlot} class="resample-button">Resample</button>
    </div> -->
    <Button label="Resample" onClick={updatePlot} />
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

    .container {
        width: 90%;
        max-width: 800px;
        margin: 0.5rem 0rem 2rem 0rem;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: 'Fredoka', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }

    .title {
        font-size: clamp(1.5rem, 4vw, 2rem);
        color: #2d3748;
        margin-bottom: 1.5rem;
        text-align: center;
        width: 100%;
    }

    .kernel-selection {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: clamp(0.5rem, 1.5vw, 1rem);
        margin-bottom: 1.5rem;
        width: 100%;
    }

    .graph-wrapper {
        width: 100%;
        overflow: hidden;
        margin: 0 auto;
        
    }

    .graph-inner {
        width: clamp(115%, 120%, 135%); /* Extra width to allow left shift */
        margin-left: clamp(-15%, -20%, -25%); /* Pulls content left */
        position: relative;
    }

    #gp-svg {
        width: 100%;
        height: auto;
        min-height: 300px;
        display: block;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    /* Kernel toggle styles */
    .kernel-toggle {
        display: inline-flex;
        align-items: center;
        font-size: clamp(0.9rem, 1.1vw, 1.1rem);
        cursor: pointer;
    }

    .kernel-toggle input {
        display: none;
    }

    .kernel-toggle span {
        padding: 0.5rem 1rem;
        border: 2px solid transparent;
        border-radius: 5px;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .kernel-toggle input:not(:checked) + span {
        opacity: 0.7;
    }

    .kernel-toggle input:checked + span {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    h2 {
        padding-bottom: 1rem;
    }
    /* Kernel colors */
    #rbf_subtitle span { background-color: #47A2A4; }
    #matern_subtitle span { background-color: #FF5733; }
    #periodic_subtitle span { background-color: #C70039; }
    #polynomial_subtitle span { background-color: #FFC300; }
</style>