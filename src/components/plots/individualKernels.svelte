<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { kernel_Matern12, kernel_Polynomial, kernel_Periodic, kernel_RBF, generateData } from '$components/plots/auxiliares.js';
  
    let svg;

    // Dimensões do gráfico
    const backgroundColor = '#f9fafb';
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    // const margin = {top:10, right: 10, bottom: 10, left: 10};

    const kernels = [kernel_Matern12, kernel_Periodic, kernel_Polynomial, kernel_RBF];
    var selectedKernelIndex = 0;

    function draw_kernel_func(data) {
        if (svg) {
            svg.selectAll("*").remove(); // Limpa o SVG antes de desenhar novamente
        }


        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));

        svg = d3.select("#inidivualKernels-svg")
            .attr("width", width)
            .attr("height", height)
        
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
        
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "blue") 
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", height - margin.bottom)
            .attr("x2", width - margin.right)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1);  
        
        y.domain([0, d3.max(data, d => d.y)])
            .range([height - margin.bottom, margin.top]);
        
    }

    function drawNewKernel()
    {
        const data = generateData(kernels[selectedKernelIndex]);
        // draw_kernel_func(svg, data);
        draw_kernel_func(data);
    }

    function updateSelectedKernel(index) {
        selectedKernelIndex = index;
        drawNewKernel();
    }
  
    onMount(() => {
      drawNewKernel();
    });

  </script>
  
<div class="container">
    <!-- Título do gráfico -->
    <h2 id="title">Kernel formats</h2>
    <!-- Botões para seleção do Kernel -->
    <div class="kernel-selection">
        <label class="kernel-toggle">
            <input type="radio" id="rbf" name="kernel" value="kernel_RBF" on:input={()=>updateSelectedKernel(0)}/>
            <span>RBF</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="matern" name="kernel" value="kernel_Matern12" on:input={()=>updateSelectedKernel(1)} />
            <span>Matern</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="periodic" name="kernel" value="kernel_Periodic" on:input={()=>updateSelectedKernel(2)}  />
            <span>Periodic</span>
        </label>
        <label class="kernel-toggle">
            <input type="radio" id="polynomial" name="kernel" value="kernel_Polynomial" on:input={()=>updateSelectedKernel(3)} />
            <span>Polynomial</span>
        </label>
    </div>
    <svg id="inidivualKernels-svg"></svg>
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