<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as math from 'mathjs';  

  let width = 800;
  let height = 400;
  let margin = { top: 20, right: 20, bottom: 40, left: 40 };

  let svg;

  // Range dos dados
  const Xtest = d3.range(-5, 5.01, 0.01);

  // Hyperparâmetros do kernel
  const lengthScale = 1.5;
  const noiseVariance = 1e-6;

  function kernel_RBF(x, y) {
    return Math.exp(-0.5 * ((x - y) ** 2) / (lengthScale ** 2));
  }

  function buildCovarianceMatrix(X1, X2) {
    const matrix = [];
    for (let i = 0; i < X1.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < X2.length; j++) {
        matrix[i][j] = kernel_RBF(X1[i], X2[j]);
      }
    }
    return matrix;
  }

  function cholesky(A) {
    const n = A.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }
        if (i === j) {
          L[i][j] = Math.sqrt(A[i][i] - sum);
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }
      }
    }
    return L;
  }
  
  function sampleNormal(mean, cov) {
    const n = mean.length;
    const L = cholesky(cov);
    const z = Array.from({ length: n }, () => d3.randomNormal(0, 1)());
    const sample = math.multiply(L, z);
    return sample.map((val, i) => val + mean[i]);
  }

  async function draw() {
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-3, 3])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d, i) => xScale(Xtest[i]))
      .y(d => yScale(d));

    // Eixos
    svg.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)  
      .call(d3.axisBottom(xScale));
    svg.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)  
      .call(d3.axisLeft(yScale));

    const K = buildCovarianceMatrix(Xtest, Xtest);
    for (let i = 0; i < K.length; i++) {
      K[i][i] += noiseVariance;
    }

    // Desenho das linhas
    const grayColor = "#808080";  
    const numLines = 10;
    for (let i = 0; i < numLines; i++) {
      const samples = sampleNormal(Array(Xtest.length).fill(0), K);
      svg.append('path')
        .datum(samples)
        .attr('fill', 'none')
        .attr('stroke', grayColor)  
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('opacity', 0.6);
    }
  }

  onMount(() => {
    svg = d3.select('#gp-svg')
      .attr('width', width)
      .attr('height', height);

    draw();
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  svg {
    margin-top: 20px;
  }
</style>

<div class="container">
  <svg id="gp-svg"></svg>
</div>
