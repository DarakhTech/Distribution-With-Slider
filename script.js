const distributions = {
    continuous: ["Uniform Continuous", "Normal", "Gamma", "Exponential", "Pareto"],
    discrete: ["Bernoulli", "Binomial", "Hypergeometric", "Geometric"]
  };
  
  function populateDistributionOptions(type) {
    const select = document.getElementById("distribution");
    select.innerHTML = "";
    distributions[type].forEach(dist => {
      const option = document.createElement("option");
      option.value = dist.toLowerCase().replace(/ /g, "_");
      option.text = dist;
      select.appendChild(option);
    });
    updateInputFields();
  }
  
  function updateDistributionOptions() {
    const type = document.getElementById("distributionType").value;
    populateDistributionOptions(type);
  }
  
  function updateRange() {
    const min = parseFloat(document.getElementById('minRange').value);
    const max = parseFloat(document.getElementById('maxRange').value);
    document.getElementById('rangeDisplay').innerText = `Range: [${min.toFixed(1)}, ${max.toFixed(1)}]`;
  }
  
  // --- Validation and Error Handling ---
function validateParameters(params, distName, minRange, maxRange) {
    let errors = [];
    // Range logic
    if (minRange > maxRange) {
        errors.push("Minimum range cannot be greater than maximum range.");
    }
    // Distribution-specific parameter checks
    switch (distName) {
        case "Uniform":
            if (params.a >= params.b) {
                errors.push("Uniform: 'a' (min) must be less than 'b' (max). Try different values.");
            }
            break;
        case "Normal":
            if (params.sigma <= 0) {
                errors.push("Normal: Standard deviation (σ) must be positive.");
            }
            break;
        case "Exponential":
            if (params.lambda <= 0) {
                errors.push("Exponential: Rate (λ) must be positive.");
            }
            break;
        case "Gamma":
            if (params.k <= 0 || params.theta <= 0) {
                errors.push("Gamma: Shape (k) and scale (θ) must be positive.");
            }
            break;
        case "Pareto":
            if (params.xm <= 0 || params.alpha <= 0) {
                errors.push("Pareto: xm and alpha must be positive.");
            }
            break;
        case "Bernoulli":
            if (params.p < 0 || params.p > 1) {
                errors.push("Bernoulli: p must be between 0 and 1.");
            }
            break;
        case "Binomial":
            if (!Number.isInteger(params.n) || params.n < 0) {
                errors.push("Binomial: n must be a non-negative integer.");
            }
            if (params.p < 0 || params.p > 1) {
                errors.push("Binomial: p must be between 0 and 1.");
            }
            break;
        case "Geometric":
            if (params.p <= 0 || params.p > 1) {
                errors.push("Geometric: p must be in (0, 1].");
            }
            break;
        case "Poisson":
            if (params.lambda <= 0) {
                errors.push("Poisson: λ must be positive.");
            }
            break;
        case "Hypergeometric":
            if (!Number.isInteger(params.N) || params.N <= 0) {
                errors.push("Hypergeometric: N must be a positive integer.");
            }
            if (!Number.isInteger(params.K) || params.K < 0 || params.K > params.N) {
                errors.push("Hypergeometric: K must be in [0, N].");
            }
            if (!Number.isInteger(params.n) || params.n < 0 || params.n > params.N) {
                errors.push("Hypergeometric: n must be in [0, N].");
            }
            break;
        // Add more as needed
    }
    return errors;
}

function showError(message) {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.margin = '10px 0';
        errorDiv.style.fontWeight = 'bold';
        document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.plots'));
    }
    errorDiv.textContent = message;
}

function clearError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.textContent = '';
}

// --- Update parameter input fields with min/max/step attributes ---
function updateInputFields() {
    const dist = document.getElementById("distribution").value;
    const container = document.getElementById("parameterInputs");
    container.innerHTML = "";
    const addField = (label, id, val) => {
      container.innerHTML += `<label>${label}:</label><br><input type='number' id='${id}' value='${val}'><br><br>`;
    };
  
    if (dist === "normal") {
      addField("Mean", "mean", 0);
      addField("Standard Deviation", "stddev", 1);
      // Set min/max/step for Normal
      document.getElementById("mean").min = -100;
      document.getElementById("mean").max = 100;
      document.getElementById("mean").step = 0.1;
      document.getElementById("stddev").min = 0.01;
      document.getElementById("stddev").max = 10;
      document.getElementById("stddev").step = 0.01;
    } else if (dist === "uniform_continuous") {
      addField("Min", "umin", 0);
      addField("Max", "umax", 10);
      // Set min/max/step for Uniform Continuous
      document.getElementById("umin").min = -100;
      document.getElementById("umin").max = 100;
      document.getElementById("umin").step = 0.1;
      document.getElementById("umax").min = -100;
      document.getElementById("umax").max = 100;
      document.getElementById("umax").step = 0.1;
    } else if (dist === "gamma") {
      addField("Shape", "shape", 1);
      addField("Scale", "scale", 1);
      // Set min/max/step for Gamma
      document.getElementById("shape").min = 0.01;
      document.getElementById("shape").max = 10;
      document.getElementById("shape").step = 0.01;
      document.getElementById("scale").min = 0.01;
      document.getElementById("scale").max = 10;
      document.getElementById("scale").step = 0.01;
    } else if (dist === "exponential") {
      addField("Rate", "rate", 1);
      // Set min/max/step for Exponential
      document.getElementById("rate").min = 0.01;
      document.getElementById("rate").max = 10;
      document.getElementById("rate").step = 0.01;
    } else if (dist === "pareto") {
      addField("Shape", "pshape", 1);
      addField("Location", "ploc", 1);
      // Set min/max/step for Pareto
      document.getElementById("pshape").min = 0.01;
      document.getElementById("pshape").max = 10;
      document.getElementById("pshape").step = 0.01;
      document.getElementById("ploc").min = 0.01;
      document.getElementById("ploc").max = 10;
      document.getElementById("ploc").step = 0.01;
    } else if (dist === "bernoulli") {
      addField("p", "p", 0.5);
      // Set min/max/step for Bernoulli
      document.getElementById("p").min = 0;
      document.getElementById("p").max = 1;
      document.getElementById("p").step = 0.01;
    } else if (dist === "binomial") {
      addField("p", "p", 0.5);
      addField("n", "n", 10);
      // Set min/max/step for Binomial
      document.getElementById("p").min = 0;
      document.getElementById("p").max = 1;
      document.getElementById("p").step = 0.01;
      document.getElementById("n").min = 0;
      document.getElementById("n").max = 100;
      document.getElementById("n").step = 1;
    } else if (dist === "hypergeometric") {
      addField("N (Population Size)", "N", 20);
      addField("M(Number of Successes)", "M", 10);
      addField("n (Sample Size)", "n", 10);
      // Set min/max/step for Hypergeometric
      document.getElementById("N").min = 1;
      document.getElementById("N").max = 1000;
      document.getElementById("N").step = 1;
      document.getElementById("M").min = 0;
      document.getElementById("M").max = 1000;
      document.getElementById("M").step = 1;
      document.getElementById("n").min = 0;
      document.getElementById("n").max = 1000;
      document.getElementById("n").step = 1;
    } else if (dist === "geometric") {
      addField("p", "p", 0.5);
      // Set min/max/step for Geometric
      document.getElementById("p").min = 0;
      document.getElementById("p").max = 1;
      document.getElementById("p").step = 0.01;
    }

    // Add event listeners to all parameter input fields for live updates
    const paramInputs = container.querySelectorAll("input[type='number']");
    paramInputs.forEach(input => {
      input.addEventListener('input', updateChart);
    });
  }
  
  function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }

  function updateChart() {
    clearError(); // Clear any previous error message
    const dist = document.getElementById("distribution").value;
    const minR = parseFloat(document.getElementById('minRange').value);
    const maxR = parseFloat(document.getElementById('maxRange').value);
    let x = [], y = [], inProb = 0, outProb = 0, label = dist.replace(/_/g, ' ');
  
    function integratePDF(pdfFunc, step = 0.01, range = [0, 10]) {
      for (let i = range[0]; i <= range[1]; i += step) {
        const val = i;
        const pdf = pdfFunc(val);
        x.push(val); y.push(pdf);
        if (val >= minR && val <= maxR) inProb += pdf * step;
        else outProb += pdf * step;
      }
    }
  
    if (dist === "normal") {
      const mean = parseFloat(document.getElementById("mean").value);
      const std = parseFloat(document.getElementById("stddev").value);
      integratePDF(val => math.exp(-Math.pow(val - mean, 2) / (2 * std * std)) / (std * Math.sqrt(2 * Math.PI)), 0.01, [-4, 4]);
    } else if (dist === "uniform_continuous") {
      const a = parseFloat(document.getElementById("umin").value);
      const b = parseFloat(document.getElementById("umax").value);
      const height = 1 / (b - a);
      integratePDF(i => (i >= a && i <= b) ? height : 0, 0.01, [a - 2, b + 2]);
    } else if (dist === "gamma") {
      const shape = parseFloat(document.getElementById("shape").value);
      const scale = parseFloat(document.getElementById("scale").value);
      integratePDF(val => (val > 0 ? Math.pow(val, shape - 1) * Math.exp(-val / scale) / (Math.pow(scale, shape) * math.gamma(shape)) : 0), 0.01, [0, 10]);
    } else if (dist === "exponential") {
      const rate = parseFloat(document.getElementById("rate").value);
      integratePDF(i => rate * Math.exp(-rate * i), 0.01, [0, 10]);
    } else if (dist === "pareto") {
      const a = parseFloat(document.getElementById("pshape").value);
      const xm = parseFloat(document.getElementById("ploc").value);
      integratePDF(i => (i >= xm) ? a * Math.pow(xm, a) / Math.pow(i, a + 1) : 0, 0.1, [xm, 100]);
    } else if (dist === "binomial") {
      const p = parseFloat(document.getElementById("p").value).toFixed(2);
      const n = parseInt(document.getElementById("n").value);
      for (let k = 0; k <= n; k++) {
        const pmf = math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        x.push(k); y.push(pmf);
        if (k >= minR && k <= maxR) inProb += pmf; else outProb += pmf;
      }
    } else if (dist === "bernoulli") {
      const p = parseFloat(document.getElementById("p").value).toFixed(2);
      x = [0, 1]; y = [1 - p, p];
      if (0 >= minR && 0 <= maxR) inProb += 1 - p; else outProb += 1 - p;
      if (1 >= minR && 1 <= maxR) inProb += p; else outProb += p;
    } else if (dist === "hypergeometric") {
      const N = parseInt(document.getElementById("N").value);
      const M = parseInt(document.getElementById("M").value);
      const n = parseInt(document.getElementById("n").value);
      for (let k = 0; k <= n; k++) {
        const pmf = (math.combinations(M, k) * math.combinations(N - M, n - k)) / math.combinations(N, n);
        x.push(k); y.push(pmf);
        if (k >= minR && k <= maxR) inProb += pmf; else outProb += pmf;
      }
    } else if (dist === "geometric") {
      const p = parseFloat(document.getElementById("p").value).toFixed(2);
      for (let k = 1; k <= 20; k++) {
        const pmf = Math.pow(1 - p, k - 1) * p;
        x.push(k); y.push(pmf);
        if (k >= minR && k <= maxR) inProb += pmf; else outProb += pmf;
      }
    }
  
    inProb = roundToTwoDecimals(inProb);
    outProb = roundToTwoDecimals(outProb);

    // Main PDF/PMF plot: highlight in-range area in yellow, out-of-range in blue
    let mainTraces = [];
    // Out-of-range (#4a148c)
    mainTraces.push({
      x: x.filter((val, i) => val < minR || val > maxR),
      y: y.filter((val, i) => x[i] < minR || x[i] > maxR),
      type: (dist.includes("normal") || dist.includes("continuous")) ? 'scatter' : 'bar',
      mode: (dist.includes("normal") || dist.includes("continuous")) ? 'lines' : undefined,
      fill: 'tozeroy',
      name: 'Out of Range',
      fillcolor: 'rgba(74, 20, 140, 0.2)', // #4a148c
      marker: { color: 'rgba(74, 20, 140, 0.7)' },
      line: { color: 'rgba(74, 20, 140, 1)', width: 3 }
    });
    // In-range (violet)
    mainTraces.push({
      x: x.filter((val, i) => val >= minR && val <= maxR),
      y: y.filter((val, i) => x[i] >= minR && x[i] <= maxR),
      type: (dist.includes("normal") || dist.includes("continuous")) ? 'scatter' : 'bar',
      mode: (dist.includes("normal") || dist.includes("continuous")) ? 'lines' : undefined,
      fill: 'tozeroy',
      name: 'In Range',
      fillcolor: 'rgba(238, 130, 238, 0.3)', // #ee82ee (violet)
      marker: { color: 'rgba(238, 130, 238, 0.8)' },
      line: { color: 'rgba(238, 130, 238, 1)', width: 3 }
    });

    // Add vertical lines at minR and maxR to indicate switching points
    const shapes = [
      {
        type: 'line',
        x0: minR,
        x1: minR,
        y0: 0,
        y1: Math.max(...y),
        line: {
          color: 'red',
          width: 2,
          dash: 'dashdot'
        }
      },
      {
        type: 'line',
        x0: maxR,
        x1: maxR,
        y0: 0,
        y1: Math.max(...y),
        line: {
          color: 'red',
          width: 2,
          dash: 'dashdot'
        }
      }
    ];

    // Add annotations for minR and maxR (show value above arrow)
    const annotations = [
      {
        x: minR,
        y: Math.max(...y),
        xref: 'x',
        yref: 'y',
        text: `minR = ${minR}`,
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { color: 'red', size: 12 },
        align: 'center'
      },
      {
        x: maxR,
        y: Math.max(...y),
        xref: 'x',
        yref: 'y',
        text: `maxR = ${maxR}`,
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { color: 'red', size: 12 },
        align: 'center'
      }
    ];

    Plotly.newPlot('mainPlot', mainTraces, {
      title: `${toTitleCase(label)} PDF/PMF`,
      xaxis: { title: 'Value' },
      yaxis: { title: 'Probability' },
      legend: { orientation: 'h' },
      shapes: shapes,
      annotations: annotations
    });

    // Bar chart: violet = in-range, #4a148c = out-of-range
    Plotly.newPlot('histogram', [{
      x: ['In Range', 'Out Range'],
      y: [inProb, outProb],
      type: 'bar',
      marker: { color: ['rgba(238, 130, 238, 0.8)', 'rgba(74, 20, 140, 0.7)'] },
      text: [`${(inProb * 100).toFixed(2)}%`, `${(outProb * 100).toFixed(2)}%`],
      textposition: 'auto'
    }], {
      title: 'Probability Histogram',
      yaxis: { title: 'Probability' }
    });

    // Pie chart: violet = in-range, #4a148c = out-of-range
    Plotly.newPlot('piechart', [{
      values: [inProb, outProb],
      labels: ['In Probability', 'Out Probability'],
      type: 'pie',
      marker: { colors: ['rgba(238, 130, 238, 0.8)', 'rgba(74, 20, 140, 0.7)'] },
      textinfo: 'label+percent'
    }], {
      title: `${label} Distribution ( p=${inProb.toFixed(2)} )`
    });

    clearError(); // Clear error before possibly showing a new one
    // Optionally, show a message if all probability is in or out of range
    if (inProb === 0) {
      showError('All probability is out of the selected range.');
    } else if (inProb === 1) {
      showError('All probability is within the selected range.');
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("distributionType").value = "continuous";
    populateDistributionOptions("continuous");
  });

  document.querySelectorAll('#distributionType, #distribution, #minRange, #maxRange').forEach(element => {
    element.addEventListener('input', updateChart);
  });

  document.querySelectorAll('#distributionType, #distribution').forEach(element => {
    element.addEventListener('change', () => {
      updateInputFields();
      updateChart();
    });
  });
  
  window.onload = () => {
    populateDistributionOptions("continuous");
    document.getElementById("distributionType").value = "continuous";
    updateChart();
  };

  function syncInput(type) {
    const range = document.getElementById(type + 'Range');
    const input = document.getElementById(type + 'Input');

    input.value = range.value;
    updateChart();
  }

  function syncSlider(type) {
    const input = document.getElementById(type + 'Input');
    const range = document.getElementById(type + 'Range');

    range.value = input.value;
    updateChart();
  }

  function syncSliderDisplay(type) {
    const value = parseFloat(document.getElementById(type + 'Range').value);
    document.getElementById(type + 'SelectedVal').innerText = value.toFixed(1);
    updateRange();
  }

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }