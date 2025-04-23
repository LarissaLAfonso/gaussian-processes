<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
  
    // Onde vamos desenhar o gráfico :)
    let svgContainer;
  
    // Dados de várias séries
    const aapl = [
        { date: new Date(2023, 0, 1), close: 150 },
        { date: new Date(2023, 0, 2), close: 155 },
        { date: new Date(2023, 0, 3), close: 160 },
        { date: new Date(2023, 0, 4), close: 158 },
        { date: new Date(2023, 0, 5), close: 162 },
        { date: new Date(2023, 0, 6), close: 159 }
    ];
  
    const msft = [
        { date: new Date(2023, 0, 1), close: 250 },
        { date: new Date(2023, 0, 2), close: 255 },
        { date: new Date(2023, 0, 3), close: 260 },
        { date: new Date(2023, 0, 4), close: 258 },
        { date: new Date(2023, 0, 5), close: 262 },
        { date: new Date(2023, 0, 6), close: 259 }
    ];

    // Chama o gráfico quando o componente montar
    onMount(() => {
      drawChart();
    });
  
    function drawChart() {
        const width = 928;
        const height = 500;
        // Espaco extra para colocar os eixos
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;
  
        const x = d3.scaleUtc(d3.extent(aapl, d => d.date), [marginLeft, width - marginRight]);
        const y = d3.scaleLinear([0, d3.max([aapl, msft], series => d3.max(series, d => d.close))], [height - marginBottom, marginTop]);
  
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close));
  
        const svg = d3.select(svgContainer)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
  
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily close ($)"));

        // Desenha a linha para a série AAPL
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line(aapl));

        // Desenha a linha para a série MSFT
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", line(msft));
    }
</script>
  
<div bind:this={svgContainer}></div>
