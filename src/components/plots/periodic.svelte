<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { draw_kernel_func, kernel_Periodic, generateData } from '$components/plots/auxiliares.js';
  
    let svgContainer;
    
    const data = generateData(kernel_Periodic);
    
    onMount(() => {
      draw_kernel_func(svgContainer, data);
    });
  </script>
  
  <div bind:this={svgContainer}></div>
  