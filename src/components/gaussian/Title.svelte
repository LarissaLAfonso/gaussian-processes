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
		[300, 10],
		[380, 120],
		[500, 40],
		[570, 70],
		[650, 45],
		[720, 100],
        [800, 80]
	];

	const uncertainty = [
		20, 25, 15, 30, 25, 20, 18, 22, 19, 21, 20 // Desvio Padrão
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

<div class="wrapper fullscreen" style="opacity: {opacity}">
	<div class="graph-background" aria-hidden="true">
		<svg viewBox="0 0 800 200" preserveAspectRatio="none">
			<!-- Intervalo de Confiança -->
			<path d="{areaD}" fill="#F08D30" fill-opacity="0.19" stroke="none" />

			<!-- Linha Principal -->
			<path d="{pathD}" stroke="#F08D30" stroke-width="4" fill="none" stroke-linecap="round" />

			<!-- Pontos -->
			{#each [
                [50, 120], [100, 180], [200, 60], [300, 10], [380, 120],
                [500, 40], [570, 70], [650, 45], [720, 100]
            ] as [cx, cy]}
                <circle cx={cx} cy={cy} r="5" class="dot" />
            {/each}
			</svg>
	</div>

	<h1 class="montserrat-heading">Gaussian Processes</h1>
	<h2 class="montserrat-subtitle">An intuitive exploration</h2>
	<p><span class="author-label">By</span> 
		<Link href="https://github.com/LarissaLAfonso">Larissa Lemos Afonso</Link>, 
		<Link href="https://github.com/LuuSamp">Luciano Pereira Sampaio</Link> & 
		<Link href="https://github.com/KaikyBraga">Kaiky Eduardo Alves Braga</Link>
	</p>

	<img src="laughing.png" alt="corner decoration" class="corner-image" />
</div>


<style>
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
		font-family: 'Poppins', 'Comic Neue', 'Quicksand', sans-serif;
		text-align: center;
		padding: 1.2rem;
		border-radius: 1.4rem;
		overflow: hidden;
	}

	.wrapper.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
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
		transition: transform 0.3s ease, fill 0.3s ease;
	}

	.dot:hover {
		transform: scale(1.4);
		fill: #5B4FFF;
	}

	.montserrat-heading {
		font-family: "Montserrat", sans-serif;
		font-weight: 600;
		font-style: normal;
		font-size: 3rem;
		color: #fba6a6;
		margin-bottom: 0.5rem;
		position: relative;
		z-index: 2;
		text-shadow: 0 0 12px rgba(0, 0, 0, 0.21);
	}

	.montserrat-subtitle {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 1.4rem;
		color: #a0c4ff;
		margin-bottom: 1rem;
		position: relative;
		z-index: 2;
	}

	p {
		color: rgb(200, 200, 200);
		position: relative;
		z-index: 2;
	}

	a {
		text-decoration: none;
		color: #ffafcc;
		font-weight: bold;
	}

	a:hover {
		color: #ffc8dd;
	}

	.corner-image {
		position: absolute;
		right: 8rem;
		bottom: 6rem;
		width: 300px; /* adjust as needed */
		height: auto;
		opacity: 0.8;
		pointer-events: none;
		z-index: 1;
		transform: rotate(15deg);
	}

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
