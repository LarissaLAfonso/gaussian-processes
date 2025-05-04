import * as d3 from 'd3';

// Funções de Kernel
export function kernel_Matern12(x, y = 0, lengthScale = 1.5) {
  return Math.exp(-Math.abs(x - y) / lengthScale);
}

export function kernel_Periodic(x, y = 0, period = 1.0, lengthScale = 1.0) {
  return Math.exp(-2 * Math.sin(Math.PI * Math.abs(x - y) / period) ** 2 / (lengthScale ** 2));
}

export function kernel_Polynomial(x, y = 0, constant = 0, degree = 3) {
  return Math.pow((x * y + constant), degree);
}

export function kernel_RBF(x, y = 0, lengthScale = 1.0) {
  return Math.exp(-0.5 * ((x - y) ** 2) / (lengthScale ** 2));
}

export function cholesky(A) {
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

// Geração de dados
export function generateData(kernelFunction, start = -5, end = 5, step = 0.05) {
  const data = [];
  for (let x = start; x <= end; x += step) {
    data.push({ x, y: kernelFunction(x) });
  }
  return data;
}

export function sampleNormal(mean, cov) {
  /*
  Gera uma amostra de uma distribuição normal multivariada com média e matriz de covariância especificadas.
  */
  const n = mean.length;
  const L = cholesky(cov);
  const z = Array.from({ length: n }, () => d3.randomNormal(0, 1)());
  const sample = math.multiply(L, z);
  return sample.map((val, i) => val + mean[i]);
}

export function generateGPSamples(kernelFunction, start = -5, end = 5, step = 0.05) {
  const xArray = [];
  for (let x = start; x <= end; x += step) {
    xArray.push(x);
  }

  const K = [];
  for (let i = 0; i < xArray.length; i++) {
    K[i] = [];
    for (let j = 0; j < xArray.length; j++) {
      K[i][j] = kernelFunction(xArray[i], xArray[j]);
      if (i === j) K[i][j] += 1e-8; 
    }
  }

  const mean = Array(xArray.length).fill(0);
  const fSamples = sampleNormal(mean, K);

  const data = xArray.map((xi, idx) => ({ x: xi, y: fSamples[idx] }));

  return data;
}

// Plot do Kernel
export function draw_kernel_func(svgContainer, data) {
  const width = 800;
  const height = 400;
  const margin = { top: 10, right: 10, bottom: 30, left: 10 };

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  const svg = d3.select(svgContainer)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto");

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue") 
    .attr("stroke-width", 2)
    .attr("d", line);

  svg.append("line")
    .attr("x1", margin.left)
    .attr("y1", height - margin.bottom)
    .attr("x2", width - margin.right)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "black")
    .attr("stroke-width", 1);  
}

export function updateDimensions(containerElement) {
  if (!containerElement) return fallbackDimensions();
  
  try {
      const rect = containerElement.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      return {
          container: {
              width: containerWidth,
              height: containerHeight
          },
          panels: {
              left: {
                  width: containerWidth * 0.48,
                  height: containerHeight * 0.7
              },
              right: {
                  width: containerWidth * 0.48,
                  height: containerHeight * 0.7
              }
          },
          margin: containerWidth * 0.02
      };
  } catch (error) {
      console.error('Dimension error:', error);
      return fallbackDimensions();
  }
}

function fallbackDimensions() {
  return {
      container: { width: 800, height: 600 },
      panels: {
          left: { width: 380, height: 500 },
          right: { width: 380, height: 500 }
      },
      margin: 20
  };
}

export default {
  updateDimensions
};