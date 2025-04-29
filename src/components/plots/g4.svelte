<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as math from 'mathjs';

  let width = 800;
  let height = 400;
  let margin = { top: 20, right: 20, bottom: 40, left: 40 };
  let svg;
  let paths = [];
  let line;
  let interval;
  let maxLines = 20;

  const Xtest = d3.range(-5, 5.01, 0.01);  // Range dos dados

  // Hyperparâmetros dos kernels
  const lengthScale = 1.5;      // Desvio Padrão na RBF
  const noiseVariance = 1e-6;   // Ruído para a matriz de Covariância
  const period = 1.0;           // Período para o kernel periódico
  const degree = 3;             // Grau para o kernel polinomial
  const constant = 0.1;         // Constante para o kernel polinomial

  function kernel_Polynomial(x, y) {
    return Math.pow((x * y + constant), degree);
  }

  function buildCovarianceMatrix(X1, X2, kernelFunc) {
    const matrix = [];
    for (let i = 0; i < X1.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < X2.length; j++) {
        matrix[i][j] = kernelFunc(X1[i], X2[j]);
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

  function addLine(K) {
    const samples = sampleNormal(Array(Xtest.length).fill(0), K);

    if (paths.length > 0) {
      paths[paths.length - 1]
        .attr('stroke', '#808080')    // Cor cinza para linha antiga
        .attr('opacity', 0.5);
    }

    const path = svg.select('#paths-group').append('path')
      .datum(samples)
      .attr('fill', 'none')
      .attr('stroke', 'blue')         // Cor azul para linha nova
      .attr('stroke-width', 2)
      .attr('d', line)
      .attr('opacity', 1);

    paths.push(path);

    if (paths.length >= maxLines) {
      clearInterval(interval);
    }
  }

  onMount(() => {
    svg = d3.select('#gp-svg')
      .attr('width', width)
      .attr('height', height);

    // Grupos separados para paths e eixos
    const pathsGroup = svg.append('g').attr('id', 'paths-group');
    const axesGroup = svg.append('g').attr('id', 'axes-group');

    const xScale = d3.scaleLinear().domain([-5, 5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-3, 3]).range([height, 0]);

    line = d3.line()
      .x((d, i) => xScale(Xtest[i]))
      .y(d => yScale(d));

    // Eixos sem ticks
    const xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickFormat('');

    axesGroup.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(xAxis)
      .select('.domain')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(0)
      .tickFormat('');

    axesGroup.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(yAxis)
      .select('.domain')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    const kernelFunc = kernel_Polynomial;
    const K = buildCovarianceMatrix(Xtest, Xtest, kernelFunc);
    for (let i = 0; i < K.length; i++) K[i][i] += noiseVariance;
      
    interval = setInterval(() => addLine(K), 2000);
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