<svelte:head>
    <script>
        MathJax = {
          tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
        };
        </script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>

</svelte:head>


<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { kernel_Matern12, kernel_Polynomial, kernel_Periodic, kernel_RBF, generateData } from '$components/plots/auxiliares.js';
    import kernelDescriptions from '$components/data/kernels.json';
    import HelperText from '$components/layouts/HelperText.svelte';
    let svg;

    // Dimensões do gráfico
    const backgroundColor = '#f9fafb';
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    const kernels = [
        kernel_RBF,
        kernel_Matern12,
        kernel_Periodic,
        (x) => kernel_Polynomial(x, x)
    ];
    var selectedKernelIndex = 0;
    var desc = kernelDescriptions[selectedKernelIndex].Description;

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

        svg = d3.select("#indivualKernels-svg")
            .attr("width", width)
            .attr("height", height)

        // Center the image into the svg box
        svg.attr("viewBox", `0 0 ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 auto");
        
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#52DBA4") 
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", height - margin.bottom)
            .attr("x2", width - margin.right)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5)
            .attr("stroke-dasharray", "5,5");  
        
        y.domain([0, d3.max(data, d => d.y)])
            .range([height - margin.bottom, margin.top]);
        
    }

    function drawNewKernel()
    {
        const data = generateData(kernels[selectedKernelIndex]);
        draw_kernel_func(data);
    }
    
    
    function updateSelectedKernel(index) {
        selectedKernelIndex = index;
        drawNewKernel();
        desc = kernelDescriptions[selectedKernelIndex].Description;
        console.log(desc)
    }
  
    onMount(() => {
      drawNewKernel();
      MathJax = {
          tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
        };
    });;
  </script>

<style>
    .main-container {
        width: 90%;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: 'Fredoka', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .kernel-selection {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        justify-content: center;
        margin: 0;
        width: 100%;
        padding-bottom: 1rem;
    }

    .kernel-toggle {
        display: inline-flex;
        align-items: center;
        font-size: clamp(0.9rem, 1.1vw, 1.1rem);
        cursor: pointer;
        transition: color 0.3s ease;
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

    .kernel-toggle input:checked + span {
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        background-color: #52DBA4; /* Cor de fundo quando selecionado */
    }

    .kernel-toggle input:not(:checked) + span {
        opacity: 0.7;
    }

    #indivualKernels-svg {
        width: min(90%, 800px);
        height: auto;
        min-height: 300px;
        margin: 0;
        display: block;
    }

    h2 {
        padding-bottom: 1rem;
    }

</style>

<div class="main-container">
    <h2>Kernel shapes</h2>
    <!-- Botões para seleção do Kernel -->
    <div class="kernel-selection">
        <label class="kernel-toggle">
            <input type="radio" id="rbf" name="kernel" value="kernel_RBF" on:input={()=>updateSelectedKernel(0)} checked/>
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
    <svg id="indivualKernels-svg"></svg>
    <br>
    <HelperText>
        <p>{desc}</p>
    </HelperText>
</div>