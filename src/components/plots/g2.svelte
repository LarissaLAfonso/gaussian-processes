<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data = [12, 19, 3, 5, 2];
    let labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'];
  
    let svg;
  
    function drawBarChart(svgElement, data, labels) {
      const width = 400;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
      const x = d3.scaleBand()
        .domain(labels)
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      const svgSelection = d3.select(svgElement)
        .attr('viewBox', [0, 0, width, height]);
  
      svgSelection.append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
          .attr('x', (d, i) => x(labels[i]))
          .attr('y', d => y(d))
          .attr('height', d => y(0) - y(d))
          .attr('width', x.bandwidth())
          .attr('fill', 'steelblue');
  
      svgSelection.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
  
      svgSelection.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    }
  
    onMount(() => {
      drawBarChart(svg, data, labels);
    });
  </script>
  
  <!--Dando um show no gráfico -->
  <svg bind:this={svg} />
  