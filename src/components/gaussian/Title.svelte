<script>
    import Link from "$components/gaussian/Link.svelte";  
    import scrollY from "$stores/scrollY.js";
    $: opacity = Math.max(0, 1 - $scrollY / 200); // fade out after 200px  
    import { onMount } from "svelte";
	import * as d3 from "d3";

	let pathD = "";

	onMount(() => {
		const points = [
			[0, 100],
			[100, 50],
			[150, 120],
			[230, 80],
			[300, 20],
			[400, 80],
			[500, 100],
			[580, 90],
			[700, 10],
			[800, 100]
		];

		const lineGenerator = d3.line()
			.curve(d3.curveBasis) // smooth!
			.x(d => d[0])
			.y(d => d[1]);

		pathD = lineGenerator(points);
	});
</script>

<div class="wrapper fullscreen" style="opacity: {opacity}">
    <div class="graph-background" aria-hidden="true">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
            <path d="{pathD}" stroke="#F08D30" stroke-width="4" fill="none" stroke-linecap="round" />
            <!-- Draw dots -->
            {#each [
                [50, 120], [100, 180], [200, 60], [300, 10], [380, 120],
                [500, 40], [570, 70], [650, 45], [720, 100]
            ] as [cx, cy]}
                <circle cx={cx} cy={cy} r="5" class="dot" />
            {/each}
        </svg>
    </div>

    <h1>Gaussian Processes</h1>
    <h4>An intuitive exploration</h4>
    <p><span class="author-label">By</span> 
        <Link href="https://github.com/LarissaLAfonso">Larissa Lemos Afonso</Link>, 
        <Link href="https://github.com/LuuSamp">Luciano Pereira Sampaio</Link> & 
        <Link href="https://github.com/KaikyBraga">Kaiky Eduardo Alves Braga</Link>
    </p>
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
    background: white; /* Or your background */
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

    .wrapper h1 {
        font-size: 3rem;
        color: #fba6a6;
        margin-bottom: -0.5rem;
        position: relative;
        z-index: 2;
        text-shadow: 0 0 12px rgba(0, 0, 0, 0.21);
    }

    h4 {
        font-size: 1.2rem;
        color: #a0c4ff;
        margin-bottom: 1.8rem;
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
    
</style>
