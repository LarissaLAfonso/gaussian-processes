<script>
    // Variável alterada
    let effect = 90;
  
    // Função para lidar com a atualização do efeito
    function updateEffect(event) {
      effect = event.target.value;
    }
  </script>
  
  <style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial, sans-serif;
    }

    .kernel-selection {
        margin-bottom: 20px;
    }

    .sliders {
        margin-top: 20px;
        max-width: 400px;
        width: 100%;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .slider-label {
        display: block;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
    }

    /* Estilo para os sliders */
    .slicer input[type="range"] {
        width: 100%;
        appearance: none;
        height: 8px;
        background: #ddd;
        border-radius: 5px;
        outline: none;
        transition: background 0.3s ease;
    }

    .slicer input[type="range"]:hover {
        background: #bbb;
    }

    /* Labels de intervalo */
    .range-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        font-size: 12px;
        color: #555;
    }

    /* Adicionar margin para os sliders */
    .slider {
        margin-bottom: 20px;
    }
</style>

<div class="container">
    <!-- Botões para seleção do Kernel -->
    <div class="kernel-selection">
        <!-- Rádio Buttons para seleção do kernel -->
        <input type="radio" id="rbf" name="kernel" value="kernel_RBF" bind:group={selectedKernel} />
        <label for="rbf">RBF</label>

        <input type="radio" id="matern" name="kernel" value="kernel_Matern12" bind:group={selectedKernel} />
        <label for="matern">Matern</label>

        <input type="radio" id="periodic" name="kernel" value="kernel_Periodic" bind:group={selectedKernel} />
        <label for="periodic">Periodic</label>

        <input type="radio" id="polynomial" name="kernel" value="kernel_Polynomial" bind:group={selectedKernel} />
        <label for="polynomial">Polynomial</label>
    </div>

    <!-- SVG para o gráfico -->
    <svg id="gp-svg"></svg>

    <!-- Sliders com estilo customizado -->
    <div class="sliders">
        {#if selectedKernel === 'kernel_RBF'}
            <div class="slider">
                <label class="slider-label">RBF Length Scale</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_rbf_lengthScale} on:input={updateRBFLengthScale} />
                <div class="range-labels">
                    <span>0.1</span>
                    <span>3</span>
                </div>
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Matern12'}
            <div class="slider">
                <label class="slider-label">Matern Length Scale</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_matern_lengthScale} on:input={updateMaternLengthScale} />
                <div class="range-labels">
                    <span>0.1</span>
                    <span>3</span>
                </div>
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Periodic'}
            <div class="slider">
                <label class="slider-label">Periodic Period</label>
                <input type="range" min="0.1" max="5" step="0.1" value={par_periodic_period} on:input={updatePeriodicPeriod} />
                <div class="range-labels">
                    <span>0.1</span>
                    <span>5</span>
                </div>
            </div>
            <div class="slider">
                <label class="slider-label">Periodic Length Scale</label>
                <input type="range" min="0.1" max="3" step="0.1" value={par_periodic_lengthScale} on:input={updatePeriodicLengthScale} />
                <div class="range-labels">
                    <span>0.1</span>
                    <span>3</span>
                </div>
            </div>
        {/if}

        {#if selectedKernel === 'kernel_Polynomial'}
            <div class="slider">
                <label class="slider-label">Polynomial Constant</label>
                <input type="range" min="0" max="10" step="1" value={par_polynomial_constant} on:input={updatePolynomialConstant} />
                <div class="range-labels">
                    <span>0</span>
                    <span>10</span>
                </div>
            </div>
            <div class="slider">
                <label class="slider-label">Polynomial Degree</label>
                <input type="range" min="1" max="5" step="1" value={par_polynomial_degree} on:input={updatePolynomialDegree} />
                <div class="range-labels">
                    <span>1</span>
                    <span>5</span>
                </div>
            </div>
        {/if}
    </div>
</div>