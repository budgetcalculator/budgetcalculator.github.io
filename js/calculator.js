// ============================================================
// BudgetCalc — Main Calculator Logic
// budgetcalculator.github.io
// ============================================================

const BudgetCalc = {
  currency: 'GBP',
  period: 'monthly',
  colors: ['#2563EB','#F59E0B','#22C55E','#EC4899','#8B5CF6','#14B8A6','#F97316','#64748B'],
  expenseCount: 0,

  symbols: { GBP: '£', USD: '$', EUR: '€', CAD: 'CA$', AUD: 'A$', INR: '₹' },

  init() {
    this.renderTabs();
    this.renderExpenseRows();
    this.bindCurrencySelect();
    this.bindPeriodSelect();
    this.bindCalculate();
    this.bindReset();
    this.bindExport();
    this.bindFAQs();
    this.initScrollFade();
    this.renderEmptyResults();
  },

  getSymbol() { return this.symbols[this.currency] || '£'; },

  fmt(n) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: this.currency,
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(n);
  },

  renderTabs() {
    const tabs = document.querySelectorAll('.calc-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.dataset.tab;
        document.querySelectorAll('.calc-section-wrap').forEach(s => {
          s.style.display = s.dataset.section === type ? '' : 'none';
        });
      });
    });
  },

  bindCurrencySelect() {
    const sel = document.getElementById('currencySelect');
    if (!sel) return;
    sel.addEventListener('change', e => {
      this.currency = e.target.value;
      document.querySelectorAll('.input-prefix').forEach(el => el.textContent = this.getSymbol());
    });
  },

  bindPeriodSelect() {
    const sel = document.getElementById('periodSelect');
    if (!sel) return;
    sel.addEventListener('change', e => {
      this.period = e.target.value;
    });
  },

  addExpenseRow(name = '', amount = '') {
    const id = ++this.expenseCount;
    const container = document.getElementById('expenseRows');
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.dataset.id = id;
    row.innerHTML = `
      <input class="form-input expense-name" type="text" placeholder="e.g. Streaming" value="${name}" aria-label="Expense name">
      <div class="input-wrap">
        <span class="input-prefix">${this.getSymbol()}</span>
        <input class="form-input has-prefix expense-amount" type="number" min="0" step="0.01" placeholder="0.00" value="${amount}" aria-label="Expense amount">
      </div>
      <button class="btn-remove-expense" data-id="${id}" aria-label="Remove expense">×</button>
    `;
    container.appendChild(row);
    row.querySelector('.btn-remove-expense').addEventListener('click', () => row.remove());
  },

  renderExpenseRows() {
    const btn = document.getElementById('addExpenseBtn');
    if (btn) btn.addEventListener('click', () => this.addExpenseRow());
    // Seed defaults
    const defaults = [['Groceries', 400], ['Transport', 150], ['Entertainment', 100], ['Utilities', 120]];
    defaults.forEach(([n, a]) => this.addExpenseRow(n, a));
  },

  collectData() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    const income = {
      salary:     v('incomeSalary'),
      freelance:  v('incomeFreelance'),
      rental:     v('incomeRental'),
      other:      v('incomeOther'),
    };
    const housing = {
      rent:       v('expenseRent'),
      mortgage:   v('expenseMortgage'),
      insurance:  v('expenseInsurance'),
    };
    const living = {
      food:       v('expenseFood'),
      transport:  v('expenseTransport'),
      health:     v('expenseHealth'),
      clothing:   v('expenseClothing'),
    };
    const savings = {
      emergency:  v('savingsEmergency'),
      retirement: v('savingsRetirement'),
      goals:      v('savingsGoals'),
    };
    const custom = [];
    document.querySelectorAll('.expense-row').forEach(row => {
      const name = row.querySelector('.expense-name')?.value.trim() || 'Other';
      const amt  = parseFloat(row.querySelector('.expense-amount')?.value) || 0;
      if (amt > 0) custom.push({ name, amt });
    });
    const mult = this.period === 'annual' ? 1/12 : this.period === 'weekly' ? 4.33 : 1;
    return { income, housing, living, savings, custom, mult };
  },

  calculate() {
    const { income, housing, living, savings, custom, mult } = this.collectData();
    const toM = v => v * mult;
    const totalIncome = (income.salary + income.freelance + income.rental + income.other) * mult;
    const housingTotal = (housing.rent + housing.mortgage + housing.insurance) * mult;
    const livingTotal  = (living.food + living.transport + living.health + living.clothing) * mult;
    const savingsTotal = (savings.emergency + savings.retirement + savings.goals) * mult;
    const customTotal  = custom.reduce((s, e) => s + e.amt, 0) * mult;
    const totalExpenses = housingTotal + livingTotal + savingsTotal + customTotal;
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savingsTotal / totalIncome) * 100 : 0;
    return { totalIncome, housingTotal, livingTotal, savingsTotal, customTotal, totalExpenses, balance, savingsRate, custom };
  },

  renderResults(r) {
    const panel = document.getElementById('resultsPanel');
    if (!panel) return;

    const surplus = r.balance >= 0;
    const statusClass = Math.abs(r.balance) < 10 ? 'balanced' : surplus ? 'surplus' : 'deficit';
    const statusText  = statusClass === 'balanced' ? '⚖️ Balanced Budget' : surplus ? '✅ Surplus' : '⚠️ Deficit';

    // Donut data
    const cats = [
      { name: 'Housing',  val: r.housingTotal,  color: this.colors[0] },
      { name: 'Living',   val: r.livingTotal,   color: this.colors[1] },
      { name: 'Savings',  val: r.savingsTotal,  color: this.colors[2] },
      { name: 'Other',    val: r.customTotal,   color: this.colors[3] },
    ].filter(c => c.val > 0);

    const donutSVG = this.buildDonut(cats, r.totalExpenses, r.totalIncome);
    const legendHTML = cats.map(c => `
      <div class="legend-item">
        <div class="legend-dot" style="background:${c.color}"></div>
        <span class="legend-name">${c.name}</span>
        <span class="legend-val">${this.fmt(c.val)}</span>
      </div>
    `).join('');

    const spentPct = r.totalIncome > 0 ? Math.min((r.totalExpenses/r.totalIncome)*100, 100) : 0;
    const savPct   = r.totalIncome > 0 ? r.savingsRate.toFixed(1) : 0;

    panel.innerHTML = `
      <div class="results-header">
        <div class="results-title">Monthly Budget Summary</div>
        <div class="results-big-num">${this.fmt(r.totalIncome)}</div>
        <div class="results-subtitle">Total Monthly Income</div>
        <div class="results-status">
          <span class="status-badge ${statusClass}">${statusText} ${this.fmt(Math.abs(r.balance))}</span>
        </div>
      </div>
      <div class="results-body">
        <!-- Donut -->
        <div class="result-section">
          <div class="result-section-label">Spending Breakdown</div>
          <div class="donut-wrap">
            ${donutSVG}
            <div class="donut-center">
              <div class="donut-pct">${spentPct.toFixed(0)}%</div>
              <div class="donut-label">spent</div>
            </div>
          </div>
          <div class="legend-list">${legendHTML}</div>
        </div>

        <div class="result-divider"></div>

        <!-- Totals -->
        <div class="result-section">
          <div class="result-section-label">Summary</div>
          <div class="result-rows">
            <div class="result-row">
              <span class="result-row-name"><span class="result-row-dot" style="background:#22C55E"></span>Total Income</span>
              <span class="result-row-val" style="color:var(--green-600)">${this.fmt(r.totalIncome)}</span>
            </div>
            <div class="result-row">
              <span class="result-row-name"><span class="result-row-dot" style="background:#EF4444"></span>Total Expenses</span>
              <span class="result-row-val" style="color:var(--red-500)">${this.fmt(r.totalExpenses)}</span>
            </div>
          </div>
          <div class="result-total-row" style="margin-top:10px">
            <span class="result-total-label">${surplus ? 'Remaining' : 'Shortfall'}</span>
            <span class="result-total-val" style="color:${surplus?'var(--green-600)':'var(--red-500)'}">${this.fmt(Math.abs(r.balance))}</span>
          </div>
        </div>

        <div class="result-divider"></div>

        <!-- Savings Rate -->
        <div class="result-section">
          <div class="result-section-label">Savings Rate</div>
          <div class="savings-goal-row">
            <div class="savings-bar-bg">
              <div class="savings-bar-fill" style="width:${Math.min(savPct,100)}%;background:${savPct>=20?'var(--green-500)':savPct>=10?'var(--amber-500)':'var(--red-500)'}"></div>
            </div>
            <div class="savings-breakdown">
              <span>${this.fmt(r.savingsTotal)} saved</span>
              <span>${savPct}% of income</span>
            </div>
          </div>
          <p style="font-size:.78rem;color:var(--gray-400);margin-top:8px">
            ${savPct >= 20 ? '🎉 Excellent! You\'re saving 20%+ of your income.' : savPct >= 10 ? '👍 Good progress. Aim for 20% to accelerate goals.' : '⚡ Try to increase savings to at least 10% of income.'}
          </p>
        </div>

        <button class="btn-export" id="exportBtn">📥 Export Summary (CSV)</button>
      </div>
    `;

    document.getElementById('exportBtn')?.addEventListener('click', () => this.exportCSV(r));
  },

  buildDonut(cats, total, income) {
    if (total === 0) return `<svg id="donutChart" width="140" height="140" viewBox="0 0 140 140"><circle cx="70" cy="70" r="54" fill="none" stroke="#E2E8F0" stroke-width="20"/></svg>`;
    const r = 54, cx = 70, cy = 70, circumference = 2 * Math.PI * r;
    let offset = 0;
    const segments = cats.map(c => {
      const pct = c.val / total;
      const dash = pct * circumference;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.color}" stroke-width="20"
        stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
      offset += dash;
      return seg;
    });
    return `<svg id="donutChart" width="140" height="140" viewBox="0 0 140 140" style="transform:rotate(-90deg)">${segments.join('')}</svg>`;
  },

  renderEmptyResults() {
    const panel = document.getElementById('resultsPanel');
    if (!panel) return;
    panel.innerHTML = `
      <div class="results-empty">
        <div class="results-empty-icon">📊</div>
        <div class="results-empty-title">Your results appear here</div>
        <div class="results-empty-desc">Fill in your income and expenses, then click <strong>Calculate Budget</strong> to see your personalised breakdown.</div>
      </div>
    `;
  },

  bindCalculate() {
    document.getElementById('calcBtn')?.addEventListener('click', () => {
      const r = this.calculate();
      this.renderResults(r);
      document.getElementById('resultsPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  },

  bindReset() {
    document.getElementById('resetBtn')?.addEventListener('click', () => {
      document.querySelectorAll('.form-input, .form-select').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      document.getElementById('expenseRows').innerHTML = '';
      this.expenseCount = 0;
      const defaults = [['Groceries', 400], ['Transport', 150], ['Entertainment', 100], ['Utilities', 120]];
      defaults.forEach(([n, a]) => this.addExpenseRow(n, a));
      this.renderEmptyResults();
    });
  },

  bindExport() {
    // delegated — handled in renderResults
  },

  exportCSV(r) {
    const rows = [
      ['BudgetCalc — Monthly Budget Summary', ''],
      ['Generated', new Date().toLocaleDateString('en-GB')],
      ['Currency', this.currency],
      [''],
      ['Category', 'Amount'],
      ['Total Income', r.totalIncome.toFixed(2)],
      ['Housing', r.housingTotal.toFixed(2)],
      ['Living Costs', r.livingTotal.toFixed(2)],
      ['Savings', r.savingsTotal.toFixed(2)],
      ['Other', r.customTotal.toFixed(2)],
      ['Total Expenses', r.totalExpenses.toFixed(2)],
      [r.balance >= 0 ? 'Surplus' : 'Deficit', Math.abs(r.balance).toFixed(2)],
      ['Savings Rate (%)', r.savingsRate.toFixed(1)],
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'budget-summary.csv'; a.click();
    URL.revokeObjectURL(url);
  },

  bindFAQs() {
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  },

  initScrollFade() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  },

  // Counter animation for stats
  animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Header.render();
  Footer.render();
  BudgetCalc.init();

  // Animate counters when stats section visible
  const statsObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { BudgetCalc.animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.stats-strip');
  if (statsEl) statsObs.observe(statsEl);
});
