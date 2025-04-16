<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    onMount(() => {
      // Dados aleatórios
      const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 20);
  
      // Configuração do gráfico
      const width = 400;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
      const svg = d3.select('#random-bar-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, width])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .nice()
        .range([height, 0]);
  
      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(i))
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', '#3498db');
      
      // Eixos
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
        
      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));
    });
  </script>
  
  <div class="wrapper">
      <div class="ui-wrapper">
          <p>Oiê! Eu sou um wrapper! ;)</p>
          <div id="random-bar-chart"></div> <!-- Aqui que o gráfico aparece -->
      </div>
  </div>
  
