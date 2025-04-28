<script>
    // Variável alterada
    let effect = 90;
  
    // Função para lidar com a atualização do efeito
    function updateEffect(event) {
      effect = event.target.value;
    }
  </script>
  
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
  
    .slicer {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 0 auto;
    }
  
    .slicer h3 {
      text-align: center;
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }
  
    .slicer label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }
  
    /* Inputs de range */
    .slicer input[type="range"] {
      width: 100%;
      appearance: none;
      height: 8px;
      background: #ddd;
      border-radius: 5px;
      outline: none;
    }
  
    /* Labels de intervalo */
    .range-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-size: 12px;
      color: #555;
    }
  </style>
  
  <div class="slicer">
    <h3>Settings</h3>
    <div>
      <label for="effect">Effect</label>
      <input
        type="range"
        id="effect"
        name="effect"
        min="0"
        max="100"
        bind:value={effect}
        step="10"
        on:input={updateEffect}
      />
      <div class="range-labels">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  
    <div>
      <p>Effect: {effect}</p>
    </div>
  </div>
  