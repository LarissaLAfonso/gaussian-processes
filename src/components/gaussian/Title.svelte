<script>
	import Link from "$components/gaussian/Link.svelte";  
	import scrollY from "$stores/scrollY.js";
	import { onMount } from "svelte";
	import * as d3 from "d3";

	$: opacity = Math.max(0, 1 - $scrollY / 200);

	const points = [
        [0, 100],
		[50, 120],
		[100, 180],
		[200, 60],
		[300, 15],
		[380, 120],
		[500, 40],
		[570, 70],
		[650, 45],
		[720, 100],
        [800, 80]
	];

	const uncertainty = [
		20, 25, 15, 30, 15, 20, 18, 22, 19, 21, 20 // Desvio Padrão
	];

	let pathD = "";
	let areaD = "";

	onMount(() => {
		const lineGenerator = d3.line()
			.curve(d3.curveMonotoneX)
			.x(d => d[0])
			.y(d => d[1]);

		pathD = lineGenerator(points);

		const upper = points.map(([x, y], i) => [x, y - uncertainty[i]]);
		const lower = points.map(([x, y], i) => [x, y + uncertainty[i]]).reverse();

		const areaGenerator = d3.line()
			.curve(d3.curveMonotoneX)
			.x(d => d[0])
			.y(d => d[1]);

		areaD = areaGenerator([...upper, ...lower]);
	});
</script>

<div class="wrapper fullscreen" style="opacity: {opacity}; pointer-events: {opacity === 0 ? 'none' : 'auto'}">
	<div class="graph-background" aria-hidden="true">
		<svg viewBox="0 0 800 200" preserveAspectRatio="none">
			<!-- Intervalo de Confiança -->
			<path d="{areaD}" fill="#F08D30" fill-opacity="0.19" stroke="none" />

			<!-- Linha Principal -->
			<path d="{pathD}" stroke="#F08D30" stroke-width="4" fill="none" stroke-linecap="round" />

			<!-- Pontos -->
			{#each [
                [50, 120], [100, 180], [200, 60], [300, 15], [380, 120],
                [500, 40], [570, 70], [650, 45], [720, 100]
            ] as [cx, cy]}
                <circle cx={cx} cy={cy} r="5" class="dot" />
            {/each}
			</svg>
	</div>

	<h1 class="montserrat-heading">Gaussian Processes</h1>
	<h2 class="montserrat-subtitle">An intuitive exploration</h2>
	<p> By
		<Link href="https://github.com/LarissaLAfonso">Larissa Lemos Afonso</Link>, 
		<Link href="https://github.com/LuuSamp">Luciano Pereira Sampaio</Link> & 
		<Link href="https://github.com/KaikyBraga">Kaiky Eduardo Alves Braga</Link>
	</p>	
	
	<div class="scroll-indicator">
		<svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M6 9l6 6 6-6" stroke="#79a98b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg><svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M6 9l6 6 6-6" stroke="#79a98b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<div class="text">Scroll Down</div>
	</div>
	
	<img src="laughing.png" alt="corner decoration" class="corner-image" />
</div>


<style>
	@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

	.wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
		font-family: 'Fredoka', sans-serif;
		text-align: center;
		overflow: hidden;
	}

	.wrapper.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
	}

	.graph-background {
		position: absolute;
		top: 30px;
		left: 0;
		width: 100%;
		height: 200px;
		z-index: 0;
		pointer-events: none;
		opacity: 0.35;
	}

	.dot {
		fill: #3D30F0;
	}

	.montserrat-heading {
		font-weight: 520;
		font-style: normal;
		font-size: 5rem;
		color: #fba6a6;
		margin-bottom: 0rem;
		position: relative;
		z-index: 2;
		text-shadow: 0 0 12px rgba(0, 0, 0, 0.21);
	}

	.montserrat-subtitle {		
		font-weight: 450;
		font-style: normal;
		font-size: 2rem;
		color: #a0c4ff;
		margin-bottom: 1rem;
		position: relative;
		z-index: 2;
	}

	p {
		font-size: 1.1rem;
		color: rgb(200, 200, 200);
		position: relative;
		z-index: 2;
	}
	.corner-image {
		position: absolute;
		right: 8rem;
		bottom: 6rem;
		width: 300px; 
		height: auto;
		opacity: 0.8;
		pointer-events: none;
		z-index: 1;
		transform: rotate(15deg);
	}

	.scroll-indicator {
		margin-top: 1rem;
		text-align: center;
		animation: fadeIn 2s ease-in;
		z-index: 2;
		position: relative;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 40px; 
		text-align: center;
		z-index: 2;
		width: 100%; 
	}

	.scroll-indicator .arrow-icon {
		margin: -14px auto;
		display: block;
		animation: bounce 1.5s infinite;
	}

	.scroll-indicator .text {
		font-size: 1.15rem;
		margin-top: 13px;
		color: #79a98b;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(8px);
		}
	}
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
