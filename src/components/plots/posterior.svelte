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

    onMount(() => {
        generateGPData();
    });

    function updatePlot() {
        generateGPData();
    }

    function generateGPData() {
        /*
        Gera os dados e atualiza o plot
        */
        const xPred = [];
        for (let i = 0; i < 100; i++) {
            xPred.push(-5 + (10 * i) / 99);
        }

        let yMean, yStd, samples;

        if (trainingPoints.length === 0) {
            yMean = Array(xPred.length).fill(0);
            yStd = Array(xPred.length).fill(1);
            samples = Array.from({ length: 5 }, () =>
                yMean.map((mu, i) => mu + yStd[i] * d3.randomNormal(0, 1, 0.5))
            );
        } else {
            const X_train = trainingPoints.map(p => p.x);
            const y_train = trainingPoints.map(p => p.y);

            // Mapeamento das funções de kernel
            const kernels = {
                RBF: kernel_RBF,
                Matern: kernel_Matern12,
                Polynomial: kernel_Polynomial,
                Periodic: kernel_Periodic
            };

            const selectedKernel = (x1, x2) => {
                const kFuncs = selectedKernels.map(k => kernels[k]);
                const values = kFuncs.map(f => f(x1, x2));
                return values.reduce((sum, val) => sum + val, 0) / values.length;
            };

            const K = X_train.map(x1 => X_train.map(x2 => selectedKernel(x1, x2) + (x1 === x2 ? 1e-10 : 0)));
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

            samples = Array.from({ length: 5 }, () =>
                yMean.map((mu, i) => mu + yStd[i] * d3.randomNormal(0, 1))
            );
        }

        generatePlot(xPred, yMean, yStd, samples);
    }

    function generatePlot(xPred, yMean, yStd, samples) {
        const svg = d3.select(svgElement);
        svg.selectAll("*").remove();

        // Delimitação para elementos não ficarem para fora do gráfico
        svg.append("defs")
            .append("clipPath")
            .attr("id", "plot-area-clip")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);

        const g = svg.append("g")
            .attr("clip-path", "url(#plot-area-clip)")
            .on("click", handleClick);


        const areaGenerator = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.mean - 2 * d.std))
            .y1(d => yScale(d.mean + 2 * d.std));

        // Desenho do IC    
        const confidenceAreaData = xPred.map((x, i) => ({ x, mean: yMean[i], std: yStd[i] }));
        g.append("path")
            .attr("class", "confidence")
            .attr("fill", "#bcdada")
            .attr("d", areaGenerator(confidenceAreaData));

        const lineGenerator = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        // Desenho da linha da média
        const meanLineData = xPred.map((x, i) => ({ x, y: yMean[i] }));
        g.append("path")
            .attr("class", "mean-line")
            .attr("d", lineGenerator(meanLineData))
            .attr("stroke", "#1e7d2f") 
            .attr("stroke-width", 2.5)
            .attr("fill", "none");

        // Desenho das Samples
        if (trainingPoints.length > 0) {
            samples.forEach(sample => {
                const sampleData = xPred.map((x, i) => ({ x, y: sample[i] }));
                g.append("path")
                    .attr("class", "sample")
                    .attr("d", lineGenerator(sampleData))
                    .attr("stroke", "#adb5bd") 
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.6)
                    .attr("fill", "none");
            });
        }

        // Desenho dos pontos
        trainingPoints.forEach(point => {
            g.append("circle")
                .attr("class", "train-point")
                .attr("cx", xScale(point.x))
                .attr("cy", yScale(point.y))
                .attr("r", 7)
                .attr("fill", "#f72585") 
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.2);
        });

        // Y = 0 linha
        g.append("line")
            .attr("class", "zero-line")
            .attr("x1", xScale(-5))
            .attr("x2", xScale(5))
            .attr("y1", yScale(0))
            .attr("y2", yScale(0))
            .attr("stroke", "#000000") 
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "5,3");

        // Y = 0 texto
        g.append("text")
            .attr("x", xScale(-5) + 5)
            .attr("y", yScale(0) - 8)
            .attr("fill", "#000000")
            .attr("font-size", "12")
            .attr("font-family", "'Fredoka', sans-serif")
            .style("user-select", "none") 
            .text("y = 0");

        // Borda do gráfico
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .attr("fill", "none")
            .attr("stroke", "#2c3e50")
            .attr("stroke-width", 2);

        // Legenda
        const legendData = [
            { label: "Train Point", color: "#f72585", symbol: "circle" },
            { label: "Mean Prediction", color: "#1e7d2f", symbol: "line" },
            { label: "Confidence Interval", color: "#bcdada", symbol: "area" }
        ];

        const legend = svg.append("g")
            .attr("class", "legend");

        // Primeiro criar todos os elementos
        const legendItems = legend.selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .each(function(d) {
                const item = d3.select(this);
                
                // Símbolo
                if (d.symbol === "circle") {
                    item.append("circle")
                        .attr("cx", 15)
                        .attr("cy", 15)
                        .attr("r", 7)
                        .attr("fill", d.color)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1.2);
                } else if (d.symbol === "line") {
                    item.append("line")
                        .attr("x1", 10)
                        .attr("x2", 25)
                        .attr("y1", 15)
                        .attr("y2", 15)
                        .attr("stroke", d.color)
                        .attr("stroke-width", 2.5);
                } else if (d.symbol === "area") {
                    item.append("rect")
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("width", 25)
                        .attr("height", 10)
                        .attr("fill", d.color);
                }
                item.append("text")
                    .attr("x", 45) 
                    .attr("y", 15)
                    .attr("dominant-baseline", "middle")
                    .style("font-family", "'Fredoka', sans-serif")
                    .style("font-size", "12px")
                    .text(d.label)
                    .style("user-select", "none") ;
            });

        let xPosition = 0;
        const padding = 30; // Espaço entre elementos

        legendItems.each(function() {
            const bbox = this.getBBox();
            d3.select(this)
                .attr("transform", `translate(${xPosition}, 0)`);
            xPosition += bbox.width + padding;
        });

        // Centralização
        const totalWidth = xPosition - padding; // Remoção do último padding
        legend.attr("transform", `translate(${(width - totalWidth)/2}, ${margin.top + 10})`);

    }

    function handleClick(event) {
        /*
        Adiciona ou remove pontos de treinamento no plot.
        */
        const rect = svgElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xVal = xScale.invert(x);
        const yVal = yScale.invert(y);

        const threshold = 0.1;
        const existingIndex = trainingPoints.findIndex(
            p => Math.abs(p.x - xVal) < threshold && Math.abs(p.y - yVal) < threshold
        );

        if (existingIndex !== -1) {
            trainingPoints = [
                ...trainingPoints.slice(0, existingIndex),
                ...trainingPoints.slice(existingIndex + 1)
            ];
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