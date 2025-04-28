import { 
    generateGPSamples, 
    kernel_Matern12, 
    kernel_Periodic, 
    kernel_Polynomial, 
    kernel_RBF 
  } from './auxiliares.js';
  
  // Parâmetros 
  const start = -5;
  const end = 5;
  const step = 0.1;
  
  // Dados para os Kernels
  const maternSamples = generateGPSamples((x, y) => kernel_Matern12(x, y, 1.0), start, end, step);
  const periodicSamples = generateGPSamples((x, y) => kernel_Periodic(x, y, 2.5, 1.0), start, end, step);
  const polynomialSamples = generateGPSamples((x, y) => kernel_Polynomial(x, y, 1, 4), start, end, step);
  const rbfSamples = generateGPSamples((x, y) => kernel_RBF(x, y, 0.8), start, end, step);
  
  // Exibir no console
  console.log('Matern12 Samples:', maternSamples);
  console.log('Periodic Samples:', periodicSamples);
  console.log('Polynomial Samples:', polynomialSamples);
  console.log('RBF Samples:', rbfSamples);
  