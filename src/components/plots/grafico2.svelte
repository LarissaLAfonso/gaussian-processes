<!-- <script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { scaleLinear } from 'd3-scale';
    import { abs, secondRadiationDependencies } from 'mathjs';
    import('$components/plots/auxiliares.js')

    let auxLoaded = false;
  
    // Configuration
    const containerWidth = 800;
    const containerHeight = 400;
    const margin = 20;
    
    // Left panel (2D plot)
    const leftWidth = containerWidth / 2 - margin * 2;
    const leftHeight = containerHeight - margin * 2;
    
    // Right panel (3D plot)
    const rightWidth = containerWidth / 2 - margin * 2;
    const rightHeight = containerHeight - margin * 2;
  
    // Generate exactly 3 random points
    let Xvalues = [1, 4.5 ,9]; // Fixed X values for reproducibility
    //let Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());

    function createViz(Xvalues)
    {
        // Create data points
        const points2D = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));

        // Left panel - 2D plot with ZOOMED IN scales
        const leftSvg = d3.select('#left-plot');
        
        // Original domains would be [0,10] for x and [-3,3] for y
        // Let's "zoom in" by making the domains smaller
        const zoomFactor = 1; // Adjust this to zoom more (higher number) or less
        
        const xScale2D = scaleLinear()
            .domain([5 - 5/zoomFactor, 5 + 5/zoomFactor]) // Centered zoom on x=5
            .range([margin, leftWidth - margin]);
            
        const yScale2D = scaleLinear()
            .domain([-3/zoomFactor, 3/zoomFactor]) // Zoomed y-axis
            .range([leftHeight - margin, margin]);
    }

    function resample() {
        // Clear existing SVGs
        d3.select('#left-plot').selectAll('*').remove();
        d3.select('#right-plot').selectAll('*').remove();
        
        // Regenerate Y values
        let Yvalues;
        if (!auxLoaded) {
            console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0)
                    .map(() => Array(Xvalues.length).fill(0));
                
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
                console.log('Generated data using auxiliares');
            } catch (err) {
                console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }
        
        // Recreate the visualization with new points
        createViz(Yvalues);
    }
  
    onMount(() => {
        let Yvalues;
        if (!auxLoaded) {
            console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0)
                    .map(() => Array(Xvalues.length).fill(0));
                
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
                console.log('Generated data using auxiliares');
            } catch (err) {
                console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }

        createViz(Xvalues);
        
    });
  </script>
  
  <style>
    .container {
      display: flex;
      width: 700px;
      height: 400px;
      margin: 10 auto;
    }
    
    .panel {
      flex: 1;
      padding: 20px;
      position: relative;
    }
    
    .panel-title {
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
    }
    
    svg {
      display: block;
      background: #f9f9f9;
    }
  </style>
  
  <div class="container">
    Left Panel - 2D Plot
    <div class="panel">
      <svg id="left-plot" width={leftWidth} height={leftHeight}></svg>
    </div>
    
    Right Panel - 3D Representation
    <div class="panel">
      <svg id="right-plot" width={rightWidth} height={rightHeight}></svg>
    </div>
  </div> -->

  <script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { scaleLinear } from 'd3-scale';
    import { abs, secondRadiationDependencies } from 'mathjs';
    import('$components/plots/auxiliares.js')

    let auxLoaded = false;
  
    // Configuration
    const containerWidth = 800;
    const containerHeight = 400;
    const margin = 20;
    
    // Left panel (2D plot)
    const leftWidth = containerWidth / 2 - margin * 2;
    const leftHeight = containerHeight - margin * 2;
    
    // Right panel (3D plot)
    const rightWidth = containerWidth / 2 - margin * 2;
    const rightHeight = containerHeight - margin * 2;
  
    // Generate exactly 3 random points
    let Xvalues = [1, 4.5, 9]; // Fixed X values for reproducibility

    function createViz(Xvalues, Yvalues) {  // Now accepts both X and Y values
        // Create data points
        const points2D = Xvalues.map((x, i) => ({ x, y: Yvalues[i] }));

        // Left panel - 2D plot with ZOOMED IN scales
        const leftSvg = d3.select('#left-plot');
        
        const zoomFactor = 1;
        
        const xScale2D = scaleLinear()
            .domain([5 - 5/zoomFactor, 5 + 5/zoomFactor])
            .range([margin, leftWidth - margin]);
            
        const yScale2D = scaleLinear()
            .domain([-3/zoomFactor, 3/zoomFactor])
            .range([leftHeight - margin, margin]);

        // Define colors for highlighting
        let firstColor = '#D99CA7';
        let secondColor = '#CCD9D1';
        let thirdColor = '#403231';

        // Draw highlighting lines
        leftSvg.append('line')
        .attr('x1', xScale2D(points2D[0].x))
        .attr('x2', xScale2D(points2D[0].x))
        .attr('y1', yScale2D(0))
        .attr('y2', yScale2D(points2D[0].y))
        .attr('stroke', firstColor)
        .attr('stroke-width', 3);

        leftSvg.append('line')
        .attr('x1', xScale2D(points2D[1].x))
        .attr('x2', xScale2D(points2D[1].x))
        .attr('y1', yScale2D(0))
        .attr('y2', yScale2D(points2D[1].y))
        .attr('stroke', secondColor)
        .attr('stroke-width', 3);

        leftSvg.append('line')
        .attr('x1', xScale2D(points2D[2].x))
        .attr('x2', xScale2D(points2D[2].x))
        .attr('y1', yScale2D(0))
        .attr('y2', yScale2D(points2D[2].y))
        .attr('stroke', thirdColor)
        .attr('stroke-width', 3);
  
      // Draw points
      leftSvg.selectAll('circle')
        .data(points2D)
        .enter()
        .append('circle')
        .attr('cx', d => xScale2D(d.x))
        .attr('cy', d => yScale2D(d.y))
        .attr('r', 6)
        .attr('fill', 'black');
  
      // Draw axes
      leftSvg.append('line')
        .attr('x1', xScale2D(0))
        .attr('x2', xScale2D(10))
        .attr('y1', yScale2D(0))
        .attr('y2', yScale2D(0))
        .attr('stroke', 'black')
        .attr('opacity', 0.5);
  
      leftSvg.append('line')
        .attr('x1', xScale2D(0))
        .attr('x2', xScale2D(0))
        .attr('y1', yScale2D(-3))
        .attr('y2', yScale2D(3))
        .attr('stroke', 'black')
        .attr('opacity', 0.5);

        //////////////
        // 3d graph //

        // 3D point data
        let point3D = {
            x: points2D[0].y,
            y: points2D[1].y,
            z: points2D[2].y
        };

        // Right panel - 3D representation with ZOOMED IN scales
        const rightSvg = d3.select('#right-plot');
        
        // 3D projection parameters
        const angle = Math.PI / 6;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        function project3D(x, y, z) {
            return {
                x: (x - z) * cosAngle,
                y: y + (x + z) * sinAngle
            };
        }

        // Zoomed in 3D scales
        const xScale3D = scaleLinear()
            .domain([-3/zoomFactor, 3/zoomFactor])
            .range([margin, rightWidth - margin]);
            
        const yScale3D = scaleLinear()
            .domain([-3/zoomFactor, 3/zoomFactor]) 
            .range([rightHeight - margin, margin]);
        

        // Draw 3D axes with proper projection
        // X axis (red)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(-3, 0, 0).x))
        .attr('x2', xScale3D(project3D(3, 0, 0).x))
        .attr('y1', yScale3D(project3D(-3, 0, 0).y))
        .attr('y2', yScale3D(project3D(3, 0, 0).y))
        .attr('stroke', 'black')
        .attr('opacity', 0.5);

        // Y axis (green)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(0, -3, 0).x))
        .attr('x2', xScale3D(project3D(0, 3, 0).x))
        .attr('y1', yScale3D(project3D(0, -3, 0).y))
        .attr('y2', yScale3D(project3D(0, 3, 0).y))
        .attr('stroke', 'black')
        .attr('opacity', 0.5);

        // Z axis (blue)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(0, 0, -3).x))
        .attr('x2', xScale3D(project3D(0, 0, 3).x))
        .attr('y1', yScale3D(project3D(0, 0, -3).y))
        .attr('y2', yScale3D(project3D(0, 0, 3).y))
        .attr('stroke', 'black')
        .attr('opacity', 0.5);

        // Project the 3D point
        const projectedPoint = project3D(point3D.x, point3D.y, point3D.z);

        // Draw 3D point
        rightSvg.append('circle')
        .attr('cx', xScale3D(projectedPoint.x))
        .attr('cy', yScale3D(projectedPoint.y))
        .attr('r', 6)
        .attr('fill', 'black');

        // Draw axis highlighting with proper projection
        // X component (first point)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(0, 0, 0).x))
        .attr('x2', xScale3D(project3D(point3D.x, 0, 0).x))
        .attr('y1', yScale3D(project3D(0, 0, 0).y))
        .attr('y2', yScale3D(project3D(point3D.x, 0, 0).y))
        .attr('stroke', firstColor)
        .attr('stroke-width', 3);

        // Y component (second point)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(0, 0, 0).x))
        .attr('x2', xScale3D(project3D(0, point3D.y, 0).x))
        .attr('y1', yScale3D(project3D(0, 0, 0).y))
        .attr('y2', yScale3D(project3D(0, point3D.y, 0).y))
        .attr('stroke', secondColor)
        .attr('stroke-width', 3);

        // Z component (third point)
        rightSvg.append('line')
        .attr('x1', xScale3D(project3D(0, 0, 0).x))
        .attr('x2', xScale3D(project3D(0, 0, point3D.z).x))
        .attr('y1', yScale3D(project3D(0, 0, 0).y))
        .attr('y2', yScale3D(project3D(0, 0, point3D.z).y))
        .attr('stroke', thirdColor)
        .attr('stroke-width', 3);

    }

    function resample() {
        // Clear existing SVGs
        d3.select('#left-plot').selectAll('*').remove();
        d3.select('#right-plot').selectAll('*').remove();
        
        // Regenerate Y values
        let Yvalues;
        if (!auxLoaded) {
            console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0)
                    .map(() => Array(Xvalues.length).fill(0));
                
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
                console.log('Generated data using auxiliares');
            } catch (err) {
                console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }
        
        // Recreate the visualization with new points
        createViz(Xvalues, Yvalues);  // Now passing both X and Y values
    }
  
    onMount(() => {
        let Yvalues;
        if (!auxLoaded) {
            console.warn('Using fallback data - auxiliares not loaded');
            Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
        } else {
            try {
                const mean = Array(Xvalues.length).fill(0);
                const variance = Array(Xvalues.length).fill(0)
                    .map(() => Array(Xvalues.length).fill(0));
                
                Yvalues = window.auxiliares.sampleNormal(mean, variance);
                console.log('Generated data using auxiliares');
            } catch (err) {
                console.error('Error in sampleNormal:', err);
                Yvalues = Xvalues.map(() => d3.randomNormal(0, 1)());
            }
        }

        createViz(Xvalues, Yvalues);  // Now passing both X and Y values
        
    });
</script>

<style>
    .container {
        display: flex;
        width: 700px;
        height: 400px;
        margin: 10px auto;
        position: relative;
    }
    
    .panel {
        flex: 1;
        padding: 20px;
        position: relative;
    }
    
    .panel-title {
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
    }
    
    svg {
        display: block;
        background: #f9f9f9;
    }

    .resample-button {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        z-index: 10;
    }
    .resample-button:hover {
        background-color: #45a049;
    }
</style>

<div class="container">
    <button class="resample-button" on:click={resample}>Resample Points</button>
    
    <!-- Left Panel - 2D Plot -->
    <div class="panel">
        <svg id="left-plot" width={leftWidth} height={leftHeight}></svg>
    </div>
    
    <!-- Right Panel - 3D Representation -->
    <div class="panel">
        <svg id="right-plot" width={rightWidth} height={rightHeight}></svg>
    </div>
</div>