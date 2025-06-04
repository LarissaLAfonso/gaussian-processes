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
    import HelperText from "$components/layouts/HelperText.svelte"
    import description from '$components/data/descriptions.json';
    import { drawAxes } from './auxiliares';

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
        { label: "Samples", color: "#adb5bd", symbol: "line-sample" },
        { label: "Mean Prediction", color: "#1e7d2f", symbol: "line" },
        { label: "Confidence Interval", color: "#DDEFFF", symbol: "area" }
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

        // Center the image into the svg box
        svg.attr("viewBox", `0 0 ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 auto");

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

        drawAxes(svg, xScale, yScale, true, "x", "y");

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
        } else if (d.symbol === "line" || d.symbol === "line-sample") {
            item.append("line")
                .attr("x1", 10)
                .attr("x2", 25)
                .attr("y1", 10)
                .attr("y2", 10)
                .attr("stroke", d.color)
                .attr("stroke-width", 2);
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
            .attr("fill", "#DDEFFF")
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

<div class="main-container">
    <h2>Adding Training Points</h2>

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

    <HelperText>
        {@html description[2].text}
    </HelperText>
</div>

<style>
    .main-container {
        width: 90%;
        max-width: 800px;
        margin: 0.5rem 0rem 2rem 0rem;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: 'Fredoka', sans-serif;
    }

    h2 {
        padding-bottom: 0.5rem;
        text-align: center;
    }

    .select_kernel {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        justify-content: center;
        margin: 0.5rem 0;
        width: 100%;
        padding: 1rem;
        border-radius: 8px;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    input[type="checkbox"] {
        width: 18px;
        height: 18px;
        border: 2px solid #47A2A4;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    input[type="checkbox"]:checked {
        border-color: #47A2A4;
    }

    input[type="checkbox"]:checked::after {
        color: white;
        font-size: 12px;
    }

    label {
        color: #2d3748;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .option:hover label {
        color: #47A2A4;
    }

    svg {
        width: 100%;
        height: auto;
        min-height: 300px;
        margin-bottom: 0;
        display: block;
    }
</style>
