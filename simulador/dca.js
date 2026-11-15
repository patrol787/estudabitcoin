window.addEventListener('load', function() {
      if (typeof Chart === 'undefined') return;

      const YEARS_MIN = 1;
      const YEARS_MAX = 40;
      const CUSTOM_RATE_MAX_PCT = 200;
      const CUSTOM_LINE_COLOR = '#e4e4ea';

      const canvas = document.getElementById('compound-dca-chart');
      const tbody = document.getElementById('compound-dca-tbody');
      const initialEl = document.getElementById('dca-initial');
      const monthlyEl = document.getElementById('dca-monthly');
      const yearsNumEl = document.getElementById('dca-years-number');
      const rangeEl = document.getElementById('dca-years-range');
      const outEl = document.getElementById('dca-years-out');
      const btnScaleLinear = document.getElementById('dca-scale-linear');
      const btnScaleLog = document.getElementById('dca-scale-log');
      const customRateEl = document.getElementById('dca-custom-rate');
      const customRateErrEl = document.getElementById('dca-custom-rate-error');

      if (
        !canvas ||
        !tbody ||
        !initialEl ||
        !monthlyEl ||
        !yearsNumEl ||
        !btnScaleLinear ||
        !btnScaleLog ||
        !customRateEl ||
        !customRateErrEl
      ) {
        return;
      }

      /* --- Inicialização: canvas, estado do gráfico, formatadores --- */

      const ctx = canvas.getContext('2d');
      const mqWide = window.matchMedia('(min-width: 700px)');
      const chartCache = { labels: null, datasets: null, totalInvCommon: 0 };

      let chartInstance = null;
      let yScaleMode = 'linear';

      Chart.defaults.font.family =
        'Inter, Segoe UI, system-ui, -apple-system, sans-serif';
      Chart.defaults.color = '#b0b0b8';

      const vehicles = [
        { label: 'Depósitos a prazo — Portugal (1 % / ano)', rate: 0.01, color: '#91aec9' },
        { label: 'Certificados de Aforro (2,5 % / ano)', rate: 0.025, color: '#56b4c9' },
        { label: 'PPR — média mercado (1,5 % / ano)', rate: 0.015, color: '#5ec9be' },
        { label: 'Imobiliário — Portugal (6 % / ano)', rate: 0.06, color: '#c49cfc' },
        { label: 'S&P 500 (10 % / ano)', rate: 0.10, color: '#8bcf7a' },
        { label: 'Ouro (20 % / ano)', rate: 0.20, color: '#e8c547' },
        { label: 'Bitcoin (30 % / ano)', rate: 0.30, color: '#f7931a' }
      ];

      const eurFmt = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      });
      const pctFmt = new Intl.NumberFormat('pt-PT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      const pctLabelFmt = new Intl.NumberFormat('pt-PT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
      const compactNumFmt = new Intl.NumberFormat('pt-PT', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
      });

      /* --- Cálculo e dados --- */

      function monthlyRate(annual) {
        return Math.pow(1 + annual, 1 / 12) - 1;
      }

      function simulate(initial, monthly, years, annualRate) {
        const months = Math.round(Math.max(0, years) * 12);
        const rm = monthlyRate(annualRate);
        let balance = Math.max(0, initial);
        const series = [{ month: 0, value: balance }];
        for (let m = 1; m <= months; m++) {
          balance = balance * (1 + rm) + monthly;
          series.push({ month: m, value: balance });
        }
        const totalInvested = Math.max(0, initial) + monthly * months;
        return { final: balance, totalInvested: totalInvested, series: series };
      }

      function yearlyPoints(series, years) {
        const pts = [];
        const len = series.length;
        for (let y = 0; y <= years; y++) {
          pts.push(series[Math.min(y * 12, len - 1)].value);
        }
        return pts;
      }

      function parseMoney(el) {
        const v = parseFloat(String(el.value).replace(',', '.'));
        return Number.isFinite(v) ? Math.max(0, v) : 0;
      }

      function pctDisplay(totalInv, finalVal) {
        if (totalInv <= 0) return '—';
        return pctFmt.format((finalVal - totalInv) / totalInv * 100) + '\u00A0%';
      }

      function customVehicleLabel(ratePct) {
        return 'Personalizado (' + pctLabelFmt.format(ratePct) + '\u00A0% / ano)';
      }

      function parseCustomAnnualRate() {
        const trimmed = String(customRateEl.value).trim();
        if (trimmed === '') {
          customRateErrEl.textContent = '';
          customRateErrEl.hidden = true;
          customRateEl.setAttribute('aria-invalid', 'false');
          return { include: false };
        }
        const normalized = trimmed.replace(/\s/g, '').replace(',', '.');
        const num = parseFloat(normalized);
        if (!Number.isFinite(num)) {
          customRateErrEl.textContent = 'Introduz um número válido.';
          customRateErrEl.hidden = false;
          customRateEl.setAttribute('aria-invalid', 'true');
          return { include: false };
        }
        if (num < 0 || num > CUSTOM_RATE_MAX_PCT) {
          customRateErrEl.textContent = 'Usa um valor entre 0 e 200.';
          customRateErrEl.hidden = false;
          customRateEl.setAttribute('aria-invalid', 'true');
          return { include: false };
        }
        customRateErrEl.textContent = '';
        customRateErrEl.hidden = true;
        customRateEl.setAttribute('aria-invalid', 'false');
        if (num <= 0) return { include: false };
        return { include: true, ratePct: num, rateDecimal: num / 100 };
      }

      function yearLabels(years) {
        const labels = ['Início'];
        for (let i = 1; i <= years; i++) labels.push('Ano ' + i);
        return labels;
      }

      /* --- Gráfico e tabela --- */

      function datasetsForChart(datasets, logScale) {
        if (!logScale) return datasets;
        return datasets.map(function(ds) {
          return {
            label: ds.label,
            data: ds.data.map(function(v) {
              return typeof v === 'number' && v > 0 ? v : null;
            }),
            borderColor: ds.borderColor,
            backgroundColor: ds.backgroundColor,
            tension: ds.tension,
            pointRadius: ds.pointRadius,
            pointHoverRadius: ds.pointHoverRadius,
            borderWidth: ds.borderWidth,
            spanGaps: false
          };
        });
      }

      function lineDataset(label, color, data) {
        return {
          label: label,
          data: data,
          borderColor: color,
          backgroundColor: 'transparent',
          tension: 0.15,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        };
      }

      function appendComparisonRow(label, res) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.textContent = label;

        const tdInv = document.createElement('td');
        tdInv.textContent = eurFmt.format(res.totalInvested);
        const tdFin = document.createElement('td');
        tdFin.textContent = eurFmt.format(res.final);
        const tdRet = document.createElement('td');
        tdRet.textContent = eurFmt.format(res.final - res.totalInvested);
        const tdPct = document.createElement('td');
        tdPct.textContent = pctDisplay(res.totalInvested, res.final);

        tr.append(th, tdInv, tdFin, tdRet, tdPct);
        tbody.appendChild(tr);
      }

      function drawChart() {
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
        if (!chartCache.labels || !chartCache.datasets || chartCache.totalInvCommon <= 0) return;

        const useLog = yScaleMode === 'log';
        const chartData = datasetsForChart(chartCache.datasets, useLog);

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: { labels: chartCache.labels, datasets: chartData },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                position: mqWide.matches ? 'right' : 'bottom',
                labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
              },
              tooltip: {
                callbacks: {
                  label: function(ctx) {
                    const y = ctx.raw;
                    if (y == null || typeof y !== 'number' || !Number.isFinite(y)) {
                      return ctx.dataset.label + ': —';
                    }
                    return ctx.dataset.label + ': ' + eurFmt.format(y);
                  }
                }
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Tempo', color: '#78788a' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                ticks: { color: '#b0b0b8', maxRotation: 45, minRotation: 0 }
              },
              y: {
                type: useLog ? 'logarithmic' : 'linear',
                title: { display: true, text: 'Valor', color: '#78788a' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                ticks: {
                  color: '#b0b0b8',
                  callback: function(val) {
                    return compactNumFmt.format(val) + ' €';
                  }
                }
              }
            }
          }
        });
      }

      function setYears(v) {
        const n = Math.min(YEARS_MAX, Math.max(YEARS_MIN, parseInt(v, 10) || YEARS_MIN));
        if (rangeEl) {
          rangeEl.value = String(n);
          rangeEl.setAttribute('aria-valuenow', String(n));
        }
        yearsNumEl.value = String(n);
        if (outEl) outEl.textContent = n + ' ' + (n === 1 ? 'ano' : 'anos');
      }

      function setYScaleMode(mode) {
        if (yScaleMode === mode) return;
        yScaleMode = mode;
        const isLinear = mode === 'linear';
        btnScaleLinear.classList.toggle('is-active', isLinear);
        btnScaleLog.classList.toggle('is-active', !isLinear);
        btnScaleLinear.setAttribute('aria-pressed', isLinear ? 'true' : 'false');
        btnScaleLog.setAttribute('aria-pressed', isLinear ? 'false' : 'true');
        drawChart();
      }

      /* --- Simulação completa (inputs → tabela, caches → gráfico) --- */

      function run() {
        const initial = parseMoney(initialEl);
        const monthly = parseMoney(monthlyEl);
        const years = Math.min(YEARS_MAX, Math.max(YEARS_MIN, parseInt(yearsNumEl.value, 10) || YEARS_MIN));
        const custom = parseCustomAnnualRate();

        const labels = yearLabels(years);
        const datasets = [];
        const totalInvCommon = initial + monthly * (years * 12);

        tbody.replaceChildren();

        vehicles.forEach(function(v) {
          const res = simulate(initial, monthly, years, v.rate);
          const pts = yearlyPoints(res.series, years);
          datasets.push(lineDataset(v.label, v.color, pts));
          appendComparisonRow(v.label, res);
        });

        if (custom.include && custom.rateDecimal != null) {
          const resC = simulate(initial, monthly, years, custom.rateDecimal);
          const ptsC = yearlyPoints(resC.series, years);
          const labelC = customVehicleLabel(custom.ratePct);
          datasets.push(lineDataset(labelC, CUSTOM_LINE_COLOR, ptsC));
          appendComparisonRow(labelC, resC);
        }

        chartCache.labels = labels;
        chartCache.datasets = datasets;
        chartCache.totalInvCommon = totalInvCommon;

        if (totalInvCommon <= 0) {
          chartCache.labels = null;
          chartCache.datasets = null;
        }

        drawChart();
      }

      /* --- Eventos --- */

      btnScaleLinear.addEventListener('click', function() { setYScaleMode('linear'); });
      btnScaleLog.addEventListener('click', function() { setYScaleMode('log'); });

      if (rangeEl) {
        rangeEl.addEventListener('input', function() {
          setYears(rangeEl.value);
          run();
        });
      }

      yearsNumEl.addEventListener('input', function() {
        setYears(yearsNumEl.value);
        run();
      });

      initialEl.addEventListener('input', run);
      monthlyEl.addEventListener('input', run);
      customRateEl.addEventListener('input', run);

      setYears(yearsNumEl.value || String(YEARS_MIN));
      run();
    });
