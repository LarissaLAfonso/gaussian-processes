<svelte:head>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</svelte:head>
        <script>
            MathJax = {
                tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
            };
            </script>

<style>

    .helper-text {
        padding: 1rem;
        font-family: 'Fredoka', sans-serif;
        background-color: #e5e7eb;
        border-radius: 12px;
        margin-top: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        text-align: justify;
        color: #333;
    }
</style>


<div class="helper-text">
    <slot/>
</div>

