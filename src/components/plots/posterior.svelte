<script>
    import { onMount } from 'svelte';
    import {
        cholesky,
        solveLowerTriangular,
        solveUpperTriangular,
        transposeMatrix,
        dotProduct,
        kernel_Matern12, 
        kernel_Periodic, 
        kernel_Polynomial, 
        kernel_RBF
    } from '$components/generate_data_prior/auxiliares';

    import * as d3 from 'd3';

    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 30, left: 40 };

    const xScale = d3.scaleLinear().domain([-5, 5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-4, 4]).range([height - margin.bottom, margin.top]);

    let trainingPoints = [];
    let selectedKernels = ['RBF'];
    let svgElement;
    let g; // Grupo principal para elementos dinâmicos

    const legendData = [
        { label: "Train Point", color: "#f72585", symbol: "circle" },
        { label: "Samples", color: "#adb5bd", symbol: "line-dashed" },
        { label: "Mean Prediction", color: "#1e7d2f", symbol: "line" },
        { label: "Confidence Interval", color: "#DDF2DC", symbol: "area" }
    ];

    onMount(() => {
        initializeSVG();
        generateGPData();
    });

    function initializeSVG() {
        /*
        Essa função inicializa os elementos estáticos do gráfico.
        */

        const svg = d3.select(svgElement);

        // Delimitação do gráfico
        svg.append("defs")
            .append("clipPath")
            .attr("id", "plot-area-clip")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        // Grupo principal para elementos dinâmicos
        g = svg.append("g")
            .attr("clip-path", "url(#plot-area-clip)")
            .on("click", handleClick);

        // Eixo X
        svg.append('line')
            .attr('x1', xScale(-5))
            .attr('x2', xScale(5))
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');

        // Eixo y
        svg.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', yScale(-4))
            .attr('y2', yScale(4))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .attr('marker-end', 'url(#arrow)');

        // Labels dos eixos
        svg.append("text")
            .attr("x", xScale(5) + 5)
            .attr("y", yScale(0) + 3)
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .text("x")
            .style("user-select", "none");;

        svg.append("text")
            .attr("x", xScale(0) + 5)
            .attr("y", yScale(4) + 5)
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .text("y")
            .style("user-select", "none");;

        // Legenda
        const legend = svg.append("g")
            .attr("class", "legend");

        // Caixa de fundo 
        const background = legend.append("rect")
            .attr("fill", "#f9f9f9")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)
            .attr("rx", 6)
            .attr("ry", 6);

        // Título da legenda
        legend.append("text")
            .attr("class", "legend-title")
            .attr("x", 18)
            .attr("y", 13)
            .style("font-family", "'Fredoka', sans-serif")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("Legend")
            .style("user-select", "none");

        const legendItemsGroup = legend.append("g")
            .attr("transform", "translate(5, 25)");

        const legendItems = legendItemsGroup.selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .each(function(d, i) {
                const item = d3.select(this);

        if (d.symbol === "circle") {
            item.append("circle")
                .attr("cx", 15)
                .attr("cy", 10)
                .attr("r", 6)
                .attr("fill", d.color)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.2);
        } else if (d.symbol === "line" || d.symbol === "line-dashed") {
            item.append("line")
                .attr("x1", 10)
                .attr("x2", 25)
                .attr("y1", 10)
                .attr("y2", 10)
                .attr("stroke", d.color)
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", d.symbol === "line-dashed" ? "4,2" : null);
        } else if (d.symbol === "area") {
            item.append("rect")
                .attr("x", 10)
                .attr("y", 5)
                .attr("width", 25)
                .attr("height", 10)
                .attr("fill", d.color);
        }

        item.append("text")
            .attr("x", 45)
            .attr("y", 12)
            .style("font-family", "'Fredoka', sans-serif")
            .style("font-size", "10px")
            .text(d.label)
            .style("user-select", "none");

        // Posicionamento vertical dos itens
        item.attr("transform", `translate(0, ${i * 25})`);
    });

        // Tamanho da caixa de fundo com base no conteúdo
        const legendGroupBBox = legend.node().getBBox();
        background
            .attr("x", legendGroupBBox.x - 10)
            .attr("y", legendGroupBBox.y - 10)
            .attr("width", legendGroupBBox.width + 20)
            .attr("height", legendGroupBBox.height + 20);

        // Posição final da legenda no SVG
        legend.attr("transform", `translate(${margin.left}, ${margin.top})`);
    }

    function updatePlot() {
        generateGPData();
    }

    function generateGPData() {
        const xPred = Array.from({ length: 100 }, (_, i) => -5 + (10 * i) / 99);
        
        let yMean, yStd, samples;
        const numSamples = 3;

        if (selectedKernels.length === 0) {
            trainingPoints = [];
            yMean = new Array(100).fill(0);
            yStd = new Array(100).fill(1);
            samples = [];
        } else if (trainingPoints.length === 0) {
            yMean = new Array(100).fill(0);
            yStd = new Array(100).fill(1);
            samples = Array.from({ length: numSamples }, () => 
                yMean.map((mu, i) => mu + yStd[i] * d3.randomNormal()())
            );
        } else {
            const X_train = trainingPoints.map(p => p.x);
            const y_train = trainingPoints.map(p => p.y);

            const kernels = {
                RBF: kernel_RBF,
                Matern: kernel_Matern12,
                Polynomial: kernel_Polynomial,
                Periodic: kernel_Periodic
            };

            const selectedKernel = (x1, x2) => {
                return selectedKernels
                    .map(k => kernels[k](x1, x2))
                    .reduce((sum, val) => sum + val, 0) / selectedKernels.length;
            };

            const K = X_train.map(x1 => X_train.map(x2 => selectedKernel(x1, x2) + 1e-10));
            const L = cholesky(K);
            const alpha = solveLowerTriangular(L, y_train);
            const v = solveUpperTriangular(transposeMatrix(L), alpha);

            yMean = xPred.map(x => {
                const k = X_train.map(xi => selectedKernel(xi, x));
                return dotProduct(k, v);
            });

            yStd = xPred.map(x => {
                const k = X_train.map(xi => selectedKernel(xi, x));
                const K_inv_k = solveLowerTriangular(L, k);
                return Math.sqrt(selectedKernel(x, x) - dotProduct(K_inv_k, K_inv_k));
            });

            samples = Array.from({ length: numSamples }, () =>
                yMean.map((mu, i) => mu + yStd[i] * d3.randomNormal()())
            );
        }

        generatePlot(xPred, yMean, yStd, samples);
    }

    function generatePlot(xPred, yMean, yStd, samples) {
        const areaGenerator = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.mean - 2 * d.std))
            .y1(d => yScale(d.mean + 2 * d.std));

        const lineGenerator = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        const confidenceData = xPred.map((x, i) => ({ x, mean: yMean[i], std: yStd[i] }));
        const meanData = xPred.map((x, i) => ({ x, y: yMean[i] }));

        // Intervalo de confiança
        const confidence = g.selectAll(".confidence").data([confidenceData]);
        confidence.enter()
            .append("path")
            .attr("class", "confidence")
            .attr("fill", "#DDF2DC")
            .merge(confidence)
            .transition().duration(750)
            .attr("d", areaGenerator);
        confidence.exit().remove();

        // Linha média
        const meanLine = g.selectAll(".mean-line").data([meanData]);
        meanLine.enter()
            .append("path")
            .attr("class", "mean-line")
            .attr("stroke", "#1e7d2f")
            .attr("stroke-width", 2.5)
            .merge(meanLine)
            .transition().duration(750)
            .attr("d", lineGenerator)
            .attr("fill", "none");
        meanLine.exit().remove();

        // Apenas plota amostras se houver pontos de treino
        const sampleLines = g.selectAll(".sample").data(trainingPoints.length === 0 ? [] : samples.map(sample =>
            xPred.map((x, i) => ({ x, y: sample[i] }))
        ));
        sampleLines.enter()
            .append("path")
            .attr("class", "sample")
            .attr("stroke", "#adb5bd")
            .attr("opacity", 0)
            .merge(sampleLines)
            .transition().duration(750)
            .attr("opacity", 0.8)
            .attr("d", lineGenerator)
            .attr("fill", "none");
        sampleLines.exit()
            .transition().duration(750)
            .attr("opacity", 0)
            .remove();

        // Pontos de treino
        const points = g.selectAll(".train-point").data(trainingPoints, d => `${d.x}-${d.y}`);
        points.enter()
            .append("circle")
            .attr("class", "train-point")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 0)
            .attr("fill", "#F41300")
            .transition().duration(750)
            .attr("r", 7);
        points.exit()
            .transition().duration(750)
            .attr("r", 0)
            .remove();
    }

    function handleClick(event) {
        /*
        Função para manusear a entrada e saída de pontos com interatividade.
        */
        const [x, y] = d3.pointer(event);
        const xVal = xScale.invert(x);
        const yVal = yScale.invert(y);

        const existingIndex = trainingPoints.findIndex(
            p => Math.abs(p.x - xVal) < 0.2 && Math.abs(p.y - yVal) < 0.2
        );

        if (existingIndex > -1) {
            trainingPoints = trainingPoints.filter((_, i) => i !== existingIndex);
        } else {
            trainingPoints = [...trainingPoints, { x: xVal, y: yVal }];
        }

        generateGPData();
    }
</script>

<div class="container">
    <h1>The influence of the training set on the test result</h1>

    <div class="select_kernel">
        <div class="option">
            <input type="checkbox" id="rbf" bind:group={selectedKernels} value="RBF" on:change={updatePlot}>
            <label for="rbf">RBF</label>
        </div>
        <div class="option">
            <input type="checkbox" id="matern" bind:group={selectedKernels} value="Matern" on:change={updatePlot}>
            <label for="matern">Matérn</label>
        </div>
        <div class="option">
            <input type="checkbox" id="polynomial" bind:group={selectedKernels} value="Polynomial" on:change={updatePlot}>
            <label for="polynomial">Polynomial</label>
        </div>
        <div class="option">
            <input type="checkbox" id="periodic" bind:group={selectedKernels} value="Periodic" on:change={updatePlot}>
            <label for="periodic">Periodic</label>
        </div>
    </div>

    <svg bind:this={svgElement} {width} {height}></svg>

    <div class="explanation">
        <p>You can click directly on it to add or remove training points.
            When you do this, the prediction of the mean and the confidence interval of the estimated function are automatically updated.
            The more points are added—especially in nearby regions—the lower the uncertainty tends to be (represented by the light blue area),
            as the model gains more information about the function's behavior in that region.
            Additionally, selecting different kernels allows you to observe how different assumptions about the function influence the shape of the prediction.</p>
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

    h1 {
        text-align: center;
        color: #2c3e50;
        margin: 20px 0;
    }

    .select_kernel {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
        align-items: center;
        padding: 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background: #f8f9fa;
        max-width: 600px;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #666;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
    }

    input[type="checkbox"]:checked {
        background: #2196F3;
        border-color: #2196F3;
    }

    input[type="checkbox"]:checked::after {
        content: "✓";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 14px;
    }

    label {
        color: #333;
        font-size: 14px;
        cursor: pointer;
    }

    .option:hover input[type="checkbox"] {
        border-color: #2196F3;
    }

    .option:hover label {
        color: #2196F3;
    }

    .explanation {
        background-color: #e5e7eb;
        border-radius: 12px;
        width: 100%; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        text-align: justify;
        padding: 0 15px;
        color: #333;
    }
</style>