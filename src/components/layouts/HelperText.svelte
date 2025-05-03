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
        background-color: #e5e7eb; 
        border-radius: 12px;      
        margin-top: 20px;         
        width: 80%;                
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
        font-size: 16px;
        color: #333;
    }
</style>


<div class="helper-text">
    <slot/>
</div>

