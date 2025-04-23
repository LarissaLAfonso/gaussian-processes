<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import regression from 'regression';

  let svgContainer;

  let data = [
    { x: 1, y: 10 }, { x: 2, y: 30 }, { x: 3, y: 50 }, { x: 4, y: 50 }, { x: 5, y: 30 },
    { x: 6, y: 40 }, { x: 7, y: 20 }, { x: 8, y: 15 }, { x: 9, y: 10 }, { x: 10, y: 12 },
    { x: 11, y: 4 }, { x: 12, y: 21 }, { x: 13, y: 40 }, { x: 14, y: 50 }, { x: 15, y: 80 },
    { x: 16, y: 90 }, { x: 17, y: 85 }, { x: 18, y: 70 }, { x: 19, y: 50 }, { x: 20, y: 30 }
  ];

  const degree = 3;

  function polynomialFit(data, degree) {
    const points = data.map(d => [d.x, d.y]);
    const result = regression.polynomial(points, { order: degree });
    return result.equation;
  }

  function yPred(x, coefficients) {
    let result = 0;

    for (let i = 0; i < coefficients.length; i++) {
        const coef = coefficients[i];
        const power = coefficients.length - i - 1;
        result += coef * Math.pow(x, power);  
    }

    return result;}

  function chart() {
    const width = 650;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) + 10])
      .range([height - margin.bottom, margin.top]);

    const coeffs = polynomialFit(data, degree);

    const lineData = d3.range(d3.min(data, d => d.x), d3.max(data, d => d.x), 0.2)
      .map(x => ({ x, y: yPred(x, coeffs) }));

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])

    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .call(g => g.select(".domain").attr("stroke", "#888"));

    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(10))
      .call(g => g.select(".domain").attr("stroke", "#888"));

    const grid = g => {

        
      g.append("g")
        .attr("stroke", "#eee")
        .selectAll("line")
        .data(yScale.ticks(10))
        .join("line")
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right);
    };

    svg.append("g").call(grid);
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .attr("fill", "#F2E0C9")
      .attr("stroke", "black")
      .attr("stroke-width", 1.6);

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCatmullRom); 

    svg.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "#F2A71B")
      .attr("stroke-width", 5)
      .attr("d", line);

    return svg.node();
  }

  onMount(() => {
    const svgNode = chart();
    svgContainer.appendChild(svgNode);
  });
</script>

<div bind:this={svgContainer}></div>
