// Footer Component
const Footer = {
  render() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const year = new Date().getFullYear();
    el.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="footer-waves">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="var(--footer-bg)"/>
          </svg>
        </div>
        <div class="footer-body">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="/" class="logo footer-logo" aria-label="BudgetCalc">
                <div class="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <rect width="32" height="32" rx="8" fill="#2563EB"/>
                    <path d="M8 10h16M8 16h10M8 22h13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="24" cy="22" r="4" fill="#F59E0B" stroke="white" stroke-width="1.5"/>
                    <path d="M24 20v4M22 22h4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <span class="logo-text">Budget<span class="logo-accent">Calc</span></span>
              </a>
              <p class="footer-tagline">Your free online budget planner for smarter financial decisions. Plan, track, and achieve your money goals — completely free.</p>
            </div>

            <div class="footer-col">
              <h3 class="footer-heading">Pages</h3>
              <ul class="footer-links">
                <li><a href="about">About</a></li>
                <li><a href="contact">Contact</a></li>
                <li><a href="disclaimer">Disclaimer</a></li>                
              </ul>
            </div>

            <div class="footer-col">
              <h3 class="footer-heading">Learn</h3>
              <ul class="footer-links">
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#tips">Budgeting Tips</a></li>
                <li><a href="#methods">Budget Methods</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h3 class="footer-heading">More Calculators</h3>
              <ul class="footer-links">
                <li><a href="tax-calculator">Tax Calculator</a></li>
                <li><a href="investment-roi">Investment ROI</a></li>
                <li><a href="debt-payoff">Debt Payoff</a></li>
                <li><a href="retirement-planner">Retirement Planner</a></li>
                <li><a href="mortgage-calculator">Mortgage Calculator</a></li>                
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p class="footer-copy">&copy; ${year} BudgetCalc — budgetcalculator.github.io. Free online budget calculator &amp; planner. For educational purposes.</p>
            <div class="footer-legal">
              <a href="privacy">Privacy Policy</a>
              <a href="terms">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};
