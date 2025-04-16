<script>
    import Link from "$components/gaussian/Link.svelte";  
    import scrollY from "$stores/scrollY.js";
    $: opacity = Math.max(0, 1 - $scrollY / 200); // fade out after 200px  
</script>

<div class="wrapper fullscreen" style="opacity: {opacity}">
    <div class="graph-background" aria-hidden="true">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
            <path d="M0,100 
                     C100,50 150,320 230,80 
                     C230,50 300,-80 400,80 
                     C400,80 500,200 580,90 
                     C580,10 700,10 800,100" 
                  stroke="#F08D30" 
                  stroke-width="4" 
                  fill="none" 
                  stroke-linecap="round" />

            <circle cx="100" cy="120" r="5" class="dot" />
            <circle cx="150" cy="180" r="5" class="dot" />
            <circle cx="250" cy="60" r="5" class="dot" />
            <circle cx="300" cy="10" r="5" class="dot" />
            <circle cx="400" cy="120" r="5" class="dot" />
            <circle cx="500" cy="50" r="5" class="dot" />
            <circle cx="570" cy="160" r="5" class="dot" />
            <circle cx="650" cy="45" r="5" class="dot" />
            <circle cx="720" cy="60" r="5" class="dot" />
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
